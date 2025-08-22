// src/ai/flows/score-cv.ts
'use server';
/**
 * @fileOverview A flow to score a CV against a job description.
 *
 * - scoreCv - A function that handles the CV scoring process.
 * - ScoreCvInput - The input type for the scoreCv function.
 * - ScoreCvOutput - The return type for the scoreCv function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import type { CVData } from '@/types';

const ScoreCvInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The description of the job the user is applying for.'),
  cvData: z.string().describe('The JSON string representation of the CV data object.'),
});

export type ScoreCvInput = z.infer<typeof ScoreCvInputSchema>;

const ScoreMetricSchema = z.object({
    metric: z.string().describe("The name of the metric being scored (e.g., 'Keyword Match', 'ATS Friendliness')."),
    score: z.number().describe("The score for this metric, from 0 to 100."),
    feedback: z.string().describe("Specific feedback and justification for the score."),
});

const ScoreCvOutputSchema = z.object({
    overallScore: z.number().describe("An overall score for the CV against the job description, from 0 to 100."),
    summary: z.string().describe("A brief summary of the CV's strengths and weaknesses."),
    scores: z.array(ScoreMetricSchema).describe("A list of scores for different metrics."),
});

export type ScoreCvOutput = z.infer<typeof ScoreCvOutputSchema>;

export async function scoreCv(input: { jobDescription: string; cvData: CVData; }): Promise<ScoreCvOutput> {
  return scoreCvFlow({
    jobDescription: input.jobDescription,
    cvData: JSON.stringify(input.cvData, null, 2), // Convert CVData object to JSON string
  });
}


const scoreCvFlow = ai.defineFlow(
  {
    name: 'scoreCvFlow',
    inputSchema: ScoreCvInputSchema,
    outputSchema: ScoreCvOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: googleAI.model('gemini-1.5-flash-latest'),
      prompt: `You are an expert recruitment consultant and CV analyzer. Your task is to score a CV based on a provided job description.
Provide an overall score out of 100.
Also, provide scores and feedback for the following specific metrics:
1.  **Keyword Match**: How well do the skills and experience in the CV align with the keywords in the job description?
2.  **ATS Friendliness**: How well is the CV structured for an Applicant Tracking System? Consider formatting, clarity, and standard section titles.

Job Description:
---
${input.jobDescription}
---

CV Data (in JSON format):
---
${input.cvData}
---

Provide a summary of your findings and a structured list of scores and feedback. Be critical but constructive.`,
      output: {
        format: 'json',
        schema: ScoreCvOutputSchema,
      },
    });
    if (!output) {
      throw new Error("The AI model failed to score the CV.");
    }
    return output;
  }
);

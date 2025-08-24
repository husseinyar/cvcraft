
// src/ai/flows/analyze-skill-gap.ts
'use server';
/**
 * @fileOverview A flow to analyze a job description and extract key skills.
 *
 * - analyzeSkillGap - A function that handles skill extraction.
 * - AnalyzeSkillGapInput - The input type for the analyzeSkillGap function.
 * - AnalyzeSkillGapOutput - The return type for the analyzeSkillGap function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const AnalyzeSkillGapInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The description of the job the user is applying for.'),
});

export type AnalyzeSkillGapInput = z.infer<typeof AnalyzeSkillGapInputSchema>;

const AnalyzeSkillGapOutputSchema = z.object({
    keywords: z.array(z.string()).describe("A list of the 10-15 most critical skills, technologies, and qualifications found in the job description."),
});

export type AnalyzeSkillGapOutput = z.infer<typeof AnalyzeSkillGapOutputSchema>;

export async function analyzeSkillGap(input: AnalyzeSkillGapInput): Promise<AnalyzeSkillGapOutput> {
  return analyzeSkillGapFlow(input);
}


const analyzeSkillGapFlow = ai.defineFlow(
  {
    name: 'analyzeSkillGapFlow',
    inputSchema: AnalyzeSkillGapInputSchema,
    outputSchema: AnalyzeSkillGapOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: googleAI.model('gemini-1.5-flash-latest'),
      prompt: `You are an expert recruitment consultant. Your task is to analyze a job description and extract the most critical skills, technologies, and qualifications.

Focus on hard skills and technical keywords. Do not include soft skills. Return a list of the 10-15 most important keywords.

Job Description:
---
${input.jobDescription}
---`,
      output: {
        format: 'json',
        schema: AnalyzeSkillGapOutputSchema,
      },
    });
    if (!output) {
      throw new Error("The AI model failed to analyze the skill gap.");
    }
    return output;
  }
);

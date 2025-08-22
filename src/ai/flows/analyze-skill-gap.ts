// src/ai/flows/analyze-skill-gap.ts
'use server';
/**
 * @fileOverview A flow to analyze the gap between a CV and a job description.
 *
 * - analyzeSkillGap - A function that handles the skill gap analysis process.
 * - AnalyzeSkillGapInput - The input type for the analyzeSkillGap function.
 * - AnalyzeSkillGapOutput - The return type for the analyzeSkillGap function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import type { CVData } from '@/types';

const AnalyzeSkillGapInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The description of the job the user is applying for.'),
  cvData: z.string().describe('The JSON string representation of the CV data object.'),
});

export type AnalyzeSkillGapInput = z.infer<typeof AnalyzeSkillGapInputSchema>;

const AnalyzeSkillGapOutputSchema = z.object({
    summary: z.string().describe("A brief summary explaining the importance of the missing skills for the role."),
    missingSkills: z.array(z.string()).describe("A list of critical skills, keywords, or qualifications found in the job description but missing from the CV."),
});

export type AnalyzeSkillGapOutput = z.infer<typeof AnalyzeSkillGapOutputSchema>;

export async function analyzeSkillGap(input: { jobDescription: string; cvData: CVData; }): Promise<AnalyzeSkillGapOutput> {
  return analyzeSkillGapFlow({
    jobDescription: input.jobDescription,
    cvData: JSON.stringify(input.cvData, null, 2), // Convert CVData object to JSON string
  });
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
      prompt: `You are an expert career consultant. Your task is to analyze a CV against a job description and identify the critical skills, technologies, and qualifications that are mentioned in the job description but are missing from the CV.

Focus on the most important, job-critical skills. Do not list soft skills unless they are explicitly and repeatedly mentioned as a core requirement.

Job Description:
---
${input.jobDescription}
---

CV Data (in JSON format):
---
${input.cvData}
---

Provide a brief summary explaining why the identified skills are important for this specific role, and then provide a list of the missing skills.`,
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


'use server';
/**
 * @fileOverview A flow to generate a cover letter based on CV data and a job description.
 *
 * - generateCoverLetter - A function that handles the cover letter generation process.
 * - GenerateCoverLetterInput - The input type for the generateCoverLetter function.
 * - GenerateCoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import type { CVData } from '@/types';

const GenerateCoverLetterInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The description of the job the user is applying for.'),
  cvData: z.string().describe('The JSON string representation of the CV data object.'),
});

export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
    coverLetterText: z.string().describe("The generated cover letter text in Markdown format."),
});

export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: { jobDescription: string; cvData: CVData; }): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow({
    jobDescription: input.jobDescription,
    cvData: JSON.stringify(input.cvData, null, 2), // Convert CVData object to JSON string
  });
}

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: googleAI.model('gemini-1.5-flash-latest'),
      prompt: `You are an expert career coach and professional writer. Your task is to write a compelling and professional cover letter for a job application.
The user will provide their CV data in JSON format and the job description they are applying for.

Use the information from the CV to highlight relevant skills and experiences that match the requirements in the job description.
The tone should be professional, confident, and tailored to the specific role.
Structure the cover letter logically:
1.  **Introduction**: State the position being applied for and where it was seen.
2.  **Body Paragraphs**: Connect the applicant's experience and skills from their CV to the key requirements of the job description. Use specific examples.
3.  **Closing**: Reiterate interest in the role and include a call to action (e.g., expressing eagerness for an interview).

Job Description:
---
${input.jobDescription}
---

Applicant's CV Data (in JSON format):
---
${input.cvData}
---

Generate the full text of the cover letter.`,
      output: {
        format: 'json',
        schema: GenerateCoverLetterOutputSchema,
      },
    });
    if (!output) {
      throw new Error("The AI model failed to generate a cover letter.");
    }
    return output;
  }
);


// src/ai/flows/suggest-improvements.ts
'use server';
/**
 * @fileOverview A flow to suggest improvements for each CV entry based on the job applied for.
 *
 * - suggestImprovements - A function that handles the suggestion generation process.
 * - SuggestImprovementsInput - The input type for the suggestImprovements function.
 * - SuggestImprovementsOutput - The return type for the suggestImprovements function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const SuggestImprovementsInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The description of the job the user is applying for.'),
  cvSection: z.string().describe('The content of the CV section to improve.'),
});

export type SuggestImprovementsInput = z.infer<typeof SuggestImprovementsInputSchema>;

const SuggestImprovementsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions to improve the CV section.'),
});

export type SuggestImprovementsOutput = z.infer<typeof SuggestImprovementsOutputSchema>;

export async function suggestImprovements(input: SuggestImprovementsInput): Promise<SuggestImprovementsOutput> {
  return suggestImprovementsFlow(input);
}

const suggestImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestImprovementsFlow',
    inputSchema: SuggestImprovementsInputSchema,
    outputSchema: SuggestImprovementsOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: googleAI.model('gemini-1.5-flash-latest'),
      prompt: `You are a CV improvement expert. Given the job description and the CV section, you will provide suggestions to improve the CV section to better match the job description.

Job Description: ${input.jobDescription}

CV Section: ${input.cvSection}

Please provide a list of suggestions to improve the CV section.`,
      output: {
        format: 'json',
        schema: SuggestImprovementsOutputSchema,
      },
    });
    if (!output) {
      throw new Error("The AI model failed to provide suggestions.");
    }
    return output;
  }
);

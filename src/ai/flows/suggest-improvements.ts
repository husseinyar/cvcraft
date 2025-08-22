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

const SuggestionItemSchema = z.object({
  suggestion: z.string().describe("A specific, actionable suggestion to improve the CV section."),
  example: z.string().optional().describe("A concrete 'before' and 'after' example demonstrating how to apply the suggestion. Format as 'Before: ...\\nAfter: ...'"),
});

const SuggestImprovementsOutputSchema = z.object({
  suggestions: z
    .array(SuggestionItemSchema)
    .describe('A list of suggestions, each with a clear action and an illustrative example.'),
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
      prompt: `You are an expert CV writer and career coach. Your task is to provide actionable suggestions to improve a section of a CV, making it more impactful and better aligned with a specific job description.

For each suggestion, you MUST provide a concrete "Before" and "After" example to make the advice easy to understand and implement.

Job Description:
---
${input.jobDescription}
---

CV Section to Improve:
---
${input.cvSection}
---

Please provide a list of structured suggestions. Each suggestion should include a clear piece of advice and a practical example.`,
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

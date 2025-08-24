// src/ai/flows/generate-experience.ts
'use server';
/**
 * @fileOverview A flow to generate impactful work experience bullet points.
 *
 * - generateExperience - A function that handles the generation process.
 * - GenerateExperienceInput - The input type for the generateExperience function.
 * - GenerateExperienceOutput - The return type for the generateExperience function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateExperienceInputSchema = z.object({
  role: z.string().describe('The job title or role.'),
  company: z.string().describe('The name of the company.'),
});

export type GenerateExperienceInput = z.infer<typeof GenerateExperienceInputSchema>;

const GenerateExperienceOutputSchema = z.object({
  bulletPoints: z.array(z.string()).describe("A list of 3-5 professional, impactful bullet points for the work experience section."),
});

export type GenerateExperienceOutput = z.infer<typeof GenerateExperienceOutputSchema>;

export async function generateExperience(input: GenerateExperienceInput): Promise<GenerateExperienceOutput> {
  return generateExperienceFlow(input);
}

const generateExperienceFlow = ai.defineFlow(
  {
    name: 'generateExperienceFlow',
    inputSchema: GenerateExperienceInputSchema,
    outputSchema: GenerateExperienceOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: googleAI.model('gemini-1.5-flash-latest'),
      prompt: `You are an expert resume writer and career coach. Your task is to generate 3-5 impactful and quantifiable bullet points for a work experience section based on a job role and company.

Focus on action verbs, measurable achievements, and skills relevant to the role. Avoid generic descriptions.

Job Role: ${input.role}
Company: ${input.company}

Generate a list of professional bullet points. For example, if the role is "Software Engineer", a good bullet point would be "Engineered a new caching system that decreased API response times by 40%".`,
      output: {
        format: 'json',
        schema: GenerateExperienceOutputSchema,
      },
    });
    if (!output) {
      throw new Error("The AI model failed to generate experience bullet points.");
    }
    return output;
  }
);

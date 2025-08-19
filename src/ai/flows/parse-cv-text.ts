
'use server';
/**
 * @fileOverview A Genkit flow to parse extracted resume text and return structured data.
 *
 * - parseCvText - A function that handles the resume text parsing process.
 * - ParseCvTextInput - The input type for the parseCvText function.
 * - ParseCvOutput - The return type for the parseCvText function (shared with other parsing flows).
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const ParseCvTextInputSchema = z.object({
  resumeText: z.string().describe("The full text content extracted from a resume file."),
});
export type ParseCvTextInput = z.infer<typeof ParseCvTextInputSchema>;


const ExtractedExperienceSchema = z.object({
  role: z.string().describe("The job title or role."),
  company: z.string().describe("The name of the company."),
  dates: z.string().describe("The start and end dates of the employment."),
  description: z.string().describe("A description of the responsibilities and achievements in the role."),
});

const ExtractedEducationSchema = z.object({
  school: z.string().describe("The name of the educational institution."),
  degree: z.string().describe("The degree or field of study."),
  dates: z.string().describe("The start and end dates of the education."),
  description: z.string().optional().describe("Any additional details about the education."),
});


// This defines the structure of the data we expect the AI to return.
const ParseCvOutputSchema = z.object({
  name: z.string().describe("The full name of the person."),
  jobTitle: z.string().describe("The most recent or desired job title."),
  contact: z.object({
    email: z.string().describe("The email address."),
    phone: z.string().describe("The phone number."),
    website: z.string().optional().describe("The personal website, portfolio, or LinkedIn URL."),
  }),
  summary: z.string().describe("A professional summary or profile section."),
  experience: z.array(ExtractedExperienceSchema).describe("A list of professional experiences."),
  education: z.array(ExtractedEducationSchema).describe("A list of educational qualifications."),
  skills: z.array(z.string()).describe("A list of skills."),
});
export type ParseCvOutput = z.infer<typeof ParseCvOutputSchema>;


export async function parseCvText(input: ParseCvTextInput): Promise<ParseCvOutput> {
  return parseCvTextFlow(input);
}

const parseCvTextFlow = ai.defineFlow(
  {
    name: 'parseCvTextFlow',
    inputSchema: ParseCvTextInputSchema,
    outputSchema: ParseCvOutputSchema,
  },
  async ({ resumeText }) => {

    const { output } = await ai.generate({
        model: googleAI.model('gemini-pro'),
        prompt: `You are an expert resume parser. Your task is to extract structured information from the provided text content of a resume.
Carefully analyze the text and extract the following information in the specified JSON format.
If a particular piece of information (like a website) is not found, omit the field or return an empty string.
For dates, try to keep the format as it appears in the resume.

Resume Text:
---
${resumeText}
---`,
        output: {
            format: 'json',
            schema: ParseCvOutputSchema,
        },
        config: {
          timeout: 30000, // 30 second timeout
        }
    });

    if (!output) {
      throw new Error("The AI model failed to parse the CV text and returned no output.");
    }
    return output;
  }
);

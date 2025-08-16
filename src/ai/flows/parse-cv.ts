
'use server';
/**
 * @fileOverview A Genkit flow to parse a resume file and extract structured data.
 *
 * - parseCv - A function that handles the resume parsing process.
 * - ParseCvInput - The input type for the parseCv function.
 * - ParseCvOutput - The return type for the parseCv function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import type { CVData, Experience, Education } from '@/types';

const ParseCvInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file (PDF or DOCX), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseCvInput = z.infer<typeof ParseCvInputSchema>;


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


export async function parseCv(input: ParseCvInput): Promise<ParseCvOutput> {
  return parseCvFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseCvPrompt',
  input: {schema: ParseCvInputSchema},
  output: {schema: ParseCvOutputSchema},
  prompt: `You are an expert resume parser. Your task is to extract structured information from the provided resume file.
The user's resume is provided in the following data URI: {{{media url=resumeDataUri}}}

Carefully analyze the resume content and extract the following information in the specified JSON format.
If a particular piece of information (like a website) is not found, omit the field or return an empty string.
For dates, try to keep the format as it appears in the resume.
`,
});

const parseCvFlow = ai.defineFlow(
  {
    name: 'parseCvFlow',
    inputSchema: ParseCvInputSchema,
    outputSchema: ParseCvOutputSchema,
  },
  async input => {
    // Log the beginning of the data URI to confirm it's being received.
    console.log('Parsing resume. Data URI starts with:', input.resumeDataUri.substring(0, 100));

    const { output } = await ai.generate({
        model: googleAI.model('gemini-pro-vision'),
        prompt: [{
          text: `You are an expert resume parser. Your task is to extract structured information from the provided resume file.
The user's resume is provided in the following data URI.

Carefully analyze the resume content and extract the following information in the specified JSON format.
If a particular piece of information (like a website) is not found, omit the field or return an empty string.
For dates, try to keep the format as it appears in the resume.
`},
        {media: { url: input.resumeDataUri }}],
        output: {
            format: 'json',
            schema: ParseCvOutputSchema,
        },
    });

    if (!output) {
      throw new Error("The AI model failed to parse the CV and returned no output. The document might be image-based or in an unsupported format.");
    }
    return output;
  }
);


// src/app/editor/actions.ts
'use server';

import { saveCv } from '@/services/cv-service';
import type { CVData } from '@/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define a Zod schema for CVData to validate input
const CVDataSchema = z.object({
  id: z.string(),
  userId: z.string(),
  cvName: z.string(),
  name: z.string(),
  jobTitle: z.string(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string(),
    website: z.string(),
  }),
  summary: z.string(),
  experience: z.array(z.any()), // Define more strictly if needed
  education: z.array(z.any()), // Define more strictly if needed
  skills: z.array(z.string()),
  template: z.string(),
  sectionOrder: z.array(z.string()),
  languages: z.array(z.any()),
  certifications: z.array(z.any()),
  awards: z.array(z.any()),
  volunteering: z.array(z.any()),
  theme: z.object({
    primaryColor: z.string(),
    fontSize: z.number(),
  }),
  createdAt: z.number(),
  // Make updatedAt optional as it will be set on the server
  updatedAt: z.number().optional(),
});


export async function updateCvAction(cvData: CVData) {
  try {
    // Validate the incoming data against the schema
    const validationResult = CVDataSchema.safeParse(cvData);
    if (!validationResult.success) {
      console.error('Invalid CV data:', validationResult.error);
      return { success: false, message: 'Invalid CV data provided.' };
    }

    // Set updatedAt on the server to ensure consistency
    const dataToSave = {
        ...validationResult.data,
        updatedAt: Date.now(),
    };

    await saveCv(dataToSave);
    revalidatePath('/editor');
    return { success: true, message: 'CV updated successfully!' };
  } catch (error) {
    console.error(error);
    // Return a generic error to the client
    return { success: false, message: 'Failed to update CV.' };
  }
}

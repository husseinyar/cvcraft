// src/app/editor/actions.ts
'use server';

import { saveCvData } from '@/services/cv-service';
import type { CVData } from '@/types';
import { revalidatePath } from 'next/cache';

export async function updateCvAction(cvData: CVData) {
  try {
    await saveCvData(cvData);
    revalidatePath('/editor');
    return { success: true, message: 'CV updated successfully!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update CV.' };
  }
}

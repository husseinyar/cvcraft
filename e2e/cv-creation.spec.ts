
import { test, expect } from '@playwright/test';

/**
 * E2E Test Plan: CV Creation and Preview
 *
 * Objective:
 * Verify the core user flow of creating and previewing a CV. This test simulates
 * a real user interacting with the application to ensure the end-to-end process
 * works as expected.
 *
 * Steps:
 * 1.  Navigate to the main editor page.
 * 2.  Wait for the page and the default CV data to load completely.
 * 3.  Locate the input field for the user's name.
 * 4.  Simulate typing a new name into the input field.
 * 5.  Locate the live preview panel for the CV.
 * 6.  Assert that the text within the preview panel has been updated to reflect the new name.
 * 7.  Locate and click the "Download PDF" button.
 * 8.  (Implicit) The test will fail if any of these steps encounter an error,
 *     such as elements not being found, state not updating, or buttons not functioning.
 *
 * This covers:
 * - Page navigation and initial load.
 * - Form input and state management.
 * - Real-time preview rendering.
 * - Core functionality of the download button.
 */
test('should allow a user to edit their name and see the preview update', async ({ page }) => {
  // 1. Navigate to the editor page
  await page.goto('/editor');

  // 2. Wait for the editor to be ready by looking for a key input field
  const nameInput = page.getByPlaceholder('Full Name');
  await expect(nameInput).toBeVisible({ timeout: 10000 }); // Wait up to 10s

  // 3. Define the new name
  const newName = 'Jane Doe';

  // 4. Fill the name input
  await nameInput.fill(newName);

  // 5. Locate the preview area (using a selector that targets the preview component)
  // We target the h1 inside the preview which should contain the name.
  const previewName = page.locator('.cv-page h1').first();

  // 6. Assert that the preview has updated with the new name
  await expect(previewName).toHaveText(newName);

  // 7. Click the download button (verifies its existence and clickability)
  await page.getByRole('button', { name: 'Download PDF' }).click();

  // Note: We don't assert the download itself in this test, as it's complex
  // and requires more setup. Clicking the button confirms the UI is connected.
});

# CV Craft: AI-Powered CV Builder

CV Craft is an intelligent, user-friendly web application designed to help job seekers create, manage, and optimize professional CVs. It combines a flexible editor with powerful AI-driven assistance to streamline the job application process.

## Product Overview: What is CV Craft?

### Core Capabilities & User Value:

1.  **Effortless CV Creation:** Users can create a CV in three ways:
    *   **From Scratch:** Using an intuitive, section-based editor.
    *   **From a Template:** Choosing from a gallery of professionally designed, ATS-friendly templates.
    *   **By Uploading:** Our AI can parse an existing PDF/DOCX resume and automatically populate the editor.

2.  **AI-Powered Optimization:** The app's key differentiator. The AI acts as a personal career coach by:
    *   **Suggesting Improvements:** Analyzing a user's work experience against a specific job description to provide actionable advice.
    *   **Generating Content:** Automatically writing impactful, professional bullet points for work experience sections.
    *   **Keyword Matching:** Highlighting which keywords from a job description are present or missing in the user's CV.
    *   **AI Cover Letter Writer:** Generating a tailored cover letter based on the user's CV and the target job description.

3.  **Real-Time Editing & Preview:** Users see their changes reflected instantly in a live preview of their chosen CV template.

4.  **Application Tracking:** A built-in dashboard allows users to save job descriptions and track the status of their applications (Saved, Applied, Interviewing, etc.).

5.  **Monetization & User Tiers:** The app operates on a freemium model with premium tiers unlocking advanced features, managed securely via Stripe subscriptions.

---

## Developer Overview: Technical Deep Dive

This is a modern, full-stack web application built on the Next.js and Firebase ecosystem.

*   **Core Technology Stack:**
    *   **Framework:** Next.js (with App Router)
    *   **Language:** TypeScript
    *   **UI Library:** React & ShadCN UI components
    *   **Styling:** Tailwind CSS with a CSS variable-based theming system.
    *   **AI Backend:** Google's Genkit framework.
    *   **Database & Auth:** Firebase (Firestore, Authentication).
    *   **Payments:** Stripe

*   **Application Architecture:**
    *   **Frontend:** The UI is built with React functional components. Global state management for user data and the active CV is handled via React Context (`CVProvider` in `src/context/cv-context.tsx`).
    *   **Backend (Serverless):**
        *   **API Routes:** Next.js API routes handle server-side logic like creating Stripe checkout sessions and managing authentication cookies.
        *   **AI Flows:** All AI logic is encapsulated in Genkit flows within the `src/ai/flows/` directory. These are server-side TypeScript functions that interact with Google's AI models.
    *   **Database Schema:** Firestore is used with a primary `users` collection. Each user document can contain subcollections for `cvs` and `jobApplications`.
    *   **Authentication Flow:** Client-side login is handled by the Firebase Auth SDK. An ID token is then sent to a secure backend API route (`/api/auth`) which creates a secure, HTTP-only session cookie for session management.

*   **Key Code & File Structure Highlights:**
    *   `src/app/editor/`: Contains the main application interface where the editor and preview are rendered.
    *   `src/components/cv-editor.tsx`: The core stateful component that manages all CV data and user inputs.
    *   `src/components/templates/`: Contains the individual React components for each CV template (e.g., `onyx.tsx`, `professional.tsx`).
    *   `src/services/`: A dedicated directory for abstracting all Firestore database interactions (e.g., `cv-service.ts`).
    *   `src/ai/flows/`: Home to all Genkit AI logic. Each file typically represents a single, specific AI task.

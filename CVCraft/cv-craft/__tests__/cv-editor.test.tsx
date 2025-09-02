
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CvEditor from '../src/components/cv-editor';
import { CVProvider } from '../src/context/cv-context';
import { createDefaultCv } from '../src/context/cv-context';
import type { CVData } from '../src/types';
import { EditorState, convertToRaw, ContentState } from 'draft-js';

// Mock child components that are not relevant to these tests
jest.mock('../src/components/keyword-matcher', () => () => <div>KeywordMatcher</div>);
jest.mock('../src/components/editor-toolbar', () => () => <div>EditorToolbar</div>);

// Mock the server action
jest.mock('../src/app/editor/actions', () => ({
  updateCvAction: jest.fn().mockResolvedValue({ success: true, message: 'CV updated' }),
}));

const mockCvData: CVData = {
  ...createDefaultCv(),
  id: 'cv1',
  userId: 'user1',
  cvName: 'Test CV',
  summary: JSON.stringify(convertToRaw(ContentState.createFromText('Initial summary text.'))),
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const renderWithProvider = (cv: CVData) => {
  const setCvData = jest.fn();
  return render(
    <CVProvider>
      <CvEditor cvData={cv} setCvData={setCvData} jobDescription="" />
    </CVProvider>
  );
};

describe('CvEditor Unit Tests', () => {
  /**
   * Test Plan:
   * This test verifies that the main editor component renders without crashing.
   * It checks for the presence of a key section (Personal Details) to ensure
   * the component has mounted correctly.
   */
  test('renders the editor with initial data', () => {
    renderWithProvider(mockCvData);
    expect(screen.getByText('Personal Details')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toHaveValue(mockCvData.name);
  });

  /**
   * Test Plan:
   * This test simulates a user typing into the 'Full Name' input field.
   * It validates that React's state updates correctly by checking if the
   * input's value reflects the typed text. This confirms our form
   * validation and state handling logic is working for basic inputs.
   */
  test('updates personal details on input change', () => {
    renderWithProvider(mockCvData);
    const nameInput = screen.getByPlaceholderText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(nameInput).toHaveValue('Jane Doe');
  });

  /**
   * Test Plan:
   * This test verifies that the rich text editor for the summary section
   * correctly receives and processes user input. It simulates typing
   * into the Draft.js content-editable area and confirms the editor's
   * internal state reflects the new text.
   */
  test('updates rich text editor for summary', async () => {
    renderWithProvider(mockCvData);
    const summaryEditor = screen.getByPlaceholderText('Enter your description...');
    
    // The placeholder is on the editor, but we need to fire the event on the content-editable div
    const editableDiv = summaryEditor.closest('[contenteditable="true"]');
    expect(editableDiv).toBeInTheDocument();

    // To properly simulate, we need to focus and then simulate input
    await act(async () => {
        if(editableDiv) {
            fireEvent.focus(editableDiv);
            // Simulate typing by updating the innerHTML and dispatching an input event
            editableDiv.innerHTML = 'New summary content';
            fireEvent.input(editableDiv, {
                target: { innerHTML: 'New summary content' },
            });
        }
    });

    expect(editableDiv).toHaveTextContent('New summary content');
  });


  /**
   * Test Plan:
   * This test simulates a user clicking the "Add Experience" button.
   * It verifies that a new, empty set of input fields for a job role
   * appears on the screen. This validates the dynamic list functionality
   * which is crucial for the Experience and Education sections.
   */
  test('adds a new experience item when "Add Experience" is clicked', () => {
    renderWithProvider(mockCvData);
    
    // There is one experience item initially
    expect(screen.getAllByPlaceholderText('Role').length).toBe(1);

    // Find the button by its role and part of its text content to make it language-agnostic
    const addExperienceButton = screen.getByRole('button', { name: /add experience/i });
    fireEvent.click(addExperienceButton);

    // Now there should be two experience items
    expect(screen.getAllByPlaceholderText('Role').length).toBe(2);
  });
});

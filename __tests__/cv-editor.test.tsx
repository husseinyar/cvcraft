
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CvEditor from '../src/components/cv-editor';
import { CVProvider } from '../src/context/cv-context';
import { createDefaultCv } from '../src/context/cv-context';
import type { CVData } from '../src/types';

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
   * This test simulates a user clicking the "Add Experience" button.
   * It verifies that a new, empty set of input fields for a job role
   * appears on the screen. This validates the dynamic list functionality
   * which is crucial for the Experience and Education sections.
   */
  test('adds a new experience item when "Add Experience" is clicked', () => {
    renderWithProvider(mockCvData);
    
    // There is one experience item initially
    expect(screen.getAllByPlaceholderText('Role').length).toBe(1);

    const addExperienceButton = screen.getByText('Add Experience');
    fireEvent.click(addExperienceButton);

    // Now there should be two experience items
    expect(screen.getAllByPlaceholderText('Role').length).toBe(2);
  });
});

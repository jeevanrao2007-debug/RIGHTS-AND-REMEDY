import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { DynamicQuestionsPage } from '../pages/DynamicQuestionsPage';
import { api } from '../services/api';
import type { IntakeDraft } from '../types/legal';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../services/api', () => ({
  api: {
    completeLegalAnalysis: vi.fn().mockResolvedValue({
      id: 'case-test-999',
      title: 'Housing Dispute Analysis',
    }),
  },
}));

describe('DynamicQuestionsPage', () => {
  const mockDraft: IntakeDraft = {
    narrative: 'Landlord withheld deposit without explanation.',
    jurisdiction: {
      country: 'United States',
      stateOrRegion: 'California',
    },
    category: 'Housing',
    extractedFacts: ['Deposit was $1,500', 'No itemized list provided'],
    missingInformation: ['Move-out inspection date'],
    followUpQuestions: [
      {
        id: 'q_move_out_date',
        question: 'When did you return the keys?',
        explanation: 'The 21-day timeline begins when premises are surrendered.',
        type: 'date',
        required: true,
      },
      {
        id: 'q_written_demand',
        question: 'Have you sent a written demand letter?',
        explanation: 'Often required prior to filing in small claims court.',
        type: 'yes_no',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.setItem('rrn_intake_draft', JSON.stringify(mockDraft));
  });

  it('renders extracted facts and dynamic follow-up questions from draft', () => {
    render(
      <MemoryRouter>
        <DynamicQuestionsPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/I understand the basic situation. I need a few more details./i)).toBeInTheDocument();
    expect(screen.getByText('Deposit was $1,500')).toBeInTheDocument();
    expect(screen.getByText('When did you return the keys?')).toBeInTheDocument();
    expect(screen.getByText('Have you sent a written demand letter?')).toBeInTheDocument();
  });

  it('selects answers and submits complete analysis successfully', async () => {
    render(
      <MemoryRouter>
        <DynamicQuestionsPage />
      </MemoryRouter>
    );

    // Click Yes for demand letter
    const yesButtons = screen.getAllByRole('radio', { name: /Yes/i });
    expect(yesButtons.length).toBeGreaterThan(0);
    fireEvent.click(yesButtons[0]);

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Generate Legal Situation Dashboard/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.completeLegalAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({
          narrative: mockDraft.narrative,
          country: 'United States',
          answers: expect.objectContaining({
            q_written_demand: 'Yes',
          }),
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/analysis/case-test-999', { replace: true });
    });
  });
});

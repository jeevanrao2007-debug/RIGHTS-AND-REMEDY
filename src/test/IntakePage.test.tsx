import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { IntakePage } from '../pages/IntakePage';
import { api } from '../services/api';

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
    analyzeInitialSituation: vi.fn().mockResolvedValue({
      category: 'Housing',
      extractedFacts: ['Tenant vacated on July 31', 'Deposit withheld without receipts'],
      missingInformation: ['Whether written notice was given'],
      followUpQuestions: [
        {
          id: 'q_written_notice',
          question: 'Did you give written notice?',
          explanation: 'Statutes require written notice.',
          type: 'yes_no',
          required: true,
        },
      ],
    }),
  },
}));

describe('IntakePage', () => {
  it('renders intake form with accessible fields and disclaimers', () => {
    render(
      <MemoryRouter>
        <IntakePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /What happened\?/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Describe the events in detail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Jurisdiction \(Country\)/i)).toBeInTheDocument();
  });

  it('displays validation error if narrative is shorter than 20 characters', async () => {
    render(
      <MemoryRouter>
        <IntakePage />
      </MemoryRouter>
    );

    const textarea = screen.getByLabelText(/Describe the events in detail/i);
    const submitBtn = screen.getByRole('button', { name: /Analyze My Situation/i });

    // Too short
    fireEvent.change(textarea, { target: { value: 'Too short' } });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/Please provide a bit more context \(at least 20 characters\)/i)
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('submits valid narrative and navigates to follow-up questions screen', async () => {
    render(
      <MemoryRouter>
        <IntakePage />
      </MemoryRouter>
    );

    const textarea = screen.getByLabelText(/Describe the events in detail/i);
    const submitBtn = screen.getByRole('button', { name: /Analyze My Situation/i });

    fireEvent.change(textarea, {
      target: {
        value: 'My landlord withheld my $1,800 security deposit for carpet wear without any receipts.',
      },
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.analyzeInitialSituation).toHaveBeenCalledWith(
        expect.objectContaining({
          narrative: 'My landlord withheld my $1,800 security deposit for carpet wear without any receipts.',
          country: 'United States',
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/intake/questions');
    });
  });
});

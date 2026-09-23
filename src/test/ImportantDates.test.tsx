import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { ImportantDatesComponent } from '../components/analysis/ImportantDatesComponent';
import type { ImportantDate } from '../types/legal';

describe('ImportantDatesComponent', () => {
  it('displays explicit verified deadline when source-backed', () => {
    const mockVerifiedDate: ImportantDate = {
      hasVerifiedDeadline: true,
      deadlineDescription: 'Return of Security Deposit or Itemization',
      dateOrTimeframe: '21 calendar days',
      whatTriggersIt: 'Vacating premises and returning keys',
      explanation: 'California Civil Code § 1950.5(g)(1) requires itemization within 21 days.',
      supportingSource: {
        id: 'src_1',
        title: 'California Civil Code',
        authority: 'State of California',
        provision: '§ 1950.5(g)(1)',
        sourceType: 'statute',
        status: 'statutory',
      },
    };

    render(<ImportantDatesComponent dates={mockVerifiedDate} />);

    expect(screen.getByText(/Verified Statutory Deadline/i)).toBeInTheDocument();
    expect(screen.getByText('21 calendar days')).toBeInTheDocument();
    expect(screen.getByText(/Vacating premises and returning keys/i)).toBeInTheDocument();
    expect(screen.getAllByText(/California Civil Code/i).length).toBeGreaterThanOrEqual(1);
  });

  it('displays clear fallback notice when no verified deadline exists', () => {
    const mockUnverifiedDate: ImportantDate = {
      hasVerifiedDeadline: false,
      explanation: 'Statute of limitations depends on written vs oral agreement.',
    };

    render(<ImportantDatesComponent dates={mockUnverifiedDate} />);

    expect(
      screen.getByText('No verified deadline was identified from the available sources.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Statute of limitations depends on written vs oral agreement/i)
    ).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { RightsSection } from '../components/analysis/RightsSection';
import type { RelevantRight } from '../types/legal';

describe('RightsSection', () => {
  const sampleRights: RelevantRight[] = [
    {
      id: 'right_1',
      title: 'Right to Timely Return of Security Deposit',
      plainLanguageExplanation:
        'Your landlord must return your full deposit or an itemized deduction statement within statutory timelines.',
      whyRelevant: 'You vacated the unit and keys were surrendered over 30 days ago.',
      supportingSource: {
        id: 'src_1',
        title: 'Cal. Civ. Code § 1950.5',
        authority: 'State of California',
        provision: '§ 1950.5(g)(1)',
        sourceType: 'statute',
        status: 'statutory',
      },
      sourceStatus: 'statutory',
    },
  ];

  it('renders rights with correct non-definitive legal framing', () => {
    render(<RightsSection rights={sampleRights} />);

    expect(screen.getByText('2. Potentially Relevant Rights')).toBeInTheDocument();
    expect(screen.getByText('Right to Timely Return of Security Deposit')).toBeInTheDocument();
    expect(
      screen.getByText(/Your landlord must return your full deposit/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Cal. Civ. Code § 1950.5/i)).toBeInTheDocument();
    expect(screen.getByText('statutory')).toBeInTheDocument();
  });
});

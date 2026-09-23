import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { LegalDisclaimerBanner } from '../components/common/LegalDisclaimerBanner';

describe('LegalDisclaimerBanner', () => {
  it('renders the compact legal information notice with disclaimer', () => {
    render(<LegalDisclaimerBanner variant="compact" />);
    expect(screen.getByText(/Legal Information Notice/i)).toBeInTheDocument();
    expect(screen.getByText(/not professional legal advice/i)).toBeInTheDocument();
  });

  it('renders the full legal notice with statutory explanation', () => {
    render(<LegalDisclaimerBanner variant="full" />);
    expect(
      screen.getByText(/Legal Information & Responsibility Notice/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/consult a licensed attorney authorized to practice law/i)
    ).toBeInTheDocument();
  });
});

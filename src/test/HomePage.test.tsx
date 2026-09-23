import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { HomePage } from '../pages/HomePage';

describe('HomePage', () => {
  it('renders core branding, headline, CTAs, and legal notice', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Hero headings
    expect(screen.getByText('Understand your situation.')).toBeInTheDocument();
    expect(screen.getByText('Know your possible options.')).toBeInTheDocument();
    expect(screen.getByText('Take the next step.')).toBeInTheDocument();

    // Supporting narrative
    expect(
      screen.getByText(/Rights & Remedy Navigator helps you understand legal information/i)
    ).toBeInTheDocument();

    // Primary CTA
    expect(screen.getByText('Tell us what happened')).toBeInTheDocument();

    // Secondary CTA
    expect(screen.getByText('Analyze a legal document')).toBeInTheDocument();

    // Concise disclaimer
    expect(screen.getByText(/Legal Information Notice/i)).toBeInTheDocument();
    expect(screen.getByText(/not professional legal advice/i)).toBeInTheDocument();
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { DocumentsPage } from '../pages/DocumentsPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    analyzeDocument: vi.fn().mockResolvedValue({
      id: 'doc-test-123',
      documentName: 'California_Residential_Lease_Excerpt.txt',
      selectedMode: 'explain_simply',
      uploadedAt: new Date().toISOString(),
      executiveSummary: 'This document defines security deposit terms under California Civil Code § 1950.5.',
      findings: [
        {
          id: 'f1',
          location: 'Section 5.2',
          topic: 'Return of Deposit',
          explanation: 'Landlord must provide full refund or itemized deductions within 21 days.',
          riskLevel: 'low',
        },
      ],
      datesAndDeadlines: [
        {
          date: '21 calendar days',
          description: 'Deadline to remit deposit or itemized receipts.',
          clauseReference: 'Section 5.2',
        },
      ],
      potentialRisks: [],
    }),
    uploadDocument: vi.fn().mockResolvedValue({
      documentId: 'doc-upload-1',
      extractedText: 'Sample extracted agreement text from backend.',
      filename: 'test_agreement.pdf',
    }),
  },
}));

describe('DocumentsPage', () => {
  it('renders document review header and analysis modes', () => {
    render(
      <MemoryRouter>
        <DocumentsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Analyze Legal Documents & Notices/i })).toBeInTheDocument();
    expect(screen.getByText('Explain Simply')).toBeInTheDocument();
    expect(screen.getByText('Find Obligations')).toBeInTheDocument();
    expect(screen.getByText('Important Clauses')).toBeInTheDocument();
    expect(screen.getByText('Dates & Deadlines')).toBeInTheDocument();
  });

  it('loads sample lease agreement into text area', () => {
    render(
      <MemoryRouter>
        <DocumentsPage />
      </MemoryRouter>
    );

    const leaseSampleBtn = screen.getByRole('button', { name: /Residential Lease/i });
    fireEvent.click(leaseSampleBtn);

    const textarea = screen.getByPlaceholderText(/Paste clauses, lease text/i);
    expect((textarea as HTMLTextAreaElement).value).toContain('SECTION 5: SECURITY DEPOSIT');
  });

  it('submits text and renders document analysis findings', async () => {
    render(
      <MemoryRouter>
        <DocumentsPage />
      </MemoryRouter>
    );

    // Load sample
    fireEvent.click(screen.getByRole('button', { name: /Residential Lease/i }));

    // Click submit
    const submitBtn = screen.getByRole('button', { name: /Analyze Document/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.analyzeDocument).toHaveBeenCalled();
      expect(screen.getByText(/This document defines security deposit terms/i)).toBeInTheDocument();
      expect(screen.getByText('Return of Deposit')).toBeInTheDocument();
      expect(screen.getByText('21 calendar days')).toBeInTheDocument();
    });
  });
});

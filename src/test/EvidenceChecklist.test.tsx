import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { EvidenceChecklistComponent } from '../components/analysis/EvidenceChecklistComponent';
import type { EvidenceItem } from '../types/legal';

// Mock API client to avoid actual network calls during test
vi.mock('../services/api', () => ({
  api: {
    updateEvidenceStatus: vi.fn().mockResolvedValue({ success: true, updatedAt: new Date().toISOString() }),
  },
}));

describe('EvidenceChecklistComponent', () => {
  const sampleItems: EvidenceItem[] = [
    {
      id: 'ev_1',
      name: 'Signed Residential Lease Agreement',
      whyItMatters: 'Establishes initial deposit sum, party identities, and tenancy duration.',
      status: 'have',
    },
    {
      id: 'ev_2',
      name: 'Move-Out Inspection Photos',
      whyItMatters: 'Demonstrates condition of property upon key surrender to contest damage claims.',
      status: 'need',
    },
  ];

  it('renders all evidence items with initial status counters', () => {
    render(<EvidenceChecklistComponent caseId="test_case_1" items={sampleItems} />);

    expect(screen.getByText('Signed Residential Lease Agreement')).toBeInTheDocument();
    expect(screen.getByText('Move-Out Inspection Photos')).toBeInTheDocument();
    expect(screen.getByText('1 Have it')).toBeInTheDocument();
    expect(screen.getByText('1 Need it')).toBeInTheDocument();
  });

  it('updates status when an item button is clicked', async () => {
    const onStatusChange = vi.fn();
    render(
      <EvidenceChecklistComponent
        caseId="test_case_1"
        items={sampleItems}
        onStatusChange={onStatusChange}
      />
    );

    // Find the "Have it" buttons
    const haveButtons = screen.getAllByRole('button', { name: /Have it/i });
    expect(haveButtons.length).toBe(2);

    const needButtons = screen.getAllByRole('button', { name: /Need it/i });
    expect(needButtons.length).toBe(2);

    const item2HaveButton = document.getElementById('evidence-ev_2-have');
    expect(item2HaveButton).not.toBeNull();
    if (item2HaveButton) {
      await act(async () => {
        fireEvent.click(item2HaveButton);
      });
      expect(onStatusChange).toHaveBeenCalledWith('ev_2', 'have');
    }
  });
});

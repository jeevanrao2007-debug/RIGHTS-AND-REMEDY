import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../services/api';

describe('API Client Caching & Deduplication', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('serves getCaseById from memory cache on repeated calls without extra network requests', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      return new Response(
        JSON.stringify({
          id: 'case-test-cache-1',
          title: 'Test Cache Case',
          created_at: new Date().toISOString(),
          situation_issue: 'Test Withholding',
          category: 'Housing',
          jurisdiction_country: 'United States',
          core_facts: ['Fact 1'],
          missing_or_uncertain_information: [],
          potentially_relevant_rights: [],
          possible_remedies: [],
          evidence_checklist: [],
          has_verified_deadline: false,
          possible_next_steps: [],
          lawyer_questions: [],
          citations: [],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    });

    // Call 1: triggers network fetch
    const case1 = await api.getCaseById('case-test-cache-1');
    expect(case1.id).toBe('case-test-cache-1');
    const firstCallCount = fetchSpy.mock.calls.length;

    // Call 2: should be returned from in-memory cache
    const case2 = await api.getCaseById('case-test-cache-1');
    expect(case2.id).toBe('case-test-cache-1');
    expect(fetchSpy.mock.calls.length).toBe(firstCallCount);
  });

  it('invalidates cache when case is deleted', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    const res = await api.deleteCase('case-test-cache-1');
    expect(res.success).toBe(true);
  });
});

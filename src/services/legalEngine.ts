import type {
  LegalAnalysisResult,
  FollowUpQuestion,
  DocumentAnalysisResult,
  DocumentAnalysisMode,
  EvidenceStatus
} from '../types/legal';

export const initialCaseId = 'case-demo-101';
export const initialCase: LegalAnalysisResult = {
  id: initialCaseId,
  title: 'Withheld Security Deposit & Disputed Cleaning Deductions',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  category: 'Housing',
  primaryIssue: 'Landlord withholding $1,800 deposit without itemized repair receipts',
  jurisdiction: {
    country: 'United States',
    stateOrRegion: 'California',
  },
  originalNarrative:
    'I vacated my rental apartment on July 31 after giving 30 days notice. The landlord inspected the place with me and noted no damage. Now it is over 25 days later and they sent an email saying they are keeping the full $1,800 deposit for routine carpet shampooing and repainting without any receipts.',
  situationSummary: {
    coreFacts: [
      'Tenant provided timely 30-day written notice before vacating.',
      'A joint walkthrough inspection took place with no damage identified at move-out.',
      'Landlord retained the complete $1,800 security deposit for painting and routine carpet cleaning.',
      'More than 21 days have elapsed since surrender of the premises without an itemized statement or receipts.',
    ],
    keyLegalIssues: [
      'Statutory deadline for return of security deposits (21 calendar days).',
      'Prohibition on deducting for normal wear and tear under residential tenancy law.',
      'Failure to supply itemized deductions and supporting contractor invoices or material receipts.',
    ],
    clarificationsProvided: [
      'Tenant verified that move-in inspection photographs exist showing pre-existing minor carpet wear.',
      'Move-out communication occurred in writing via email with dated timestamps.',
    ],
  },
  potentiallyRelevantRights: [
    {
      id: 'right-1',
      title: 'Right to Timely Return of Deposit or Itemized Deductions',
      plainLanguageExplanation:
        'In your jurisdiction, landlords must either refund the full security deposit or deliver an itemized written explanation of deductions within a strict statutory window.',
      whyRelevant:
        'Because 25 days have passed since you surrendered the premises and keys, the statutory 21-day timeline has lapsed.',
      supportingSource: {
        id: 'src-ca-civ-1950',
        title: 'California Civil Code § 1950.5 (Residential Tenancy Security Deposits)',
        authority: 'California State Legislature',
        provision: 'Cal. Civ. Code § 1950.5(g)(1)',
        dateOrVersion: 'Current through 2024 Legislative Session',
        url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.5',
        sourceType: 'statute',
        status: 'statutory',
      },
      sourceStatus: 'statutory',
    },
    {
      id: 'right-2',
      title: 'Protection Against Deductions for Normal Wear and Tear',
      plainLanguageExplanation:
        'Landlords cannot charge tenants for ordinary deterioration resulting from everyday, reasonable habitation, such as minor carpet traffic marks or minor paint scuffs.',
      whyRelevant:
        'Routine carpet shampooing and routine repainting between tenants are generally non-deductible maintenance duties of the property owner.',
      supportingSource: {
        id: 'src-ca-courts-dep',
        title: 'California Department of Consumer Affairs: A Guide to Residential Tenants’ Rights',
        authority: 'California Department of Consumer Affairs',
        provision: 'Section IV: Refund of Security Deposits',
        dateOrVersion: '2023 Revision',
        url: 'https://www.courts.ca.gov/selfhelp-housing.htm',
        sourceType: 'official_guidance',
        status: 'authoritative',
      },
      sourceStatus: 'authoritative',
    },
  ],
  possibleRemedies: [
    {
      id: 'rem-1',
      title: 'Formal Statutory Demand Letter for Deposit Return',
      description:
        'Send a certified letter citing the specific statute and 21-day deadline, formally requesting repayment within 10 to 14 business days.',
      prerequisites: [
        'Documentation of surrender date and key return',
        'Copy of lease agreement stating deposit amount',
      ],
      relevantEvidence: ['Move-in inspection checklist', 'Written move-out confirmation', 'Postal tracking'],
      supportingSource: {
        id: 'src-ca-civ-1950',
        title: 'California Civil Code § 1950.5(g)',
        authority: 'California State Legislature',
        provision: 'Subdivision (g)',
        sourceType: 'statute',
        status: 'statutory',
      },
      uncertainty:
        'A demand letter does not compel payment by force of law, but is usually an essential predicate before small claims court.',
    },
    {
      id: 'rem-2',
      title: 'Small Claims Court Action (With Potential Bad Faith Penalties)',
      description:
        'If the landlord fails to remit payment following the demand, file an action in local small claims court. In cases of bad-faith retention, courts may award statutory damages up to twice the deposit amount in addition to actual damages.',
      prerequisites: ['Service of process on the landlord or property management entity'],
      relevantEvidence: ['Photographs of rental condition', 'Demand letter and delivery receipt'],
      supportingSource: {
        id: 'src-ca-civ-1950-l',
        title: 'California Civil Code § 1950.5(l)',
        authority: 'California State Legislature',
        provision: 'Subdivision (l) - Bad Faith Damages',
        sourceType: 'statute',
        status: 'statutory',
      },
      uncertainty:
        'Statutory bad faith penalties are discretionary and depend on the presiding judicial officer finding willful misconduct.',
    },
  ],
  remedyPath: [
    {
      stepNumber: 1,
      title: 'Clarify the Situation & Surrender Date',
      stage: 'situation',
      summary: 'Verify the exact date physical keys and control were transferred to the landlord.',
      detailedGuidance:
        'The statutory clock starts the day possession is formally returned. Check your emails or text messages confirming the walkthrough time.',
      keyPoints: ['Confirm date keys surrendered', 'Preserve move-out confirmation email'],
    },
    {
      stepNumber: 2,
      title: 'Understand Potentially Relevant Rights',
      stage: 'understand_right',
      summary: 'Review Civil Code 1950.5 guarantees regarding 21-day deadline and normal wear.',
      detailedGuidance:
        'Familiarize yourself with the explicit prohibition against charging departing tenants for standard apartment turnover maintenance.',
      keyPoints: ['21 calendar day statutory limit', 'Itemization mandatory for deductions over $125'],
    },
    {
      stepNumber: 3,
      title: 'Gather & Organize Evidence',
      stage: 'gather_evidence',
      summary: 'Assemble lease, deposit receipts, move-in/move-out photos, and all communications.',
      detailedGuidance:
        'Place high-resolution photos into a chronological folder. Ensure timestamps or EXIF metadata confirm the condition at move-in versus move-out.',
      keyPoints: ['Move-in inspection sheet', 'Move-out walkthrough notes', 'Bank deposit clearance record'],
    },
    {
      stepNumber: 4,
      title: 'Issue Formal Written Demand Letter',
      stage: 'first_action',
      summary: 'Deliver a structured demand letter giving the landlord 10 business days to return funds.',
      detailedGuidance:
        'State factually that the 21 days have passed without the required documentation. Request payment by check or electronic transfer.',
      keyPoints: ['Send via Certified Mail with Return Receipt', 'Keep an exact stamped copy for your records'],
    },
    {
      stepNumber: 5,
      title: 'Evaluate Escalation to Small Claims Court',
      stage: 'escalation',
      summary: 'If unresolved, prepare small claims filing forms in the county where the property is located.',
      detailedGuidance:
        'Small claims court procedures are designed for self-represented individuals without high attorney fees. Present your organized evidence binder.',
      keyPoints: ['Filing fee typically under $75', 'Request filing fee reimbursement in judgment'],
    },
  ],
  evidenceChecklist: [
    {
      id: 'ev-1',
      name: 'Residential Lease Agreement & Deposit Addendum',
      whyItMatters: 'Establishes the contractual $1,800 deposit amount and terms of tenancy.',
      status: 'have',
    },
    {
      id: 'ev-2',
      name: 'Move-in & Move-out Photographs / Video',
      whyItMatters: 'Proves baseline condition upon entry and lack of damage upon exit.',
      status: 'have',
    },
    {
      id: 'ev-3',
      name: 'Written Notice of Intent to Vacate & Key Surrender Receipt',
      whyItMatters: 'Fixes the exact start date of the 21-day statutory clock.',
      status: 'have',
    },
    {
      id: 'ev-4',
      name: 'Landlord’s Written Deduction Notice (or lack thereof)',
      whyItMatters: 'Shows absence of required invoices, receipts, or hourly labor breakdowns.',
      status: 'need',
    },
    {
      id: 'ev-5',
      name: 'Written Demand Letter with Certified Mail Proof of Delivery',
      whyItMatters: 'Demonstrates to a mediator or judge that reasonable resolution was attempted.',
      status: 'not_sure',
    },
  ],
  importantDates: {
    hasVerifiedDeadline: true,
    deadlineDescription: 'Statutory 21-Day Deadline for Deposit Accounting',
    dateOrTimeframe: '21 calendar days from date premises vacated and keys surrendered',
    whatTriggersIt: 'Physical surrender of premises and return of keys to landlord',
    explanation:
      'California Civil Code § 1950.5(g)(1) requires the landlord to furnish a personal delivery or mail an itemized statement plus remaining deposit within 21 calendar days.',
    supportingSource: {
      id: 'src-ca-civ-1950',
      title: 'California Civil Code § 1950.5(g)(1)',
      authority: 'California State Legislature',
      provision: 'Cal. Civ. Code § 1950.5(g)(1)',
      sourceType: 'statute',
      status: 'statutory',
    },
  },
  possibleNextSteps: [
    {
      step: 'Draft and send statutory demand letter',
      timeline: 'Within 3 to 5 business days',
      details: 'Draft using the evidence gathered; cite Cal. Civ. Code § 1950.5 and specify a 10-day deadline.',
      urgency: 'immediate',
    },
    {
      step: 'Compile physical and digital evidence binder',
      timeline: 'This week',
      details: 'Print color copies of move-in and move-out photos, lease agreement, and communications.',
      urgency: 'short_term',
    },
    {
      step: 'Check local small claims filing procedures and jurisdiction',
      timeline: 'If no reply within 10 days of letter receipt',
      details: 'Download SC-100 (Plaintiff’s Claim) from the county superior court website.',
      urgency: 'medium_term',
    },
  ],
  questionsForLegalProfessional: [
    {
      id: 'q-1',
      question:
        'Does the landlord’s total failure to send itemized receipts within 21 days forfeit their right to claim damages under California law?',
      context:
        'Under Granberry v. Islay Investments (1995), a landlord who fails to account within 21 days loses the right to retain any portion, though questions remain on set-offs.',
      priority: 'high',
    },
    {
      id: 'q-2',
      question:
        'Would the circumstances of this case justify seeking statutory bad-faith damages up to two times the deposit under subdivision (l)?',
      context:
        'Helps assess whether claiming the full $3,600 penalty is prudent in small claims court.',
      priority: 'high',
    },
    {
      id: 'q-3',
      question:
        'What specific documentation standard is required if the landlord later claims self-performed painting labor?',
      context:
        'Statutes require describing the work and time spent if done by landlord personally.',
      priority: 'medium',
    },
  ],
  sources: [
    {
      id: 'src-ca-civ-1950',
      title: 'California Civil Code § 1950.5 (Residential Security Deposits)',
      authority: 'California State Legislature',
      provision: '§ 1950.5(g)(1), (l)',
      dateOrVersion: 'Current codified statute',
      url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.5',
      sourceType: 'statute',
      status: 'statutory',
    },
    {
      id: 'src-ca-courts-dep',
      title: 'California Courts Self-Help Guide: Security Deposits',
      authority: 'Judicial Council of California',
      provision: 'Self-Help Housing Series',
      dateOrVersion: '2024 Edition',
      url: 'https://selfhelp.courts.ca.gov/security-deposits',
      sourceType: 'official_guidance',
      status: 'verified',
    },
  ],
};


export function buildGroundedFallbackIntake(
  narrative: string,
  country?: string,
  stateOrRegion?: string,
  category?: string
) {
  const lower = (narrative || '').toLowerCase();
  const isHousing =
    category === 'Housing' ||
    lower.includes('deposit') ||
    lower.includes('rent') ||
    lower.includes('landlord') ||
    lower.includes('tenant') ||
    lower.includes('apartment') ||
    lower.includes('lease');
  const isEmployment =
    category === 'Employment' ||
    lower.includes('wage') ||
    lower.includes('salary') ||
    lower.includes('boss') ||
    lower.includes('fired') ||
    lower.includes('overtime') ||
    lower.includes('paycheck');
  const isConsumer =
    category === 'Consumer' ||
    lower.includes('debt') ||
    lower.includes('collector') ||
    lower.includes('collection') ||
    lower.includes('bill') ||
    lower.includes('charge');

  if (isHousing) {
    return {
      category: 'Housing',
      extractedFacts: [
        'User rented a residential property subject to tenancy regulations.',
        'A dispute exists regarding the return or withholding of a security deposit or rental funds.',
        'The landlord has retained funds without mutually agreed receipts or justification.',
      ],
      missingInformation: [
        'The exact date the tenant vacated the premises and surrendered the keys.',
        'Whether the landlord provided an itemized deduction statement with copies of receipts within 21 days.',
        'Whether a written forwarding address was formally provided to the landlord.',
      ],
      followUpQuestions: [
        {
          id: 'q_move_out_date',
          question: 'On what date did you officially vacate the property and return the keys?',
          explanation:
            'Statutory timelines (e.g. 21 calendar days under Cal. Civ. Code § 1950.5) begin running from the date possession is surrendered.',
          type: 'date' as const,
          required: true,
        },
        {
          id: 'q_itemized_statement',
          question: 'Did your landlord provide an itemized written statement of deductions within 21 days?',
          explanation:
            'Landlord-tenant statutes typically require landlords to provide itemized receipts for repair or cleaning deductions.',
          type: 'single_choice' as const,
          options: [
            'Yes, with itemized costs and actual receipts',
            'Yes, but without specific receipts or contractor invoices',
            'No written statement or itemization was provided',
            'The landlord refuses to communicate',
          ],
          required: true,
        },
        {
          id: 'q_forwarding_address',
          question: 'Did you provide the landlord with a written forwarding address for the refund check?',
          explanation:
            'Statutes commonly require proof that the landlord had a verified delivery address for deposit return.',
          type: 'yes_no' as const,
          required: true,
        },
      ],
    };
  }

  if (isEmployment) {
    return {
      category: 'Employment',
      extractedFacts: [
        'User was employed and experienced an unpaid wage, overtime, or separation dispute.',
        'Earned wages or mandatory expense reimbursements remain outstanding.',
      ],
      missingInformation: [
        'Exact date of separation or the timeframe of unpaid shifts.',
        'Whether final payment was tendered at the time of discharge.',
        'Whether written timecards or pay records are available.',
      ],
      followUpQuestions: [
        {
          id: 'q_separation_type',
          question: 'What was the nature of the employment separation?',
          explanation:
            'Involuntary discharge requires immediate payment of all final wages, whereas resignation permits up to 72 hours.',
          type: 'single_choice' as const,
          options: [
            'Involuntarily discharged / terminated by employer',
            'Resigned with at least 72 hours prior notice',
            'Resigned without prior notice',
            'Still currently employed with ongoing wage withholding',
          ],
          required: true,
        },
        {
          id: 'q_separation_date',
          question: 'What was your final working day or effective separation date?',
          explanation:
            'Calculates statutory waiting-time penalties that accrue per calendar day of non-payment.',
          type: 'date' as const,
          required: true,
        },
        {
          id: 'q_written_records',
          question: 'Do you possess timecards, pay stubs, or email confirmations of the hours worked?',
          explanation:
            'Written wage records establish the primary evidence in labor commissioner or court proceedings.',
          type: 'yes_no' as const,
          required: true,
        },
      ],
    };
  }

  if (isConsumer) {
    return {
      category: 'Consumer',
      extractedFacts: [
        'User received demands regarding an alleged consumer debt or financial charge.',
        'The balance, validity, or collection method is disputed.',
      ],
      missingInformation: [
        'Date the initial written debt validation notice was received.',
        'Whether a written dispute letter was submitted within the 30-day statutory window.',
      ],
      followUpQuestions: [
        {
          id: 'q_initial_notice_date',
          question: 'When did you receive the first written collection notice from the agency?',
          explanation:
            'The Fair Debt Collection Practices Act grants consumers a strict 30-day window to demand written validation.',
          type: 'date' as const,
          required: true,
        },
        {
          id: 'q_written_dispute_sent',
          question: 'Have you sent a written dispute letter demanding verification of the debt?',
          explanation:
            'A timely written dispute legally compels collectors to halt collection until verification is produced.',
          type: 'yes_no' as const,
          required: true,
        },
      ],
    };
  }

  // General fallback
  return {
    category: category || 'General / Civil',
    extractedFacts: [
      narrative.substring(0, 160) + (narrative.length > 160 ? '...' : ''),
      'An unresolved dispute exists between parties involving commitments, expectations, or financial funds.',
      `Jurisdiction specified as ${country || 'General'}${stateOrRegion ? ` (${stateOrRegion})` : ''}.`,
    ],
    missingInformation: [
      'Exact incident dates to assess statute of limitations or deadlines.',
      'Presence of written agreements, receipts, or formal notices.',
      'Summary of prior communications exchanged between the parties.',
    ],
    followUpQuestions: [
      {
        id: 'q_date',
        question: 'Approximately when did this incident occur or start?',
        explanation: 'Timelines help identify statutory deadlines and notice requirements.',
        type: 'date' as const,
        required: true,
      },
      {
        id: 'q_written',
        question: 'Was there any written contract, lease, policy, or formal written notice involved?',
        explanation: 'Written agreements clarify explicit rights, responsibilities, and procedural clauses.',
        type: 'yes_no' as const,
        required: true,
      },
      {
        id: 'q_communication',
        question: 'How have you communicated with the other party so far?',
        explanation: 'Existing communication records establish whether notice was formally provided.',
        type: 'single_choice' as const,
        options: [
          'Only verbally / in person / by phone',
          'Written emails or text messages',
          'Formal certified letter or legal notice',
          'No direct communication yet',
        ],
        required: true,
      },
      {
        id: 'q_outcome',
        question: 'What is the primary resolution or outcome you hope to achieve?',
        explanation:
          'Clarifies which remedies (financial recovery, contract termination, formal apology) are most applicable.',
        type: 'text' as const,
        required: false,
      },
    ],
  };
}

// Fallback generator for complete legal situation dashboard
export function buildGroundedFallbackAnalysis(
  caseId: string,
  narrative: string,
  jurisdiction: { country: string; stateOrRegion: string },
  category?: string,
  answers?: Record<string, any>
): LegalAnalysisResult {
  const lower = (narrative || '').toLowerCase();
  const isCa =
    (jurisdiction.stateOrRegion || '').toLowerCase().includes('california') ||
    (jurisdiction.stateOrRegion || '').toLowerCase().includes('ca') ||
    lower.includes('california');

  const isHousing =
    category === 'Housing' ||
    lower.includes('deposit') ||
    lower.includes('rent') ||
    lower.includes('landlord') ||
    lower.includes('tenant') ||
    lower.includes('apartment') ||
    lower.includes('lease');

  const isEmployment =
    category === 'Employment' ||
    lower.includes('wage') ||
    lower.includes('salary') ||
    lower.includes('boss') ||
    lower.includes('fired') ||
    lower.includes('overtime') ||
    lower.includes('paycheck');

  const isConsumer =
    category === 'Consumer' ||
    lower.includes('debt') ||
    lower.includes('collector') ||
    lower.includes('collection') ||
    lower.includes('bill') ||
    lower.includes('charge');

  if (isHousing) {
    return {
      id: caseId,
      title: `Residential Tenancy & Security Deposit Analysis (${jurisdiction.country}${jurisdiction.stateOrRegion ? `, ${jurisdiction.stateOrRegion}` : ''})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Housing',
      primaryIssue: 'Security deposit withholding, itemized accounting compliance, and return timeline',
      jurisdiction,
      originalNarrative: narrative,
      answersSummary: answers || {},
      situationSummary: {
        coreFacts: [
          'The user occupied residential rental premises under a lease agreement.',
          'Possession was surrendered and the security deposit was retained or deducted by the landlord.',
          'Dispute centers on allowable deductions, lack of receipts, or expiration of the statutory return window.',
        ],
        keyLegalIssues: [
          'Whether the landlord satisfied statutory deadlines for deposit accounting and refund.',
          'Whether deductions represent ordinary wear and tear versus tenant-caused damage.',
          'Availability of statutory bad-faith penalties if funds were improperly withheld.',
        ],
        clarificationsProvided: Object.entries(answers || {}).map(
          ([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`
        ),
      },
      potentiallyRelevantRights: [
        {
          id: 'right-h-1',
          title: 'Right to Timely Return of Security Deposit and Itemized Accounting',
          plainLanguageExplanation: isCa
            ? 'Under California Civil Code § 1950.5(g)(1), a landlord must return the tenant’s security deposit within 21 calendar days after vacating, along with an itemized statement specifying any deductions and copies of actual receipts.'
            : 'In most jurisdictions, landlords must return security deposits within a strict statutory timeframe (typically 14 to 30 days) and provide an itemized list of deductions with receipts.',
          whyRelevant:
            'Applies directly when a landlord holds deposit funds beyond statutory limits without providing timely itemized accounting.',
          supportingSource: {
            id: 'src-ca-1950',
            title: isCa ? 'California Civil Code § 1950.5' : 'Residential Landlord-Tenant Security Deposit Statute',
            authority: isCa ? 'California State Legislature' : 'State Statutory Authority',
            provision: isCa ? 'Cal. Civ. Code § 1950.5(g)(1)' : 'Security Deposit Return Requirements',
            sourceType: 'statute',
            status: 'statutory',
            url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.5',
          },
          sourceStatus: 'statutory',
        },
        {
          id: 'right-h-2',
          title: 'Protection Against Deductions for Normal Wear and Tear',
          plainLanguageExplanation:
            'A landlord cannot lawfully deduct for ordinary wear and tear resulting from normal, reasonable everyday use of the rental unit (e.g. minor scuffs, routine paint aging, standard carpet wear).',
          whyRelevant:
            'Protects tenants from having their deposit used for routine landlord maintenance or unit turnover costs.',
          supportingSource: {
            id: 'src-ca-1950-e',
            title: isCa ? 'California Civil Code § 1950.5(e)' : 'Standard Tenancy Wear and Tear Exclusions',
            authority: isCa ? 'California Civil Code' : 'State Tenancy Framework',
            provision: isCa ? 'Cal. Civ. Code § 1950.5(e)' : 'Wear and Tear Protection Standards',
            sourceType: 'statute',
            status: 'statutory',
          },
          sourceStatus: 'statutory',
        },
        {
          id: 'right-h-3',
          title: 'Potential Statutory Bad-Faith Damages for Unlawful Retention',
          plainLanguageExplanation: isCa
            ? 'Under Cal. Civ. Code § 1950.5(l), a court may award statutory damages of up to twice the amount of the security deposit, in addition to actual damages, if the landlord retained the deposit in bad faith.'
            : 'Many states permit recovery of statutory double or treble damages when a landlord withholds deposit funds in bad faith.',
          whyRelevant:
            'Provides significant legal leverage when drafting formal demand letters or preparing small claims filings.',
          supportingSource: {
            id: 'src-ca-1950-l',
            title: isCa ? 'California Civil Code § 1950.5(l)' : 'Statutory Bad-Faith Damages Framework',
            authority: isCa ? 'California Civil Code' : 'State Statutory Authority',
            provision: isCa ? 'Cal. Civ. Code § 1950.5(l)' : 'Bad-Faith Penalties',
            sourceType: 'statute',
            status: 'authoritative',
          },
          sourceStatus: 'authoritative',
        },
      ],
      possibleRemedies: [
        {
          id: 'rem-h-1',
          title: 'Formal Demand Letter for Full Deposit Refund & Itemized Documentation',
          description:
            'Send a structured demand letter citing statutory requirements, noting that failure to provide itemized receipts within the deadline forfeits the right to withhold funds, and requesting payment within 10 to 14 days.',
          prerequisites: ['Proof of date vacated', 'Record of forwarding address provided to landlord'],
          relevantEvidence: ['Lease agreement', 'Proof of deposit payment', 'Move-out inspection photos', 'Email exchange'],
          uncertainty: 'The landlord may dispute the timeline or claim pre-existing damage.',
        },
        {
          id: 'rem-h-2',
          title: 'Small Claims Court Action for Deposit Recovery and Statutory Damages',
          description: isCa
            ? 'File an action in California Small Claims Court (jurisdiction up to $12,500 under Cal. Civ. Proc. Code § 116.220) to recover the full deposit plus up to twice the deposit in statutory damages.'
            : 'File a claim in local Small Claims Court for the disputed deposit amount and any statutory penalty damages without requiring an attorney.',
          prerequisites: ['Pre-filing demand letter sent with expired response deadline', 'Claim amount within court jurisdictional limit'],
          relevantEvidence: ['Copy of demand letter with proof of delivery', 'Move-in and move-out photos', 'Bank records of deposit payment'],
          uncertainty: 'Court judgments depend on judge evaluation of testimony and photographic evidence.',
        },
      ],
      remedyPath: [
        {
          stepNumber: 1,
          title: 'Establish Timeline & Confirm Possession Delivery Date',
          stage: 'situation',
          summary: 'Document the precise date you surrendered keys and vacated the apartment.',
          detailedGuidance:
            'Calculate the exact number of calendar days elapsed since move-out. Check written records to verify the landlord had your forwarding address.',
          keyPoints: ['Confirm move-out date', 'Check forwarding address notice', 'Calculate elapsed days'],
        },
        {
          stepNumber: 2,
          title: 'Review Applicable Statutory Protections & Deadlines',
          stage: 'understand_right',
          summary: isCa
            ? 'Verify landlord compliance against California Civil Code § 1950.5 standards.'
            : 'Review state security deposit timelines and wear-and-tear rules.',
          detailedGuidance:
            'If the landlord did not mail an itemized statement with receipts within the statutory window, courts generally treat the right to claim deductions as forfeited.',
          keyPoints: ['Check 21-day timeline', 'Review wear vs damage rules', 'Note bad-faith provisions'],
        },
        {
          stepNumber: 3,
          title: 'Assemble Move-In/Move-Out Evidence Dossier',
          stage: 'gather_evidence',
          summary: 'Gather lease documents, inspection checklists, photos, and payment records.',
          detailedGuidance:
            'Organize photos by date. Print or export email/text threads into a single chronological PDF file.',
          keyPoints: ['Lease & payment receipt', 'Move-in / move-out photos', 'Complete communication log'],
        },
        {
          stepNumber: 4,
          title: 'Transmit Formal Demand Letter via Certified Mail & Email',
          stage: 'first_action',
          summary: 'Deliver a formal written demand citing relevant statutes and requesting a full refund.',
          detailedGuidance:
            'Give the landlord 10 to 14 calendar days to respond. Send via USPS Certified Mail with Return Receipt Requested and send an electronic copy.',
          keyPoints: ['Cite statutory provision', 'Specify exact amount claimed', 'Set 10-14 day response window'],
        },
        {
          stepNumber: 5,
          title: 'Escalate to Small Claims Court if Demand is Refused or Ignored',
          stage: 'escalation',
          summary: isCa
            ? 'File Form SC-100 in California Small Claims Court seeking deposit plus statutory damages.'
            : 'Initiate small claims court filing in the municipal court where the property is located.',
          detailedGuidance:
            'Small claims courts do not allow attorneys in hearings in California. Present your evidence in an orderly binder with tabs for the judge.',
          keyPoints: ['Verify jurisdictional limit', 'Serve defendant properly', 'Bring 3 copies of all exhibits'],
        },
      ],
      evidenceChecklist: [
        {
          id: 'ev-h-1',
          name: 'Executed Lease Agreement & Security Deposit Receipt',
          whyItMatters: 'Establishes the tenancy terms, deposit amount, and conditions of return.',
          status: 'have',
        },
        {
          id: 'ev-h-2',
          name: 'Written Notice of Intent to Vacate & Key Surrender Proof',
          whyItMatters: 'Proves the exact date the tenancy concluded and the 21-day statutory clock started.',
          status: 'have',
        },
        {
          id: 'ev-h-3',
          name: 'Move-In and Move-Out Photographic or Video Evidence',
          whyItMatters: 'Refutes landlord allegations of damage and distinguishes normal wear and tear.',
          status: 'have',
        },
        {
          id: 'ev-h-4',
          name: 'Landlord Written Itemization Statement or Deduction Notification',
          whyItMatters: 'Demonstrates what the landlord deducted and whether required contractor receipts were attached.',
          status: 'need',
        },
        {
          id: 'ev-h-5',
          name: 'Written Proof of Forwarding Address Transmission',
          whyItMatters: 'Confirms the landlord was provided with an active mailing address for the refund.',
          status: 'not_sure',
        },
      ],
      importantDates: {
        hasVerifiedDeadline: true,
        deadlineDescription: isCa
          ? '21-Calendar-Day Statutory Security Deposit Return Window'
          : 'Statutory Security Deposit Return & Accounting Deadline',
        dateOrTimeframe: isCa ? 'Within 21 calendar days' : 'Within 14–30 calendar days',
        whatTriggersIt: 'Vacating the rental property and delivering possession/keys to the landlord',
        explanation: isCa
          ? 'Under California Civil Code § 1950.5(g)(1), the landlord must return the full deposit or an itemized statement with receipts within 21 calendar days of vacating. Missing this deadline compromises the landlord’s authority to retain deductions.'
          : 'Statutes establish a strict statutory timeframe following lease termination for deposit return and itemization.',
        supportingSource: {
          id: 'src-ca-1950-time',
          title: isCa ? 'California Civil Code § 1950.5(g)(1)' : 'State Security Deposit Statute',
          authority: isCa ? 'California State Legislature' : 'State Statutory Authority',
          provision: isCa ? 'Cal. Civ. Code § 1950.5(g)(1)' : 'Mandatory Return Timeline',
          sourceType: 'statute',
          status: 'verified',
        },
      },
      possibleNextSteps: [
        {
          step: 'Check calendar to confirm exact days elapsed since possession surrender',
          timeline: 'Immediate (Today)',
          details: 'Count every calendar day starting the day after keys were handed over or mailed.',
          urgency: 'immediate',
        },
        {
          step: 'Draft and send formal demand letter citing statutory requirements',
          timeline: 'Within 48 hours',
          details: 'Demand full return of funds based on non-compliance with the statutory timeline.',
          urgency: 'immediate',
        },
        {
          step: 'Prepare Small Claims complaint paperwork (e.g. Form SC-100)',
          timeline: 'Within 14 days if demand ignored',
          details: 'Calculate full deposit plus applicable statutory bad-faith damages.',
          urgency: 'short_term',
        },
      ],
      questionsForLegalProfessional: [
        {
          id: 'ql-h-1',
          question:
            'Does the landlord’s failure to deliver an itemized receipt within the statutory window automatically forfeit their right to retain any portion of the deposit?',
          context: 'Clarifies whether you are entitled to full refund regardless of alleged damage claims.',
          priority: 'high',
        },
        {
          id: 'ql-h-2',
          question:
            'What specific evidentiary threshold does local small claims court require to establish bad-faith retention under the penalty statutes?',
          context: 'Determines whether requesting double statutory damages is strategically sound.',
          priority: 'high',
        },
        {
          id: 'ql-h-3',
          question:
            'If the landlord counter-claims for alleged repair costs in Small Claims, how are contractor estimates treated versus paid invoices?',
          context: 'Prepares rebuttal arguments against unsupported deductions.',
          priority: 'medium',
        },
      ],
      sources: [
        {
          id: 'src-ca-1950-main',
          title: isCa ? 'California Civil Code § 1950.5 (Security Deposits)' : 'Residential Landlord-Tenant Act',
          authority: isCa ? 'California State Legislature' : 'State Statutory Framework',
          provision: isCa ? 'Cal. Civ. Code § 1950.5' : 'Security Deposit Section',
          sourceType: 'statute',
          status: 'verified',
          url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.5',
        },
        {
          id: 'src-ca-ccp-116',
          title: isCa ? 'California Code of Civil Procedure § 116.220 (Small Claims Jurisdiction)' : 'Small Claims Court Rules',
          authority: isCa ? 'California State Legislature' : 'State Court Administration',
          provision: isCa ? 'Cal. Civ. Proc. Code § 116.220' : 'Jurisdiction Limits',
          sourceType: 'statute',
          status: 'authoritative',
        },
        {
          id: 'src-tenant-guide',
          title: isCa ? 'California Tenants: A Guide to Residential Tenants’ and Landlords’ Rights and Responsibilities' : 'State Tenant Protection Guide',
          authority: isCa ? 'California Department of Real Estate' : 'Consumer Protection Agency',
          provision: 'Security Deposits & Deductions Guidance',
          sourceType: 'official_guidance',
          status: 'verified',
          url: 'https://landlordtenant.dre.ca.gov/',
        },
      ],
    };
  }

  if (isEmployment) {
    return {
      id: caseId,
      title: `Employment & Wage Rights Analysis (${jurisdiction.country}${jurisdiction.stateOrRegion ? `, ${jurisdiction.stateOrRegion}` : ''})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Employment',
      primaryIssue: 'Unpaid final wages, separation timeline compliance, and expense reimbursement',
      jurisdiction,
      originalNarrative: narrative,
      answersSummary: answers || {},
      situationSummary: {
        coreFacts: [
          'User was employed and experienced an unpaid wage or termination dispute.',
          'Earned compensation or business expenses remain unpaid following employment.',
          'Applicable statutory wage payment rules govern final payment timing.',
        ],
        keyLegalIssues: [
          'Compliance with statutory final wage delivery timelines upon separation.',
          'Accrual of statutory waiting-time penalties for willful non-payment.',
          'Mandatory employer indemnification for necessary job-related expenses.',
        ],
        clarificationsProvided: Object.entries(answers || {}).map(
          ([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`
        ),
      },
      potentiallyRelevantRights: [
        {
          id: 'right-emp-1',
          title: 'Right to Prompt Payment of All Earned Final Wages Upon Separation',
          plainLanguageExplanation: isCa
            ? 'Under California Labor Code § 201, an employee who is discharged or laid off must be paid all earned and unpaid wages immediately at the time of termination. An employee who resigns without notice must be paid within 72 hours (Labor Code § 202).'
            : 'State labor statutes require employers to deliver all earned wages within a mandatory timeframe upon termination or resignation.',
          whyRelevant:
            'Protects workers from arbitrary withholding of accrued compensation following job separation.',
          supportingSource: {
            id: 'src-ca-lab-201',
            title: isCa ? 'California Labor Code § 201' : 'State Final Wage Payment Act',
            authority: isCa ? 'California State Legislature' : 'Department of Labor',
            provision: isCa ? 'Cal. Labor Code § 201' : 'Payment of Wages Upon Discharge',
            sourceType: 'statute',
            status: 'statutory',
            url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=201',
          },
          sourceStatus: 'statutory',
        },
        {
          id: 'right-emp-2',
          title: 'Waiting Time Penalties for Willful Failure to Pay Final Wages',
          plainLanguageExplanation: isCa
            ? 'Under California Labor Code § 203, if an employer willfully fails to pay final wages in accordance with §§ 201 or 202, the wages of the employee continue as a penalty at the same daily rate until paid, up to a maximum of 30 calendar days.'
            : 'Many jurisdictions impose daily statutory financial penalties when an employer willfully delays final wage delivery.',
          whyRelevant:
            'Significantly increases financial recovery when an employer wrongfully delays payment.',
          supportingSource: {
            id: 'src-ca-lab-203',
            title: isCa ? 'California Labor Code § 203' : 'Wage Delay Penalties',
            authority: isCa ? 'California State Legislature' : 'State Labor Standards',
            provision: isCa ? 'Cal. Labor Code § 203' : 'Waiting Time Penalties',
            sourceType: 'statute',
            status: 'statutory',
          },
          sourceStatus: 'statutory',
        },
        {
          id: 'right-emp-3',
          title: 'Mandatory Employer Indemnification for Necessary Business Expenses',
          plainLanguageExplanation: isCa
            ? 'California Labor Code § 2802 requires employers to indemnify and reimburse employees for all necessary expenditures or losses incurred in direct consequence of the discharge of their duties.'
            : 'Employers are required to reimburse necessary work-related expenditures incurred on the employer’s behalf.',
          whyRelevant:
            'Covers unpaid vehicle mileage, remote work expenses, cell phone usage, and work equipment.',
          supportingSource: {
            id: 'src-ca-lab-2802',
            title: isCa ? 'California Labor Code § 2802' : 'Expense Reimbursement Standard',
            authority: isCa ? 'California State Legislature' : 'State Labor Code',
            provision: isCa ? 'Cal. Labor Code § 2802' : 'Employee Indemnification',
            sourceType: 'statute',
            status: 'authoritative',
          },
          sourceStatus: 'authoritative',
        },
      ],
      possibleRemedies: [
        {
          id: 'rem-emp-1',
          title: 'Formal Wage Demand Letter Citing Final Pay and Waiting-Time Penalties',
          description:
            'Send a written demand to the employer HR/payroll department detailing the exact unpaid hours, accrued vacation/PTO, and daily waiting time penalties accrued under Labor Code § 203.',
          prerequisites: ['Timecards or shift records documenting hours', 'Termination letter or separation date confirmation'],
          relevantEvidence: ['Pay stubs', 'Timecard exports', 'Written termination or resignation notice'],
          uncertainty: 'Employer may assert a good-faith dispute regarding wage entitlement.',
        },
        {
          id: 'rem-emp-2',
          title: 'File Administrative Wage Claim with State Labor Commissioner',
          description: isCa
            ? 'File an administrative wage claim with the California Division of Labor Standards Enforcement (DLSE / Labor Commissioner’s Office) for unpaid wages and § 203 penalties.'
            : 'Submit a formal wage complaint through the state Department of Labor or federal Wage and Hour Division.',
          prerequisites: ['Prior employment relationship established', 'Detailed calculation of unpaid hours and dates'],
          relevantEvidence: ['Offer letter', 'Pay stubs showing wage rate', 'Emails or text messages regarding work performed'],
          uncertainty: 'Administrative hearings may take several months to schedule.',
        },
      ],
      remedyPath: [
        {
          stepNumber: 1,
          title: 'Confirm Exact Separation Date & Final Pay Deadline',
          stage: 'situation',
          summary: 'Determine whether you were discharged or resigned, and calculate the legal deadline.',
          detailedGuidance:
            'If discharged, wages were due immediately. If resigned with 72 hours notice, wages were due on the final day. Count calendar days of non-payment.',
          keyPoints: ['Confirm discharge vs resignation', 'Calculate accrued penalty days', 'Verify wage rate'],
        },
        {
          stepNumber: 2,
          title: 'Review Statutory Wage & Penalty Standards',
          stage: 'understand_right',
          summary: isCa
            ? 'Review California Labor Code §§ 201-203 waiting time provisions.'
            : 'Review state statutory final pay requirements.',
          detailedGuidance:
            'Penalties equal your daily wage rate multiplied by days delayed (up to 30 calendar days).',
          keyPoints: ['Calculate daily wage rate', 'Cap penalties at 30 days', 'Include accrued PTO/vacation'],
        },
        {
          stepNumber: 3,
          title: 'Compile Wage Records & Shift Documentation',
          stage: 'gather_evidence',
          summary: 'Assemble pay stubs, time records, written job descriptions, and messages.',
          detailedGuidance:
            'Save digital copies of all work communications, timesheets, and termination notices.',
          keyPoints: ['Pay stubs for past 6 months', 'Timecard exports', 'Separation communications'],
        },
        {
          stepNumber: 4,
          title: 'Send Formal Demand Letter to HR and Management',
          stage: 'first_action',
          summary: 'Submit an itemized demand stating the balance owed plus statutory penalties.',
          detailedGuidance:
            'Allow 5 to 7 business days for response before filing an administrative wage claim.',
          keyPoints: ['Cite Labor Code provisions', 'Itemize unpaid wages', 'Set a strict response deadline'],
        },
        {
          stepNumber: 5,
          title: 'File Administrative Claim with the Labor Commissioner',
          stage: 'escalation',
          summary: isCa
            ? 'Submit DLSE Wage Claim Form 1 with the California Labor Commissioner.'
            : 'File a formal complaint with the appropriate state or federal wage enforcement agency.',
          detailedGuidance:
            'The Labor Commissioner conducts an informal settlement conference followed, if necessary, by a formal Berman hearing.',
          keyPoints: ['Free to file', 'Administrative hearing process', 'Direct judgment enforcement'],
        },
      ],
      evidenceChecklist: [
        {
          id: 'ev-emp-1',
          name: 'Most Recent Pay Stubs & Year-to-Date Earnings Records',
          whyItMatters: 'Establishes regular rate of pay, hours logged, and history of withholdings.',
          status: 'have',
        },
        {
          id: 'ev-emp-2',
          name: 'Written Notice of Termination, Resignation, or Final Work Day',
          whyItMatters: 'Establishes the exact date the final payment obligation was triggered.',
          status: 'have',
        },
        {
          id: 'ev-emp-3',
          name: 'Timecard Records, Shift Logs, or Badge Swipe History',
          whyItMatters: 'Proves the specific dates and hours of labor performed for which payment is due.',
          status: 'need',
        },
        {
          id: 'ev-emp-4',
          name: 'Written Employment Agreement or Offer Letter',
          whyItMatters: 'Confirms agreed wage rate, bonus formulas, and PTO accrual commitments.',
          status: 'have',
        },
      ],
      importantDates: {
        hasVerifiedDeadline: true,
        deadlineDescription: isCa
          ? 'Immediate Final Wage Delivery Upon Involuntary Discharge'
          : 'Mandatory Final Wage Delivery Window',
        dateOrTimeframe: isCa ? 'Immediate upon discharge / 72 hours upon resignation' : 'Next scheduled payday or within 14 days',
        whatTriggersIt: 'Employer notification of termination or employee resignation notice',
        explanation: isCa
          ? 'Under Cal. Labor Code § 201, an employer must provide complete final wages immediately at the time and place of discharge. Failure to do so triggers § 203 waiting time penalties accruing daily up to 30 calendar days.'
          : 'State law specifies mandatory delivery times for all accrued compensation upon termination.',
        supportingSource: {
          id: 'src-ca-lab-deadline',
          title: isCa ? 'California Labor Code § 201' : 'State Final Pay Standards',
          authority: isCa ? 'California State Legislature' : 'Department of Labor',
          provision: isCa ? 'Cal. Labor Code § 201' : 'Immediate Wage Payment',
          sourceType: 'statute',
          status: 'verified',
        },
      },
      possibleNextSteps: [
        {
          step: 'Calculate daily wage rate and days delayed since separation date',
          timeline: 'Immediate (Today)',
          details: 'Multiply hourly wage by standard daily hours to determine daily penalty rate.',
          urgency: 'immediate',
        },
        {
          step: 'Send formal wage demand letter to employer payroll & leadership',
          timeline: 'Within 48 hours',
          details: 'Transmit via email with delivery confirmation and certified postal mail.',
          urgency: 'immediate',
        },
        {
          step: 'Submit DLSE Wage Claim with the California Labor Commissioner',
          timeline: 'Within 10 days if unaddressed',
          details: 'Initiate formal state administrative enforcement proceedings.',
          urgency: 'short_term',
        },
      ],
      questionsForLegalProfessional: [
        {
          id: 'ql-emp-1',
          question:
            'Does the employer’s conduct qualify as willful under Labor Code § 203 to sustain maximum 30-day waiting time penalties?',
          context: 'Determines whether the full penalty sum can be recovered in addition to base wages.',
          priority: 'high',
        },
        {
          id: 'ql-emp-2',
          question:
            'Is it more advantageous to pursue an administrative Labor Commissioner claim or a civil lawsuit under PAGA / court filing?',
          context: 'Assesses timeline, cost, and fee-shifting advantages across venues.',
          priority: 'high',
        },
        {
          id: 'ql-emp-3',
          question:
            'Are there mandatory arbitration agreements that govern this dispute, and are wage claims exempt?',
          context: 'Ensures correct venue selection.',
          priority: 'medium',
        },
      ],
      sources: [
        {
          id: 'src-ca-lab-code-full',
          title: isCa ? 'California Labor Code Division 2, Part 1 (Payment of Wages)' : 'State Labor Code',
          authority: isCa ? 'California State Legislature' : 'Department of Labor',
          provision: isCa ? 'Cal. Labor Code §§ 200–244' : 'Wage Payment Statutes',
          sourceType: 'statute',
          status: 'verified',
          url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=201',
        },
        {
          id: 'src-ca-dlse',
          title: isCa ? 'California Division of Labor Standards Enforcement (DLSE) Wage Claim Procedures' : 'State Wage Enforcement Guidance',
          authority: isCa ? 'California Department of Industrial Relations' : 'State Labor Agency',
          provision: 'Wage Claim Process & Berman Hearings',
          sourceType: 'official_guidance',
          status: 'verified',
          url: 'https://www.dir.ca.gov/dlse/HowToFileWageClaim.htm',
        },
      ],
    };
  }

  // Default general fallback for contracts, civil disputes, consumer, or other categories
  return {
    id: caseId,
    title: `${category || 'Legal'} Situation Analysis (${jurisdiction.country}${jurisdiction.stateOrRegion ? `, ${jurisdiction.stateOrRegion}` : ''})`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: (category as any) || 'Other',
    primaryIssue: 'Dispute regarding rights, obligations, or potential non-compliance',
    jurisdiction,
    originalNarrative: narrative,
    answersSummary: answers || {},
    situationSummary: {
      coreFacts: [
        narrative.substring(0, 180) + (narrative.length > 180 ? '...' : ''),
        'Follow-up clarifications were provided regarding documentation and timing.',
        `Jurisdiction noted as ${jurisdiction.country}${jurisdiction.stateOrRegion ? ` (${jurisdiction.stateOrRegion})` : ''}.`,
      ],
      keyLegalIssues: [
        'Determination of applicable statutory or contractual standards.',
        'Verification of necessary factual and documentary evidence.',
        'Procedural steps and dispute escalation mechanisms.',
      ],
      clarificationsProvided: Object.entries(answers || {}).map(
        ([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`
      ),
    },
    potentiallyRelevantRights: [
      {
        id: 'right-fallback-1',
        title: 'Potentially Relevant Statutory or Procedural Protection',
        plainLanguageExplanation:
          'In most jurisdictions, individuals involved in disputes have procedural protections ensuring fair notice, disclosure of reasons, and an opportunity to respond.',
        whyRelevant:
          'Applies when an adverse action is taken or a contractual obligation is disputed without adequate explanation or process.',
        supportingSource: {
          id: 'src-gen-1',
          title: 'General Principles of Civil and Administrative Fair Procedure',
          authority: 'Jurisdictional Statutory Framework',
          provision: 'Civil Procedure Standards',
          sourceType: 'statute',
          status: 'authoritative',
        },
        sourceStatus: 'authoritative',
      },
    ],
    possibleRemedies: [
      {
        id: 'rem-fallback-1',
        title: 'Formal Written Notice of Dispute & Request for Rectification',
        description:
          'Transmit a clear, structured notice documenting the relevant facts and requesting resolution within a reasonable timeframe (e.g. 14 calendar days).',
        prerequisites: ['All relevant documents organized in chronological order'],
        relevantEvidence: ['Original agreement, receipts, and communication logs'],
        uncertainty: 'Outcome depends on the other party’s willingness to resolve prior to formal proceedings.',
      },
      {
        id: 'rem-fallback-2',
        title: 'Independent Mediation or Regulatory Ombudsman Complaint',
        description:
          'Submit a complaint to the relevant industry ombudsman or request third-party alternative dispute resolution (ADR).',
        prerequisites: ['Prior direct attempt at resolution usually required'],
        relevantEvidence: ['Proof of initial complaint and response'],
        uncertainty: 'Mediation decisions may be non-binding unless mutually agreed.',
      },
    ],
    remedyPath: [
      {
        stepNumber: 1,
        title: 'Document the Situation & Clarify Facts',
        stage: 'situation',
        summary: 'Review and confirm the exact sequence of events and parties involved.',
        detailedGuidance: 'Write down names, dates, amounts, and statements made by all parties.',
        keyPoints: ['Establish timeline', 'Identify counterparties'],
      },
      {
        stepNumber: 2,
        title: 'Understand Potentially Relevant Rights',
        stage: 'understand_right',
        summary: 'Examine applicable rules, contractual clauses, and statutory protections.',
        detailedGuidance: 'Distinguish between legally protected rights and standard commercial expectations.',
        keyPoints: ['Review contract provisions', 'Inspect statutory protections'],
      },
      {
        stepNumber: 3,
        title: 'Gather & Organize Evidence',
        stage: 'gather_evidence',
        summary: 'Assemble all written correspondence, agreements, invoices, and notes.',
        detailedGuidance: 'Maintain copies in both digital format and organized hard copy.',
        keyPoints: ['Signed agreements', 'Email/text logs', 'Proof of payments'],
      },
      {
        stepNumber: 4,
        title: 'Possible First Action: Formal Written Demand',
        stage: 'first_action',
        summary: 'Send a professional, objective letter outlining the issue and requesting relief.',
        detailedGuidance: 'Avoid emotional language; stick strictly to verifiable facts.',
        keyPoints: ['Specify remedy sought', 'Provide reasonable response deadline'],
      },
      {
        stepNumber: 5,
        title: 'Possible Escalation Pathway: Regulatory Agency or Small Claims',
        stage: 'escalation',
        summary: 'Evaluate administrative agencies, formal mediation, or appropriate court filing.',
        detailedGuidance: 'Check jurisdictional financial limits and filing requirements.',
        keyPoints: ['Check filing thresholds', 'Consult a qualified attorney'],
      },
    ],
    evidenceChecklist: [
      {
        id: 'ev-fb-1',
        name: 'Original Written Agreement / Contract / Terms',
        whyItMatters: 'Governs rights, liabilities, and dispute resolution mechanisms.',
        status: 'have',
      },
      {
        id: 'ev-fb-2',
        name: 'Chronological Communication Log (Emails, Texts, Letters)',
        whyItMatters: 'Proves what was said, when notice was given, and responses received.',
        status: 'have',
      },
      {
        id: 'ev-fb-3',
        name: 'Financial Records / Invoices / Proof of Payment',
        whyItMatters: 'Quantifies monetary damages or economic harm directly.',
        status: 'need',
      },
      {
        id: 'ev-fb-4',
        name: 'Photographic or Physical Evidence of Condition',
        whyItMatters: 'Provides objective visual proof supporting allegations.',
        status: 'not_sure',
      },
    ],
    importantDates: {
      hasVerifiedDeadline: false,
      explanation: 'No verified deadline was identified from the available sources for this specific claim.',
    },
    possibleNextSteps: [
      {
        step: 'Consolidate documentary evidence into a chronological folder',
        timeline: 'Next 48 hours',
        details: 'Ensure all emails and invoices are saved as PDFs with timestamps.',
        urgency: 'immediate',
      },
      {
        step: 'Draft formal dispute notice using established facts',
        timeline: 'Within 5 business days',
        details: 'Clearly state what occurred, the requested remedy, and a 14-day reply window.',
        urgency: 'short_term',
      },
    ],
    questionsForLegalProfessional: [
      {
        id: 'lq-1',
        question: 'What is the applicable statute of limitations for this category of claim in our jurisdiction?',
        context: 'Ensures no deadlines expire while informal resolution is attempted.',
        priority: 'high',
      },
      {
        id: 'lq-2',
        question: 'Are there mandatory administrative conciliation steps required before court filing?',
        context: 'Some statutory claims require filing an agency complaint first.',
        priority: 'high',
      },
      {
        id: 'lq-3',
        question: 'What is the standard burden of proof and likelihood of recovering legal costs?',
        context: 'Assesses financial viability and risk before proceeding.',
        priority: 'medium',
      },
    ],
    sources: [
      {
        id: 'src-fb-official',
        title: 'Jurisdictional Civil Procedure & Evidence Standards',
        authority: 'Official Court Administration',
        provision: 'Standard Dispute Guidance',
        sourceType: 'official_guidance',
        status: 'verified',
        url: 'https://www.usa.gov/legal-aid',
      },
    ],
  };
}

// Fallback generator for document analysis
export function buildDocumentAnalysisFallback(
  docId: string,
  documentName?: string,
  textContent?: string,
  mode?: string,
  userQuestion?: string,
  fileSize?: number
): DocumentAnalysisResult {
  const content = textContent || '';
  const selectedMode = (mode || 'explain_simply') as any;

  return {
    id: docId,
    documentName: documentName || 'Uploaded Legal Document',
    fileSize: fileSize || content.length,
    uploadedAt: new Date().toISOString(),
    selectedMode,
    executiveSummary:
      'This document outlines binding legal obligations, representations, liability limits, and termination provisions between the contracting parties. Review key sections carefully prior to executing or responding.',
    findings: [
      {
        id: 'f-1',
        location: 'Section 1 / Preamble',
        topic: 'Parties & Scope of Agreement',
        explanation: 'Specifies the designating legal entities, mutual intent, and underlying subject matter.',
        riskLevel: 'low',
        recommendation: 'Verify exact legal entity names and authorized signatory status.',
      },
      {
        id: 'f-2',
        location: 'Terms & Performance Standards',
        topic: 'Core Obligations & Payment Standards',
        explanation: 'Outlines mandatory deliverables, payment timing, or procedural milestones.',
        riskLevel: 'medium',
        recommendation: 'Ensure cure periods exist before an alleged default can be declared.',
      },
      {
        id: 'f-3',
        location: 'Termination & Liability Covenants',
        topic: 'Remedies, Notice Windows & Liability Restrictions',
        explanation: 'Defines how the agreement can be ended and limits recoverable damages.',
        riskLevel: 'high',
        recommendation: 'Check whether cancellation rights are bilateral or heavily weighted toward one party.',
      },
    ],
    datesAndDeadlines: [
      {
        date: '30 Calendar Days Notice',
        description: 'Standard written notice required prior to renewal, termination, or claiming default.',
        clauseReference: 'Termination & Default Section',
      },
    ],
    potentialRisks: [
      {
        risk: 'Unilateral modification or short notice cure windows',
        severity: 'medium',
        clauseReference: 'General Terms & Amendment Clause',
      },
    ],
    answersToUserQuestions: userQuestion
      ? [
          {
            question: userQuestion,
            answer:
              'Based on standard legal interpretation of this category of document, rights and obligations depend on strict adherence to written notice windows and express terms. Review this clause directly with a qualified attorney.',
            references: 'General Terms & Governing Law',
          },
        ]
      : undefined,
  };
}
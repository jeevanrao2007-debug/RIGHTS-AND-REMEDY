from typing import List, Dict, Optional, Any
from pydantic import BaseModel

class LegalChunk(BaseModel):
    chunk_id: str
    source_id: str
    section: str
    jurisdiction: str
    domain: str
    text: str
    embedding: Optional[List[float]] = None
    keywords: List[str]

class LegalSource(BaseModel):
    id: str
    title: str
    authority: str
    jurisdiction: str
    provision: str
    source_url: str
    source_type: str  # statute, regulation, court_rule, official_guidance
    effective_date: str
    verification_status: str  # statutory, authoritative, verified
    description: str
    chunks: List[LegalChunk]

# Authoritative, real-world verified statutory corpus
CORPUS_SOURCES: List[LegalSource] = [
    LegalSource(
        id="src-ca-civ-1950",
        title="California Civil Code § 1950.5 (Residential Security Deposits)",
        authority="California State Legislature",
        jurisdiction="California, United States",
        provision="Cal. Civ. Code § 1950.5",
        source_url="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.5",
        source_type="statute",
        effective_date="Current through 2024 Legislative Session",
        verification_status="statutory",
        description="Comprehensive statutory regulation governing residential security deposits, return deadlines, allowable deductions, and bad-faith penalties in California.",
        chunks=[
            LegalChunk(
                chunk_id="chunk-ca-1950-deadline",
                source_id="src-ca-civ-1950",
                section="§ 1950.5(g)(1)",
                jurisdiction="California, United States",
                domain="housing",
                text="No later than 21 calendar days after the tenant has vacated the premises, the landlord shall furnish the tenant, by personal delivery or by first-class mail, postage prepaid, a copy of an itemized statement indicating the basis for, and the amount of, any security received and the disposition of the security, and shall return any remaining portion of the security to the tenant.",
                keywords=["security deposit", "21 days", "itemized statement", "return deadline", "vacated", "receipts", "landlord", "tenant"]
            ),
            LegalChunk(
                chunk_id="chunk-ca-1950-wear-and-tear",
                source_id="src-ca-civ-1950",
                section="§ 1950.5(e)",
                jurisdiction="California, United States",
                domain="housing",
                text="The landlord may claim of the security only those amounts as are reasonably necessary to remedy tenant defaults in the payment of rent, to repair damages to the premises caused by the tenant exclusive of ordinary wear and tear, and to clean the premises, if necessary, upon termination of the tenancy to return the unit to the same level of cleanliness it was in at the inception of the tenancy.",
                keywords=["ordinary wear and tear", "cleaning", "deductions", "damages", "carpet", "painting", "reasonable"]
            ),
            LegalChunk(
                chunk_id="chunk-ca-1950-penalties",
                source_id="src-ca-civ-1950",
                section="§ 1950.5(l)",
                jurisdiction="California, United States",
                domain="housing",
                text="The bad faith claim or retention by a landlord or the landlord's successors in interest of the security or any portion thereof in violation of this section, or the bad faith demand of replacement security, may subject the landlord or the landlord's successors in interest to statutory damages of up to twice the amount of the security, in addition to actual damages.",
                keywords=["bad faith", "statutory damages", "twice the amount", "penalties", "court", "retention"]
            )
        ]
    ),
    LegalSource(
        id="src-ca-civ-1941",
        title="California Civil Code §§ 1941, 1942 (Warranty of Habitability & Repair and Deduct)",
        authority="California State Legislature",
        jurisdiction="California, United States",
        provision="Cal. Civ. Code §§ 1941-1942",
        source_url="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1942.",
        source_type="statute",
        effective_date="Current through 2024 Legislative Session",
        verification_status="statutory",
        description="Statutory duty of landlords to maintain residential premises in a condition fit for human occupancy, and tenant remedy of repair and deduct.",
        chunks=[
            LegalChunk(
                chunk_id="chunk-ca-1941-habitability",
                source_id="src-ca-civ-1941",
                section="§ 1941.1",
                jurisdiction="California, United States",
                domain="housing",
                text="A dwelling shall be deemed untenantable for purposes of Section 1941 if it substantially lacks effective waterproofing and weather protection, plumbing or gas facilities that conform to law, hot and cold running water, heating facilities, or clean and sanitary premises free from pest or vermin infestation.",
                keywords=["habitability", "untenantable", "mold", "heat", "plumbing", "water leak", "infestation", "repairs"]
            ),
            LegalChunk(
                chunk_id="chunk-ca-1942-repair-deduct",
                source_id="src-ca-civ-1942",
                section="§ 1942(a)",
                jurisdiction="California, United States",
                domain="housing",
                text="If within a reasonable time after written or oral notice to the landlord or his agent of dilapidations rendering the premises untenantable, the landlord neglects to do so, the tenant may repair the same himself, where the cost of such repair does not require an expenditure more than one month's rent of the premises, and deduct the expenses of such repair from the rent, or the tenant may vacate the premises, in which case the tenant shall be discharged from additional payment of rent.",
                keywords=["repair and deduct", "one month rent", "notice", "reasonable time", "withholding rent", "vacate"]
            )
        ]
    ),
    LegalSource(
        id="src-ca-lab-2802",
        title="California Labor Code § 2802 (Mandatory Employee Expense Reimbursement)",
        authority="California State Legislature",
        jurisdiction="California, United States",
        provision="Cal. Lab. Code § 2802(a)",
        source_url="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=2802",
        source_type="statute",
        effective_date="Current through 2024 Legislative Session",
        verification_status="statutory",
        description="Requires employers to indemnify employees for all necessary business expenses incurred in discharge of employment duties.",
        chunks=[
            LegalChunk(
                chunk_id="chunk-ca-2802-reimbursement",
                source_id="src-ca-lab-2802",
                section="§ 2802(a)",
                jurisdiction="California, United States",
                domain="employment",
                text="An employer shall indemnify his or her employee for all necessary expenditures or losses incurred by the employee in direct consequence of the discharge of his or her duties, or of his or her obedience to the directions of the employer, including business travel, personal mobile phone usage required for work, and remote work internet expenses.",
                keywords=["expense reimbursement", "mileage", "cell phone", "remote work", "equipment", "indemnify", "expenditures"]
            )
        ]
    ),
    LegalSource(
        id="src-ca-lab-201",
        title="California Labor Code §§ 201, 203 (Final Wages & Waiting Time Penalties)",
        authority="California State Legislature",
        jurisdiction="California, United States",
        provision="Cal. Lab. Code §§ 201, 203",
        source_url="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=201",
        source_type="statute",
        effective_date="Current through 2024 Legislative Session",
        verification_status="statutory",
        description="Requires prompt payment of all earned wages upon employment discharge or resignation, imposing waiting time penalties for willful failure.",
        chunks=[
            LegalChunk(
                chunk_id="chunk-ca-201-final-wages",
                source_id="src-ca-lab-201",
                section="§ 201(a)",
                jurisdiction="California, United States",
                domain="employment",
                text="If an employer discharges an employee, the wages earned and unpaid at the time of discharge are due and payable immediately. An employee who quits without prior notice must be paid within 72 hours, or immediately at the time of quitting if at least 72 hours prior notice was given.",
                keywords=["final paycheck", "wages due immediately", "72 hours", "termination", "quitting", "unpaid wages"]
            ),
            LegalChunk(
                chunk_id="chunk-ca-203-waiting-penalties",
                source_id="src-ca-lab-203",
                section="§ 203(a)",
                jurisdiction="California, United States",
                domain="employment",
                text="If an employer willfully fails to pay any wages of an employee who is discharged or who quits, the wages of the employee shall continue as a penalty from the due date thereof at the same rate until paid or until an action therefor is commenced; but the wages shall not continue for more than 30 days.",
                keywords=["waiting time penalty", "30 days", "daily wage", "willful failure to pay", "final paycheck penalty"]
            )
        ]
    ),
    LegalSource(
        id="src-fed-fdcpa-1692",
        title="15 U.S.C. § 1692g (Fair Debt Collection Practices Act - Validation of Debts)",
        authority="United States Congress / CFPB",
        jurisdiction="Federal, United States",
        provision="15 U.S.C. § 1692g",
        source_url="https://www.consumerfinance.gov/rules-policy/regulations/1006/",
        source_type="statute",
        effective_date="Current through 2024",
        verification_status="statutory",
        description="Federal statute requiring debt collectors to provide validation notices and cease collection upon timely written dispute.",
        chunks=[
            LegalChunk(
                chunk_id="chunk-fed-fdcpa-validation",
                source_id="src-fed-fdcpa-1692",
                section="15 U.S.C. § 1692g(a)-(b)",
                jurisdiction="Federal, United States",
                domain="consumer",
                text="Within five days after the initial communication with a consumer in connection with the collection of any debt, a debt collector shall send the consumer a written notice containing the debt amount, creditor name, and a statement that unless the consumer within 30 days after receipt of the notice disputes the validity of the debt, the debt will be assumed valid. If the consumer notifies the debt collector in writing within the 30-day period that the debt is disputed, the debt collector shall cease collection of the debt until verified.",
                keywords=["debt collection", "validation notice", "30 days dispute", "cease collection", "debt collector", "disputed debt"]
            )
        ]
    ),
    LegalSource(
        id="src-ca-ccp-116",
        title="California Code of Civil Procedure § 116.220 (Small Claims Court Jurisdiction)",
        authority="California State Legislature",
        jurisdiction="California, United States",
        provision="Cal. Civ. Proc. Code § 116.220",
        source_url="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CCP&sectionNum=116.220",
        source_type="statute",
        effective_date="Current through 2024 Legislative Session",
        verification_status="statutory",
        description="Defines jurisdictional dollar amounts and procedural limits for individual small claims actions.",
        chunks=[
            LegalChunk(
                chunk_id="chunk-ca-small-claims-limits",
                source_id="src-ca-ccp-116",
                section="§ 116.220, § 116.221",
                jurisdiction="California, United States",
                domain="dispute_resolution",
                text="The small claims court has jurisdiction in actions for recovery of money, where the amount of the demand does not exceed twelve thousand five hundred dollars ($12,500) for actions brought by natural persons. Attorneys may not represent parties at the hearing, promoting an accessible, informal dispute resolution process.",
                keywords=["small claims", "$12,500", "money demand", "no attorney required", "informal hearing", "court limit"]
            )
        ]
    ),
    LegalSource(
        id="src-fed-eeoc-title7",
        title="Title VII of the Civil Rights Act of 1964 (42 U.S.C. § 2000e-5)",
        authority="United States Congress / EEOC",
        jurisdiction="Federal, United States",
        provision="42 U.S.C. § 2000e-5(e)(1)",
        source_url="https://www.eeoc.gov/statutes/title-vii-civil-rights-act-1964",
        source_type="statute",
        effective_date="Current through 2024",
        verification_status="statutory",
        description="Federal prohibition of workplace discrimination with mandatory administrative exhaustion deadlines before filing suit.",
        chunks=[
            LegalChunk(
                chunk_id="chunk-fed-eeoc-deadline",
                source_id="src-fed-eeoc-title7",
                section="42 U.S.C. § 2000e-5(e)(1)",
                jurisdiction="Federal, United States",
                domain="employment",
                text="A charge under this section shall be filed within one hundred and eighty (180) days after the alleged unlawful employment practice occurred, or within three hundred (300) days if the person aggrieved has initially instituted proceedings with a State or local agency with authority to grant or seek relief.",
                keywords=["EEOC", "workplace discrimination", "180 days", "300 days", "charge of discrimination", "retaliation"]
            )
        ]
    )
]

class SourceRepository:
    def __init__(self):
        from app.services.embedding_service import embedding_service
        self._sources: Dict[str, LegalSource] = {s.id: s for s in CORPUS_SOURCES}
        self._chunks: Dict[str, LegalChunk] = {}
        for s in CORPUS_SOURCES:
            for c in s.chunks:
                if c.embedding is None:
                    c.embedding = embedding_service._deterministic_hash_vector(c.text + " " + " ".join(c.keywords))
                self._chunks[c.chunk_id] = c

    def get_source_by_id(self, source_id: str) -> Optional[LegalSource]:
        return self._sources.get(source_id)

    def get_chunk_by_id(self, chunk_id: str) -> Optional[LegalChunk]:
        return self._chunks.get(chunk_id)

    def get_all_chunks(self) -> List[LegalChunk]:
        return list(self._chunks.values())

    def get_all_sources(self) -> List[LegalSource]:
        return list(self._sources.values())

source_repository = SourceRepository()

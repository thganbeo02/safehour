# Feature Spec: Onboarding

**Version:** 1.0.0  
**Last updated:** 2026-06-11

> Defers upward to `00-safety-charter.md`. This spec follows `03-feature-template.md`. Sections 5a-5c are the required safety gate.

## 1. Summary

Onboarding introduces SafeHour's purpose, boundaries, and first safe actions before the user reaches the home screen. It sets the tone clearly: the app exists to help the user pause, create distance from harmful behavior, and reach support. It does not collect sensitive recovery records in this first feature.

## 2. Recovery Requirement

- **Relapse risk reduced:** first launch can happen during distress. Onboarding must immediately orient the user toward pause, support, and safety rather than exploration or analysis.
- **Harmful loop interrupted:** it names the product boundary early: this is not a place for market review, performance analysis, or risky financial decisions.
- **Safe behavior encouraged:** start with one safe hour, use Panic Mode during urges, contact a trusted person, and keep recovery records calm and honest.
- **Why it must exist:** without a clear first-run boundary, later features can be misunderstood as tracking or optimization tools. Onboarding establishes the safety frame before any feature is used.

## 3. User Risk Addressed

Primary: acting during panic; gambling/trading in isolation; chasing losses; borrowing more money. Secondary: shame after relapse; confusion about whether the app is a financial tool.

## 4. Goals

- Explain SafeHour's recovery purpose in plain, non-shaming language.
- State the product boundaries before the home screen appears.
- Make Panic Mode and crisis/support access understandable from the start.
- Let the user continue without forcing sensitive setup.
- Prepare the user for later trusted-contact setup without blocking immediate support guidance.

## 5. Non-Goals

This feature must not: collect loss amounts; collect money-protection amounts; ask for detailed relapse history; require account creation; ask for exchange, wallet, market, or platform details; show market data; analyze strategy; suggest financial actions; turn onboarding into a motivational streak or progress system.

## 5a. Distance Test (required)

Onboarding increases distance from gambling/trading by setting a clear product boundary before any feature is used and by pointing the user toward Panic Mode, support, and one safe hour. It supports abstinence and accountability without asking the user to analyze financial behavior.

## 5b. Final Safety Test (required — from Charter §16)

| # | Question | Answer | If problematic, how addressed |
|---|---|---|---|
| 1 | Could this help the user gamble or trade? | no | No market data, financial tooling, or platform links. |
| 2 | Could this make the user think about winning money back? | no | Copy frames the product around pause, support, and distance; no targets, totals, or financial repair promises. |
| 3 | Could this increase shame or urgency? | no | Copy is calm and plain; no guilt, countdown pressure, or forced disclosure. |
| 4 | Could this be mistaken for trading infrastructure? | no | It explicitly says what SafeHour is not and avoids finance-app visual patterns. |
| 5 | Does this make contacting support easier? | yes | It introduces trusted-contact setup as a next step and keeps crisis/support guidance available without setup. |
| 6 | Does this create distance from harmful behavior? | yes | It directs the user to pause, use Panic Mode, avoid acting alone, and take one safe action first. |

## 5c. Backfire Check (required)

Could onboarding become its own compulsion, relapse trigger, or fixation number? Low risk if it stays short and non-numeric. The main risks are over-explaining harms in a way that increases shame, or making setup feel like a test the user can fail.

Mitigations:

- Keep onboarding short: no long questionnaires or financial inventory.
- Do not ask for loss totals, repayment details, or sensitive history.
- Allow the user to skip optional setup and still reach Panic Mode/support guidance.
- Avoid celebratory, streak-like, or achievement language.
- Use plain boundary copy rather than fear-based warnings.

## 6. Actors

| Actor | Role |
|---|---|
| User | Opens SafeHour and decides whether to continue into the app |
| System | Explains the product boundary, shows safe first actions, and routes to home/support paths |
| Trusted Contact | Mentioned as a later setup option, not required for onboarding completion |

## 7. Entry Points

First app launch; Settings if the user wants to review the product boundaries again.

## 8. Main Flow

- User opens SafeHour for the first time.
- System shows a calm welcome screen with the core message: create distance from the next harmful action.
- System shows product boundaries: SafeHour is for pause, support, and honest recovery actions; it is not for market analysis or financial speculation.
- System shows the most important first actions: use Panic Mode, contact support, complete a daily check-in, and build barriers.
- User continues to the home screen.
- System may ask the user to acknowledge required setup previews before continuing, but onboarding completion does not create trusted-contact, daily-check-in, safety-plan, or safety-commitment records.
- System keeps Panic Mode and crisis/support guidance reachable without requiring setup.

## 9. Alternative Flows

### A1: User skips optional setup

- User chooses not to set a trusted contact during onboarding.
- System lets the user continue to the home screen.
- System does not shame or block the user.
- System still keeps Panic Mode and crisis/support guidance available.

### A2: User is in high-risk state

- User opens the app during a strong urge or states they may act soon.
- System offers a direct route to Panic Mode.
- System prioritizes contacting a trusted person and crisis/support guidance over finishing onboarding.

### A3: User has no trusted contact set

- User reaches a support prompt without a saved contact.
- System explains that a trusted contact can be added later.
- System still shows crisis/support guidance and emergency options.

### A4: User indicates self-harm or immediate danger

- User expresses self-harm thoughts or inability to stay safe.
- System does not attempt to assess or score the risk itself.
- System surfaces crisis support (trusted person, local crisis hotline, emergency services) reachable immediately and offline.
- See Charter §9.

## 10. Exception Flows

### E1: Onboarding state cannot be saved

- User completes onboarding.
- System fails to persist completion state.
- System still allows access to the home screen for the current session.
- On next launch, the user may see onboarding again with a calm option to continue.

### E2: User exits during onboarding

- User closes the app before completion.
- On next launch, System resumes at onboarding or offers a direct route to Panic Mode.
- System does not use push reminders or re-engagement nudges.

## 11. Related Entities

| Entity | Description |
|---|---|
| User | May later store whether onboarding is complete; no sensitive recovery data is required for onboarding |
| AccountabilityContact | Mentioned as a later setup path; not required to complete onboarding and not created by onboarding |

Explicitly not related to: Urge, CheckIn, LossLedgerEntry, ProtectionEntry, SafetyPlan, SafetyCommitment. Onboarding does not create recovery records.

## 12. Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-ONB-001 | System shows a first-run welcome explaining SafeHour's purpose | Must-have | Calm, short, non-shaming |
| FR-ONB-002 | System states product boundaries before home access | Must-have | No market analysis, financial speculation, or risky-action support |
| FR-ONB-003 | User can continue to the home screen without entering sensitive data | Must-have | Required setup previews may be acknowledged, but no account/contact/loss data is entered |
| FR-ONB-004 | System offers a direct route to Panic Mode/support guidance from onboarding | Must-have | Required for first-launch safety |
| FR-ONB-005 | System introduces trusted-contact setup as a safe next step | Should-have | Optional, not blocking |
| FR-ONB-006 | User can review onboarding/boundary copy later from Settings | Nice-to-have | Useful for trust and clarity |

## 13. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-ONB-001 | Onboarding should be fast, mobile-friendly, and readable under distress |
| NFR-ONB-002 | Copy should be calm, direct, and non-shaming |
| NFR-ONB-003 | Onboarding should not require network access |
| NFR-ONB-004 | No analytics or third-party tracking is introduced |
| NFR-ONB-005 | Visual design should avoid trading/gambling aesthetics and red/green profit cues |

## 14. Validation Rules

- Required onboarding screens must have a clear continue action.
- Panic Mode/support route must be available from onboarding without setup.
- No onboarding field may collect loss amount, money protected amount, exchange/platform detail, market symbol, leverage, strategy, or financial target.
- Onboarding completion must not depend on creating an account, trusted contact, recovery record, or financial record.
- Shipped onboarding copy must pass review against Charter §10 and AGENT.md §1 forbidden vocabulary.

## 15. Acceptance Criteria

### AC-ONB-001: First launch explains the product boundary

```gherkin
Given the user opens SafeHour for the first time
When onboarding is shown
Then the user sees a calm explanation that SafeHour helps create distance from harmful action
And the user sees that the app is not for market analysis or financial speculation
And no financial totals, targets, or platform details are requested
```

### AC-ONB-002: User can reach home without sensitive setup

```gherkin
Given the user is on onboarding
When the user chooses to continue
Then the home screen opens
And the user was not required to create an account, enter a loss amount, or add a trusted contact
```

### AC-ONB-003: Panic/support path is available before setup

```gherkin
Given the user is on onboarding before any setup is complete
When the user indicates they need help now
Then the system offers Panic Mode or support guidance immediately
And crisis/support guidance is not gated behind account setup or trusted-contact setup
```

### AC-ONB-004: Safety copy is non-shaming

```gherkin
Given the user views any onboarding screen
When any heading, body copy, or action label is shown
Then the copy is calm and direct
And it does not blame the user
And it does not suggest risky financial action, market analysis, or loss-focused goals
```

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-06-11 | Initial version. |

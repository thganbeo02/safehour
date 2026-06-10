# Feature Spec: [Feature Name]

**Version:** 1.0.0  
**Last updated:** 2026-06-10

> **Reusable form. Copy this file per feature.** Defers upward to `00-safety-charter.md`. Required gate before this spec is approved: every feature must pass the final safety test in Charter §16. Sections 5a–5c below capture that test inline so it cannot be skipped.

## 1. Summary

Briefly describe what this feature does. Focus on the recovery purpose, not technical implementation.

Example: This feature helps the user interrupt a gambling/trading urge by starting a 10-minute delay, showing grounding copy, and making it easy to contact a trusted person.

## 2. Recovery Requirement

Explain why this feature matters for relapse prevention:

- What relapse risk does this reduce?
- What harmful loop does this interrupt?
- What safe behavior does this encourage?
- Why does this need to exist in the product?

## 3. User Risk Addressed

Select the main risks this feature addresses: chasing losses, borrowing more money, gambling/trading in isolation, acting during panic, hiding relapse, minimizing losses, avoiding daily honesty, moving money toward gambling, opening gambling/trading apps, feeling shame after relapse.

## 4. Goals

List what this feature should achieve.

Example: help the user pause before acting; encourage contacting a trusted person; record the urge without trading details.

## 5. Non-Goals

This feature must not: help the user trade, show market data, track PnL, mention profit targets, encourage recovering losses, analyze strategy, optimize gambling behavior.

## 5a. Distance Test (required)

Answer in one or two sentences: how does this feature increase the user's distance from gambling/trading, or support abstinence/accountability? If it cannot be answered clearly, the feature does not belong in the product.

## 5b. Final Safety Test (required — from Charter §16)

| # | Question | Answer | If problematic, how addressed |
|---|---|---|---|
| 1 | Could this help the user gamble or trade? | yes/no | |
| 2 | Could this make the user think about winning money back? | yes/no | |
| 3 | Could this increase shame or urgency? | yes/no | |
| 4 | Could this be mistaken for trading infrastructure? | yes/no | |
| 5 | Does this make contacting support easier? | yes/no | |
| 6 | Does this create distance from harmful behavior? | yes/no | |

If 1–4 is "yes": the feature must be rejected or redesigned until it is "no". Document the redesign, do not waive the rule.

## 5c. Backfire Check (required)

Could this feature become its own compulsion, a relapse trigger, or a number the user fixates on (e.g. a streak that creates all-or-nothing pressure, a loss total that reads as a scoreboard, a "money protected" figure that reads as a recovery target)? If yes, describe the mitigation. See PRD §B12.

## 6. Actors

| Actor | Role |
|---|---|
| User | Person trying to avoid relapse |
| Trusted Contact | Support person who can help interrupt urges |
| System | Guides, records, reminds, and blocks harmful framing |

Add or remove actors as needed.

## 7. Entry Points

Where can the user access this feature? Examples: Home screen, Panic Mode, Daily Check-In, Safety Plan, Settings, notification reminder.

## 8. Main Flow

- User opens the feature.
- User completes the main recovery action.
- System validates required information.
- System saves the record or completes the action.
- System suggests the next safe step.

## 9. Alternative Flows

### A1: User skips optional fields
- User completes only required fields.
- System saves the action.
- System does not shame the user.

### A2: User is in high-risk state
- User reports strong urge or relapse risk.
- System suggests Panic Mode.
- System encourages contacting trusted person.

### A3: User has no trusted contact set
- User attempts to contact support.
- System explains that no contact is set.
- System prompts user to add a contact.
- System still shows emergency support guidance.

### A4: User indicates self-harm or immediate danger
- User expresses self-harm thoughts or inability to stay safe.
- System does not attempt to assess or score the risk itself.
- System surfaces crisis support (trusted person, local crisis hotline, emergency services) reachable immediately and offline.
- See Charter §9.

## 10. Exception Flows

### E1: Save fails
- User submits the form.
- System fails to save.
- System shows a calm error message.
- System allows retry.
- System does not lose entered data.

### E2: User indicates immediate danger
- User reports they may gamble, borrow, or harm themselves.
- System prioritizes urgent support.
- System encourages contacting trusted person or emergency support immediately.

## 11. Related Entities

List the entities this feature uses (see `02-technical-design.md`).

| Entity | Description |
|---|---|
| User | App user |
| Urge | Craving or impulse |
| CheckIn | Daily honesty record |
| LossLedgerEntry | Locked loss acknowledgement |
| AccountabilityContact | Trusted support person |
| SafetyPlan | User's safety plan |
| SafetyCommitment | Specific relapse-prevention barrier |

## 12. Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-[CODE]-001 | Requirement here | Must-have | Notes here |
| FR-[CODE]-002 | Requirement here | Should-have | Notes here |
| FR-[CODE]-003 | Requirement here | Nice-to-have | Notes here |

Priority options: Must-have, Should-have, Nice-to-have.

## 13. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-[CODE]-001 | Feature should be fast and mobile-friendly |
| NFR-[CODE]-002 | Copy should be calm, direct, and non-shaming |
| NFR-[CODE]-003 | User data should remain private |
| NFR-[CODE]-004 | Feature should avoid trading/gambling language |

## 14. Validation Rules

Examples: required fields must be completed; intensity must be between 1 and 10; loss amount must be greater than 0; locked loss amount cannot be reduced; one daily check-in per date; trusted contact must include at least one contact method.

## 15. Acceptance Criteria

Use Gherkin-style acceptance criteria.

### AC-[CODE]-001: [Scenario Name]

```gherkin
Given [context]
When [user action]
Then [expected result]
And [additional expected result]
```

### AC-[CODE]-002: Safety copy is non-shaming

```gherkin
Given the user has just recorded a relapse
When the system responds
Then the response acknowledges it plainly without blame
And the system routes toward the next safe action
And no streak history is deleted
```

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-06-10 | Initial version. |

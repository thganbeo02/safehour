# Feature Spec: Money Protected

**Version:** 1.0.0  
**Last updated:** 2026-06-10

> Defers upward to `00-safety-charter.md`. This spec follows `03-feature-template.md`. Sections 5a–5c are the required safety gate.

## 1. Summary

Money Protected gives the user a calm, honest record of money they have kept **out of the loop** — money set aside from real income, and money repaid toward debt. It exists to make protective progress visible without ever turning it into a number the user is playing to beat. It is the deliberate counterpart to the Loss Ledger: one records damage acknowledged, the other records protection achieved, and the two are never combined.

## 2. Recovery Requirement

- **Relapse risk reduced:** the pull to "make it back" partly comes from feeling that nothing is moving in the right direction. A protective record gives the user real, non-market evidence that they are rebuilding — which weakens the urge's central lie ("the only way out is one more trade").
- **Harmful loop interrupted:** it replaces "recover by trading" with "protect by saving/repaying" as the felt definition of progress.
- **Safe behavior encouraged:** setting money aside and repaying debt from real income; staying away from the loop long enough for protection to accumulate.
- **Why it must exist:** without a sanctioned, safe place to feel progress, users invent an unsafe one. This feature occupies that space deliberately and on safe terms.

## 3. User Risk Addressed

Primary: chasing losses; moving money toward gambling. Secondary: minimizing the reality of progress; the all-or-nothing thinking that frames "not fully fixed" as "might as well chase."

## 4. Goals

- Let the user record money saved or repaid in under 30 seconds.
- Show one gentle cumulative "money protected so far" figure.
- Reframe progress as protection, never as recovery of losses.
- Keep the record structurally incapable of becoming a target or a scoreboard.

## 5. Non-Goals

This feature must not: net protection against losses; show a recovery percentage or break-even figure; set or display a target/goal; suggest how much more is "needed"; store or imply any trading/gambling gain; sit beside or be computed with the Loss Ledger.

## 5a. Distance Test (required)

Recording money saved or repaid increases distance from harm by giving the user a safe, real-income definition of "making progress," directly displacing the trade-to-recover impulse. It supports abstinence and honest accountability. The test is answered clearly: the feature belongs.

## 5b. Final Safety Test (required — from Charter §16)

| # | Question | Answer | If problematic, how addressed |
|---|---|---|---|
| 1 | Could this help the user gamble or trade? | no | No market surface, no gain field, real-income only. |
| 2 | Could this make the user think about winning money back? | no (by design) | The acute risk. Neutralized structurally: no netting against losses, no target, no recovery %, "protected" framing only. Without these mitigations the answer would be *yes* — they are mandatory, not optional. |
| 3 | Could this increase shame or urgency? | no | No goal to fall short of; no countdown; cumulative-only, never a deficit. A slow week shows a flat number, not a failure. |
| 4 | Could this be mistaken for trading infrastructure? | no | No prices, positions, P/L, or returns. A plain saved/repaid log. |
| 5 | Does this make contacting support easier? | n/a | Not its job; does not impede it. |
| 6 | Does this create distance from harmful behavior? | yes | Replaces "recover by trading" with "protect by saving/repaying." |

Questions 1–4 all resolve to "no" **only because** the mitigations in §5c are treated as hard requirements. If any mitigation is dropped, Q2 becomes "yes" and the feature must be pulled until restored.

## 5c. Backfire Check (required)

**Could this become a scoreboard, compulsion, or fixation number?** Yes — this is the feature's defining risk, equal to the Loss Ledger's. A cumulative money figure can become a number the user obsesses over, and a "protected vs. lost" juxtaposition is a PnL tracker in disguise. Mitigations (all mandatory):

- **No netting, ever.** ProtectionEntry and LossLedgerEntry share no computation and no screen adjacency. No net, ratio, or recovery-% value exists anywhere. (TDD §15; Charter §4.) A violation is a hard release block (QA S-13.)
- **No target.** No goal, no "remaining," no gap. Cumulative-only. There is nothing to fall short of.
- **Protection framing only.** "Protected" / "kept out of the loop" / "set aside" / "repaid." Never "recovered/back/regained/earned back/net."
- **Gentle placement.** Shown low in the home hierarchy, one quiet signal among several, never the dominant number, never beside the loss ledger (PRD §C6).
- **Real income only.** Schema cannot store a trading gain (TDD §11).

Residual risk after mitigation: a user could still privately treat the cumulative number as a score. That can't be fully engineered away, but removing targets, netting, and deficit-framing removes every *in-product* mechanic that would encourage it. Re-evaluate post-implementation per the regression gate.

## 6. Actors

| Actor | Role |
|---|---|
| User | Records money saved or repaid |
| System | Stores entries, shows cumulative protection, blocks any net/target framing |

## 7. Entry Points

Home screen (gentle, low in hierarchy, not adjacent to Loss Ledger); dedicated Money Protected screen; optionally suggested after a debt-repayment-related check-in. Never surfaced during a high-risk/panic flow.

## 8. Main Flow

- User opens Money Protected.
- User taps "Add protection."
- User enters amount, currency, and kind (`saved` or `debt_repaid`); optional note.
- System validates (amount > 0; kind required) and saves a ProtectionEntry.
- System updates and shows the cumulative "money protected so far" figure, calmly. No comparison, no target, no celebration animation.

## 9. Alternative Flows

### A1: User skips optional note
Saves with required fields only; no shaming, no nudge to "add more."

### A2: User is in a high-risk state
This feature is not shown or suggested during panic/high-risk flows. If the user navigates here while flagged high-risk, the System gently routes toward Panic Mode / contact instead (Charter §6). Protection is a calm-state feature.

### A4: Self-harm / immediate danger
Per template A4 and Charter §9 — surface crisis support, do not assess risk.

## 10. Exception Flows

### E1: Save fails
Calm error, retry, no data loss.

## 11. Related Entities

| Entity | Description |
|---|---|
| User | Owner |
| ProtectionEntry | Money saved or repaid, from real income (TDD §11) |
| DebtItem | Future link target when kind is `debt_repaid` (TDD §13) |

Explicitly **not** related to: LossLedgerEntry. No shared computation or display.

## 12. Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-MP-001 | User can create a ProtectionEntry with amount, currency, kind | Must-have | kind ∈ {saved, debt_repaid} |
| FR-MP-002 | System shows a single cumulative "money protected so far" figure | Must-have | Sum only; never a target or deficit |
| FR-MP-003 | System forbids any net/ratio/recovery-% combining protection and loss | Must-have | Hard block; QA S-13 |
| FR-MP-004 | All copy uses protection framing; forbidden terms rejected in review | Must-have | Charter §4, §10 |
| FR-MP-005 | Entry note is optional | Should-have | No nudging |
| FR-MP-006 | A `debt_repaid` entry may link to a DebtItem | Nice-to-have | Only when DebtItem ships |

## 13. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-MP-001 | Fast, mobile-friendly, under-30-second entry |
| NFR-MP-002 | Copy calm, direct, non-shaming; protection framing only |
| NFR-MP-003 | Local-first; data private; no leak in notifications/lock screen |
| NFR-MP-004 | No trading/market/recovery vocabulary in any string |

## 14. Validation Rules

- amount must be > 0
- currency required
- kind required, ∈ {saved, debt_repaid}
- no field may accept or compute a net-against-loss value
- no target/goal/remaining value may be entered or displayed

## 15. Acceptance Criteria

### AC-MP-001: Record protected money

```gherkin
Given the user is in a calm (non-high-risk) state
When the user adds a protection entry of 2,000,000 VND of kind "saved"
Then the entry is saved
And the cumulative "money protected so far" figure increases by 2,000,000 VND
And no target, deficit, or comparison to losses is shown
```

### AC-MP-002: No netting against losses

```gherkin
Given the user has recorded both losses and protected money
When the user views any screen in the app
Then no net figure, recovery percentage, or "protected vs lost" pairing appears
And the Money Protected and Loss Ledger views are never displayed adjacent
```

### AC-MP-003: Protection framing only

```gherkin
Given the user views the Money Protected feature
When any label, heading, or message is shown
Then it uses "protected" / "kept out of the loop" / "saved" / "repaid"
And it never uses "recovered", "back", "regained", "earned back", or "net"
```

### AC-MP-004: Not surfaced in high-risk flow

```gherkin
Given the user is flagged in a high-risk state
When the system chooses what to surface
Then Money Protected is not suggested
And the system routes toward Panic Mode and contacting support
```

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-06-10 | Initial version. |

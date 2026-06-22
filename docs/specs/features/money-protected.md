# Feature Spec: Money Protected

**Version:** 1.1.0  
**Last updated:** 2026-06-22

> Defers upward to `00-safety-charter.md`. This spec follows `03-feature-template.md`. Sections 5a–5c are the required safety gate.

## 1. Summary

Money Protected gives the user a calm, honest record of money they have kept **out of the loop** — money set aside from real income, money repaid toward debt, money handed to a trusted person for safekeeping, or money later withdrawn from protection as an honest append-only event. It exists to make protective progress visible without ever turning it into a number the user is playing to beat. It is the deliberate counterpart to the Loss Ledger: one records damage acknowledged, the other records protection achieved, and the two are never combined.

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
- Let the user record saved money by where it is kept without turning that place into an account, balance, or financial dashboard.
- Let the user record repaid money by who/what was repaid, without treating repayment destinations as reclaimable held money.
- Let the user record money leaving protection as a separate withdrawal event, without mutating past entries or styling it as failure.
- Treat saved money held by a trusted person as protected only behind a mandatory friction gate.

## 5. Non-Goals

This feature must not: net protection against losses; show a recovery percentage or break-even figure; set or display a target/goal; suggest how much more is "needed"; store or imply any trading/gambling gain; sit beside or be computed with the Loss Ledger; show balances by destination; link out to financial accounts; provide frictionless reclaim/withdrawal for saved money held by another person.

## 5a. Distance Test (required)

Recording money saved or repaid increases distance from harm by giving the user a safe, real-income definition of "making progress," directly displacing the trade-to-recover impulse. It supports abstinence and honest accountability. The test is answered clearly: the feature belongs.

## 5b. Final Safety Test (required — from Charter §16)

| # | Question | Answer | If problematic, how addressed |
|---|---|---|---|
| 1 | Could this help the user gamble or trade? | no | No market surface, no gain field, real-income only. |
| 2 | Could this make the user think about winning money back? | yes, latently | Saved money held by another person can create a "get it back" thought. This is allowed only with mandatory mitigation: destinations are labels only, no balances or link-outs exist, and held-by-other saved money has no frictionless reclaim affordance. Any reduction/reclaim attempt routes through the high-risk friction gate. Debt repayment destinations are outside this gate because repaid debt is not held money. |
| 3 | Could this increase shame or urgency? | no | No goal to fall short of; no countdown; cumulative-only, never a deficit. A slow week shows a flat number, not a failure. |
| 4 | Could this be mistaken for trading infrastructure? | no | No prices, positions, P/L, or returns. A plain saved/repaid log. |
| 5 | Does this make contacting support easier? | n/a | Not its job; does not impede it. |
| 6 | Does this create distance from harmful behavior? | yes | Replaces "recover by trading" with "protect by saving/repaying." |

Questions 1–4 resolve safely only because the mitigations in §5c are treated as hard requirements. For saved trusted-person destinations, Q2 is explicitly **yes, latently** before mitigation; the feature remains acceptable only because the friction gate is mandatory and non-removable.

## 5c. Backfire Check (required)

**Could this become a scoreboard, compulsion, or fixation number?** Yes — this is the feature's defining risk, equal to the Loss Ledger's. A cumulative money figure can become a number the user obsesses over, and a "protected vs. lost" juxtaposition is a PnL tracker in disguise. Mitigations (all mandatory):

- **No netting, ever.** ProtectionEntry and LossLedgerEntry share no computation and no screen adjacency. No net, ratio, or recovery-% value exists anywhere. (TDD §15; Charter §4.) A violation is a hard release block (QA S-13.)
- **No target.** No goal, no "remaining," no gap. Cumulative-only. There is nothing to fall short of.
- **Protection framing only.** "Protected" / "kept out of the loop" / "set aside" / "repaid." Never "recovered/back/regained/earned back/net."
- **Gentle placement.** Shown low in the home hierarchy, one quiet signal among several, never the dominant number, never beside the loss ledger (PRD §C6).
- **Real income only.** Schema cannot store a trading gain (TDD §11).
- **Kind-dependent destinations.** For `saved`, destination means where protected money is kept. For `debt_repaid`, destination means the lender, person, or institution repaid. For `withdrawal`, destination means where protected money was drawn from. One unified protected total may include all three, but the app must not treat repayment destinations as held places or reclaimable money.
- **Trusted-person friction gate.** Saved money held by another person may count toward protected total because it creates real distance from the loop. It has no frictionless reclaim/withdraw/release affordance. Any attempt to reduce, reverse, or reclaim it routes through the high-risk flow: pause, contact trusted person, and avoid fast money movement.
- **Destination labels only.** Places and repayment destinations are labels, not accounts. The app stores no balance per label, no account link, no balance-fetch, and no external destination URL. User-created labels do not create financial infrastructure.
- **No third-party balance fixation.** The app must not invite the user to monitor how much another person is holding as a target, scoreboard, or pressure number. The cumulative protected total stays gentle and unpaired with losses.

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
- User enters amount, currency, kind (`saved`, `debt_repaid`, or `withdrawal`), destination, and optional note.
- If kind is `saved` or `withdrawal`, User also selects reachability (`self_held` or `held_by_other`). If kind is `debt_repaid`, reachability is not collected.
- System validates the signed amount for the selected kind and saves a ProtectionEntry.
- If kind is `saved` and reachability is `held_by_other`, System records the entry as protected but does not create any frictionless reclaim affordance.
- System updates and shows the cumulative "money protected so far" figure, calmly. No comparison, no target, no celebration animation.

## 9. Alternative Flows

### A1: User skips optional note
Saves with required fields only; no shaming, no nudge to "add more."

### A2: User is in a high-risk state
This feature is not shown or suggested during panic/high-risk flows. If the user navigates here while flagged high-risk, the System gently routes toward Panic Mode / contact instead (Charter §6). Protection is a calm-state feature.

### A3: User records money held by a trusted person
Saved money held by a trusted person counts toward the protected total because it creates stronger distance from relapse. The System records the destination label and `held_by_other` reachability, optionally links the behavior to a SafetyCommitment, and shows no frictionless reclaim/withdraw action. Any attempt to reduce or reverse the entry routes to the high-risk flow and is recorded as an append-only event; the original entry is not mutated or deleted.

### A4: User records debt repayment
Repaid money counts toward the same protected total, but destination means who or what was repaid, not where money is held. The System records the repayment destination label, does not collect reachability, and does not apply the trusted-person friction gate because discharged debt is not reclaimable held money. For example, `bank` can mean either saved money held in a bank account or a payment made to a bank, depending on `kind`.

### A5: User records a withdrawal from protection
Money leaving protection is recorded as `kind = withdrawal` with negative `amountProtected`. The System stores it as a new append-only ProtectionEntry and does not mutate or delete the original saved entry. If reachability is `held_by_other`, the withdrawal routes through the high-risk friction gate before it can be recorded.

### A6: Self-harm / immediate danger
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
| SafetyCommitment | Optional paired barrier when saved money is held by a trusted person |

Explicitly **not** related to: LossLedgerEntry. No shared computation or display.

## 12. Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-MP-001 | User can create a ProtectionEntry with amount, currency, kind | Must-have | kind ∈ {saved, debt_repaid, withdrawal} |
| FR-MP-002 | System shows a single cumulative "money protected so far" figure | Must-have | Derived sum only; never stored as a mutable total, target, or deficit |
| FR-MP-003 | System forbids any net/ratio/recovery-% combining protection and loss | Must-have | Hard block; QA S-13 |
| FR-MP-004 | All copy uses protection framing; forbidden terms rejected in review | Must-have | Charter §4, §10 |
| FR-MP-005 | Entry note is optional | Should-have | No nudging |
| FR-MP-006 | A `debt_repaid` entry may link to a DebtItem | Nice-to-have | Only when DebtItem ships |
| FR-MP-007 | User can record a kind-dependent destination label for protected money | Must-have | For `saved`, where money is kept; for `debt_repaid`, who/what was repaid; for `withdrawal`, where money was drawn from |
| FR-MP-008 | System records reachability for saved and withdrawal entries as `self_held` or `held_by_other` | Must-have | `held_by_other` entries trigger mandatory friction gate; not collected for `debt_repaid` |
| FR-MP-009 | Held-by-other saved protection has no frictionless reclaim affordance | Must-have | Withdrawal/reclaim routes through high-risk flow and is recorded append-only |
| FR-MP-010 | Destination labels store no balance, account link, or external connection | Must-have | Labels only; no balance-fetch or link-out |
| FR-MP-011 | User can record a withdrawal from protection | Must-have | `kind = withdrawal`, negative `amountProtected`, append-only |

## 13. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-MP-001 | Fast, mobile-friendly, under-30-second entry |
| NFR-MP-002 | Copy calm, direct, non-shaming; protection framing only |
| NFR-MP-003 | Local-first; data private; no leak in notifications/lock screen |
| NFR-MP-004 | No trading/market/recovery vocabulary in any string |

## 14. Validation Rules

- amount must be > 0 for `saved` and `debt_repaid`
- amount must be < 0 for `withdrawal`
- currency required
- kind required, ∈ {saved, debt_repaid, withdrawal}
- destination required
- reachability required only when kind = saved or kind = withdrawal, ∈ {self_held, held_by_other}
- reachability must be null/absent when kind = debt_repaid
- no field may accept or compute a net-against-loss value
- no target/goal/remaining value may be entered or displayed
- destinations are labels only; no balance, account ID, URL, external connection, or balance-fetch field may exist
- entries with reachability `held_by_other` cannot expose frictionless reclaim, withdraw, release, transfer-back, or make-available actions
- withdrawals, reductions, and corrections are append-only records; past ProtectionEntry records are not mutated or deleted
- the cumulative protected total is derived by summing ProtectionEntry.amountProtected at read time; it is not stored

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

### AC-MP-005: Record trusted-person protection

```gherkin
Given the user is in a calm state
When the user records 2,000,000 VND of kind "saved" as held by a trusted person
Then the entry counts toward "money protected so far"
And the destination is stored as a label only
And no frictionless reclaim, withdraw, transfer-back, or release action is shown
```

### AC-MP-006: Reclaim attempt routes to friction gate

```gherkin
Given saved protected money is marked as held by another person
When the user attempts to reduce, reverse, or reclaim it
Then the system does not provide a frictionless reclaim path
And the system routes to the high-risk flow
And the system prioritizes pause, trusted-person contact, and no fast money movement
And the reduction is recorded as an append-only event rather than mutating the original entry
```

### AC-MP-007: Debt repayment destination has no reachability

```gherkin
Given the user records 2,000,000 VND of kind "debt_repaid"
When the user selects destination "bank"
Then the destination means the lender or institution repaid
And reachability is not collected
And the trusted-person friction gate is not applied
```

### AC-MP-008: Withdrawal reduces derived total append-only

```gherkin
Given the user has recorded 2,000,000 VND of protected money
When the user records a withdrawal of 800,000 VND for "medical bill"
Then the system creates a new ProtectionEntry with kind "withdrawal"
And amountProtected is -800,000 VND
And the original protection entry is not mutated or deleted
And the derived "money protected so far" figure decreases by 800,000 VND
```

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.1.0 | 2026-06-22 | Added kind-dependent destination/reachability behavior, trusted-person held-money mitigation, withdrawal kind with signed amounts, append-only reduction handling, and related safety acceptance criteria. |
| 1.0.0 | 2026-06-10 | Initial version. |

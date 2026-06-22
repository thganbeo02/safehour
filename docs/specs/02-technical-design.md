# Technical Design Doc (TDD)

**Version:** 1.1.0  
**Last updated:** 2026-06-22

> Defers upward to `00-safety-charter.md` and implements the requirements in `01-prd.md`. Where anything here conflicts with the Charter, the Charter wins. This doc covers architecture, the data model, and the schema-level enforcement of the safety rules.

## 0. Architecture Overview

- **Stack:** React Native (Expo), mobile-first.
- **Storage:** local-first. No cloud sync, no analytics, no third-party trackers in the MVP (Charter §12).
- **Why local-first:** this dataset identifies the user as a person with a gambling problem and debt. Keeping it on-device removes an entire class of leakage and breach risk and removes any engagement/analytics surface that could pull the product toward growth-over-safety.
- **Offline guarantee:** crisis support information and Panic Mode must function with no network (Charter §9).
- **Notifications:** at most one optional, gentle daily check-in; no re-engagement machinery (Charter §15). Notification previews must not leak sensitive content to a lock screen (Charter §12).
- **Trade tooling integration:** the user has Binance futures disabled with a one-year cool-off. The app must never integrate, link to, or re-enable any exchange or trading surface.

## 1. Purpose

This document defines the core data objects for the recovery app. The data model must support relapse prevention, accountability, and honest recovery tracking. It must not support trading, gambling optimization, market tracking, or PnL analysis.

A guiding principle: the safety rules are enforced here **at the schema level**, not just in copy. Copy can be edited away in a moment of weakness or by a careless contributor; a schema that has no field to hold a forbidden value cannot be quietly subverted. Where a safety rule can be made structural, it must be.

## 2. Data Model Rules

The data model must not include: Trade, Position, Order, Symbol, Entry price, Exit price, Leverage, Margin, Liquidation price, PnL, Win rate, Trading strategy, Market price, Exchange account.

**Structural no-chase rule:** no entity may contain a field whose value is a gain, profit, or amount-recovered-through-trading, and no entity may contain a field that represents a target amount to recover, break even on, or win back. "Money protected" in any future feature may only mean real money set aside or repaid toward a debt or savings goal from legitimate income — modeled as repayment/protection, never as a market return. There is no field, anywhere, in which a trading gain can be stored.

## 3. Core Entities

MVP entities: User, AccountabilityContact, Urge, CheckIn, LossLedgerEntry, SafetyPlan, SafetyCommitment, ProtectionEntry.

Future entities: RelapseReview, DebtItem, SupportResource, NotificationPreference, ExportRecord.

---

# 4. Entity: User

Represents the person using the recovery app.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Unique user ID |
| displayName | string | No | User display name |
| email | string | No | Login email |
| recoveryStartDate | date | Yes | Date user begins recovery tracking |
| longestStreakDays | number | Yes | Preserved across relapses; never reset to 0 by a relapse |
| preferredCurrency | string | Yes | Example: VND |
| primaryContactId | UUID | No | Main trusted contact |
| createdAt | datetime | Yes | Created timestamp |
| updatedAt | datetime | Yes | Updated timestamp |

Note on streak: current streak is derived from `recoveryStartDate` and check-in history at read time, not stored as a mutable counter. A relapse moves `recoveryStartDate` forward but must update `longestStreakDays` first if the ended streak was the longest. This makes it structurally impossible to lose streak history.

Relationships: User has many Urges, CheckIns, LossLedgerEntries, AccountabilityContacts; one or many SafetyPlans.

---

# 5. Entity: AccountabilityContact

Represents a trusted person the user can contact during urges or relapse risk.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Unique contact ID |
| userId | UUID | Yes | Owner |
| name | string | Yes | Contact name |
| relationship | string | No | Friend, partner, parent, sponsor, etc. |
| phone | string | No | Phone number |
| email | string | No | Email address |
| preferredMethod | enum | Yes | call, sms, email |
| isPrimary | boolean | Yes | Main contact or not |
| createdAt | datetime | Yes | Created timestamp |
| updatedAt | datetime | Yes | Updated timestamp |

Relationships: belongs to User; may be used by Panic Mode; may verify SafetyCommitments later.

---

# 6. Entity: Urge

Represents a craving or impulse to gamble, trade, borrow, deposit, or chase losses.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Unique urge ID |
| userId | UUID | Yes | Owner |
| intensity | number | Yes | 1–10 |
| trigger | string | Yes | Main trigger |
| emotion | string | Yes | Main emotion |
| actionTaken | string | Yes | What user did instead |
| contactedSupport | boolean | Yes | Whether user contacted someone |
| resultedInRelapse | boolean | Yes | Whether harmful action happened |
| notes | text | No | Short reflection |
| createdAt | datetime | Yes | Timestamp |

Suggested trigger values: stress, shame, debt_pressure, boredom, anger, loneliness, payday, market_content, previous_loss, conflict, other.

Suggested action values: waited_10_minutes, called_trusted_person, messaged_trusted_person, left_room, blocked_app, handed_money_access_to_someone, went_for_walk, wrote_down_urge, did_nothing_yet.

Relationships: belongs to User; may be linked to future RelapseReview.

---

# 7. Entity: CheckIn

Represents the user's daily honesty check-in.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Unique check-in ID |
| userId | UUID | Yes | Owner |
| date | date | Yes | Check-in date |
| gambledToday | boolean | Yes | Whether user gambled/traded |
| movedMoneyTowardGambling | boolean | Yes | Borrowed, deposited, transferred, etc. |
| urgeLevel | number | Yes | 1–10 |
| mood | string | Yes | Main mood |
| contactedSupport | boolean | Yes | Whether user contacted someone |
| nextSafeAction | text | No | One safe action for next 24 hours |
| createdAt | datetime | Yes | Timestamp |

Relationships: belongs to User; used to calculate recovery streak.

Unique constraint: a user should only have one CheckIn per date.

Note: a check-in where `gambledToday` is true is the structural trigger for relapse handling — it ends the current streak (updating `longestStreakDays` first) and should route the user toward the high-risk response and 48-hour protection (Charter §6, §7, §14). This must happen without shaming copy.

---

# 8. Entity: LossLedgerEntry

Represents an acknowledged financial loss from gambling/trading relapse. This is losses-only. This must never become a PnL tracker.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Unique loss entry ID |
| userId | UUID | Yes | Owner |
| amountLost | number | Yes | Amount lost; positive number representing damage only |
| currency | string | Yes | Example: VND |
| sourceOfMoney | string | Yes | savings, salary, loan, borrowed, credit |
| isBorrowedMoney | boolean | Yes | Whether loss came from borrowed money |
| context | text | No | Plain description |
| lockedAt | datetime | Yes | When amount became locked |
| createdAt | datetime | Yes | Timestamp |
| updatedAt | datetime | Yes | Updated timestamp |

Structural constraint: this entity has no field for a gain, recovery, offset, or net figure. `amountLost` is damage acknowledged, not a balance. There is deliberately no way to net entries against each other or compute a running profit/loss — the absence is the safety feature.

Write-once rule. After confirmation:
- **Allowed:** add note, add correction note, add new separate loss entry.
- **Not allowed:** reduce amountLost, delete entry without special confirmation/admin logic, convert entry into target, link entry to trading plan.

Relationships: belongs to User.

---

# 9. Entity: SafetyPlan

Represents the user's overall plan for staying away from gambling/trading behavior.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Unique safety plan ID |
| userId | UUID | Yes | Owner |
| mainReasonToStop | text | No | Personal reason |
| biggestRisk | string | No | Main relapse risk |
| emergencyMessage | text | Yes | Message to trusted contact |
| createdAt | datetime | Yes | Timestamp |
| updatedAt | datetime | Yes | Updated timestamp |

Relationships: belongs to User; has many SafetyCommitments.

---

# 10. Entity: SafetyCommitment

Represents a specific barrier or commitment that makes relapse harder.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Unique commitment ID |
| userId | UUID | Yes | Owner |
| safetyPlanId | UUID | No | Related safety plan |
| type | string | Yes | app_block, site_block, card_handover, contact_first, etc. |
| description | text | Yes | What the user committed to |
| status | enum | Yes | active, completed, broken |
| startDate | date | Yes | Start date |
| endDate | date | No | Optional end date |
| verifiedByContact | boolean | No | Whether trusted contact verified |
| createdAt | datetime | Yes | Timestamp |
| updatedAt | datetime | Yes | Updated timestamp |

Note: a `broken` status must never trigger shaming copy. It is data for building stronger barriers, not a mark against the user.

Suggested commitment types: delete_trading_apps, block_trading_sites, block_gambling_sites, hand_over_card, avoid_borrowing, contact_before_money_movement, avoid_market_content, salary_protection, custom.

Relationships: belongs to User; may belong to SafetyPlan.

---

# 11. Entity: ProtectionEntry

Represents money the user has kept **out of the loop** — set aside from real income, repaid toward a debt, or later withdrawn from protection as an honest append-only event. This is a protective record, not a recovery ledger. It is the structural counterpart to the LossLedgerEntry: where that records damage acknowledged, this records protection achieved. **The two must never be combined, netted, or computed against each other.**

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Unique entry ID |
| userId | UUID | Yes | Owner |
| amountProtected | number | Yes | Signed amount. Positive for `saved` and `debt_repaid`; negative for `withdrawal`. |
| currency | string | Yes | Example: VND |
| kind | enum | Yes | `saved`, `debt_repaid`, `withdrawal` |
| destination | string | Yes | Kind-dependent user-extensible label. For `saved`/`withdrawal`, where money is kept or drawn from; for `debt_repaid`, who/what was repaid. Defaults depend on kind. |
| reachability | enum | No | Applies when `kind = saved` or `kind = withdrawal`: `self_held` or `held_by_other`; determines whether the trusted-person friction gate applies |
| linkedDebtItemId | UUID | No | Future link to a DebtItem when that entity ships; null in MVP |
| context | text | No | Plain description (e.g. "set aside from salary") |
| createdAt | datetime | Yes | Timestamp |
| updatedAt | datetime | Yes | Updated timestamp |

**Structural constraints (the absence is the safety feature):**

- There is no field for a trading or gambling gain, and positive `amountProtected` values may only originate from legitimate income. The schema offers nowhere to record a market return.
- There is no `target`, `goal`, `remaining`, or `recoverBy` field. The entity cannot express a number the user must reach.
- There is no field, and no permitted computation, that nets `amountProtected` against any `LossLedgerEntry.amountLost`. No net figure exists anywhere in the model. Any "protected minus lost" calculation is forbidden at the application layer and has no schema to support it.
- The displayed aggregate is a single cumulative "money protected so far" sum, derived at read time by summing `amountProtected` across ProtectionEntry records. It is never stored as a mutable running total, never shown beside a loss total, and never shown as progress toward a goal.
- `destination` is interpreted by `kind`. For `kind = saved`, it means where protected money is currently kept, such as `bank`, `cash`, or a user-created label like `Mom`. For `kind = debt_repaid`, it means the lender, person, or institution repaid, such as `bank`, `credit_card`, or `Mom`. For `kind = withdrawal`, it means where protected money was drawn from. The same label may appear under multiple kinds with different meaning: `bank` can mean money saved in a bank account, a loan payment made to a bank, or money withdrawn from a bank-held protected amount.
- `destination` is a pure label. It stores no balance, account identifier, link, institution connection, fetch URL, exchange connection, or external reference. A user-created label that names an unsafe place still does not create any affordance to connect, fetch, trade, or inspect a balance.
- `reachability` is load-bearing for `kind = saved` and `kind = withdrawal`. If saved money is marked or withdrawn as `held_by_other`, the app must treat any reduction, reversal, or reclaim attempt as a high-risk money-movement flow, not as a normal edit. `reachability` does not apply to `debt_repaid` entries because repaid debt is not held money and has no reclaim path.
- Saved money held by a trusted person may count toward the cumulative protected total because it can be one of the strongest practical barriers against relapse. This remains safe only if the friction gate is non-optional: the model must never include a frictionless reclaim, withdraw, transfer-back, or "make available" affordance.
- Past `ProtectionEntry` records are append-only after creation. Withdrawals are recorded as separate `kind = withdrawal` entries with negative `amountProtected`; past protected entries are never mutated or deleted. For withdrawal entries with `reachability = held_by_other`, the event routes through the high-risk response and trusted-person contact path before it can be recorded.

Framing constraint (copy): use "protected" / "kept out of the loop" / "set aside" / "repaid." Never "recovered," "back," "regained," "earned back," "made back," or "net." (Charter §4, §10.)

Relationships: belongs to User; may link to a future DebtItem (§13) when `kind` is `debt_repaid`; may correspond to a SafetyCommitment (§10) when saved money is held by a trusted person.

---

# 12. Future Entity: RelapseReview

Represents a non-shaming review after relapse. Focus on prevention, not trading analysis.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Unique review ID |
| userId | UUID | Yes | Owner |
| linkedUrgeId | UUID | No | Related urge |
| triggerChain | text | Yes | What led to relapse |
| strongestEmotion | string | Yes | Main emotion |
| urgeLie | text | Yes | What the urge promised |
| missingBarrier | text | No | What barrier was missing |
| toldSomeone | boolean | Yes | Whether user disclosed |
| nextSafeStep | text | Yes | Prevention action |
| createdAt | datetime | Yes | Timestamp |

Note: `urgeLie` deliberately captures the distorted thought ("this time it's different," "one good trade," "I'm due") so the user can recognize the pattern later. It must never be framed as analyzing what "went wrong with the trade" — the subject is the lie, not the market.

---

# 13. Future Entity: DebtItem

Represents a repayment obligation. Supports calm repayment planning, not gambling pressure. When this ships, a `ProtectionEntry` of kind `debt_repaid` may link to it via `linkedDebtItemId`.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Unique debt ID |
| userId | UUID | Yes | Owner |
| lenderName | string | Yes | Bank/person/institution |
| principalAmount | number | Yes | Original amount |
| remainingAmount | number | Yes | Remaining amount |
| currency | string | Yes | Example: VND |
| dueDate | date | No | Payment due date |
| minimumPayment | number | No | Required payment |
| status | enum | Yes | active, paid, restructured |
| createdAt | datetime | Yes | Timestamp |
| updatedAt | datetime | Yes | Updated timestamp |

**Critical framing constraint.** `remainingAmount` and `dueDate` describe a calm, real-income repayment obligation. They must never be combined with any feature that computes "how much you need to make" or frames the gap as something a trade could close. The DebtItem is a fact to be paid down slowly, not a target. Pairing debt pressure with any earning-suggestion is exactly the loop the app exists to break (Charter §8).

Note: even when DebtItem ships, `remainingAmount` must not be displayed as a countdown-to-zero target alongside ProtectionEntry totals — that pairing recreates a "gap a trade could close." Repayment progress is shown as calm cumulative protection (§11), not as distance from a goal.

---

# 14. Data Safety Notes

This app may contain sensitive recovery and financial information. Implementation should consider: secure authentication, private user data, careful notification copy, no sensitive data in logs, optional local encryption, clear delete/export options, minimal data collection.

MVP stance: local-first storage, no cloud sync, no analytics or third-party trackers. This dataset identifies the user as a person with a gambling problem and debt. Treat notification previews and any lock-screen surfaces as places sensitive content must not leak (Charter §12).

---

# 15. Loss / Protection Separation Rule

This is a load-bearing structural rule, not a style preference.

- `LossLedgerEntry` (damage acknowledged) and `ProtectionEntry` (money kept out of the loop) are **separate entities with no shared computation**. No function, query, view, or report may combine them into a net, ratio, or "progress" figure.
- There is **no net-worth, break-even, or recovery-percentage value** anywhere in the model or UI. "Lost 50M, protected 12M" must never resolve to a single number or a paired display.
- On any screen, the two must not be placed adjacent or visually juxtaposed in a way that invites the user to read one against the other.
- A net or recovery-percentage figure appearing anywhere is a **hard QA block** (see `04-roadmap-and-qa.md`, safety track S-13).

---

# 16. Data Model Acceptance Test

The data model is acceptable if it:

- supports recovery behavior, accountability, urge interruption, and loss acknowledgement
- supports a protective record of money saved or repaid, from real income only, and append-only withdrawal events from protection
- does not support trading behavior, market analysis, or PnL calculation
- does not create recovery targets
- has no field anywhere capable of storing a trading gain or a recover-to target
- has no field or computation that nets protection against loss
- treats held-by-other saved money and withdrawals from held-by-other protection as protected only with a mandatory high-risk friction gate
- stores destinations as kind-dependent labels only, with no balance, link-out, external account, or frictionless reclaim affordance
- guarantees a relapse can never erase streak history (`longestStreakDays` is preserved)

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.1.0 | 2026-06-22 | Added kind-dependent ProtectionEntry destination/reachability fields, withdrawal kind with signed amounts, append-only reduction handling, and trusted-person held-money constraints. |
| 1.0.0 | 2026-06-10 | Initial version. |

# Roadmap & QA

**Version:** 1.0.0  
**Last updated:** 2026-06-10

> Execution layer. Defers upward to `00-safety-charter.md` and delivers the scope in `01-prd.md` against the model in `02-technical-design.md`. Covers build order, milestones, the MVP acceptance standard, and the QA strategy.

---

# Part A — Roadmap

## A1. Build Priority

Recommended implementation order:

- Static onboarding and product boundaries
- Accountability contact setup
- Home screen
- Panic Mode
- Urge Log
- Daily Check-In
- Loss Ledger
- Safety Plan
- Money Protected
- Local persistence / database integration
- Basic settings

Rationale for putting contact setup (2) before Panic Mode (4): Panic Mode's value depends on having someone to reach. But Panic Mode must still degrade gracefully when no contact is set — it always shows crisis support guidance regardless (see Feature Template alternative flow A3).

## A2. Milestones

- **M1 — Safe shell:** onboarding + boundaries + home screen + local persistence skeleton. Nothing yet records sensitive data.
- **M2 — Emergency core:** Accountability Contact + Panic Mode, including offline, pre-setup crisis support (Charter §9). This is the minimum that delivers standalone value.
- **M3 — Daily recovery loop:** Urge Log + Daily Check-In + derived streak.
- **M4 — Honesty + barriers:** Loss Ledger (write-once) + Safety Plan + commitments + Money Protected (separate from the Loss Ledger, no shared computation).
- **M5 — Hardening:** settings, notification safety, data export, QA pass against the full acceptance standard.

## A3. Sequencing Notes

- Each feature must pass its Feature Template gate (including Charter §16) before it enters a milestone — design-time gate, not a post-build check.
- The Loss Ledger (highest no-chase risk), Money Protected (most able to become a scoreboard), and Panic Mode (highest safety obligation) each get their own full feature spec before implementation.
- Future features (RelapseReview, DebtItem, any "money protected" tracker) are out of the MVP roadmap entirely and re-enter only via a fresh Template pass.

---

# Part B — MVP Acceptance Standard

The MVP is acceptable when:

- User can set up a trusted contact
- User can enter Panic Mode from home
- Panic Mode creates a real delay
- User can message/call trusted contact
- Crisis support information is reachable from Panic Mode in one tap, offline, even before setup
- User can log an urge
- User can complete daily check-in
- User can record loss without recovery target
- User can record money protected (saved or repaid) with no target and no netting against losses
- User can create safety commitments
- App contains no trading-specific fields
- App contains no market data
- App copy follows the Safety Charter
- A recorded relapse resets the streak without shame and preserves history (Charter §14)

---

# Part C — QA Strategy

> The unusual risk profile of this product means QA is not only "does it work" but "can it be subverted into a trading tool, and does it ever shame the user." The test plan below has a standard track and a **safety track**; the safety track is non-negotiable and maps directly to the Charter.

## C1. Test Levels

- **Unit:** schema constraints, derived-streak math, write-once enforcement, validation rules.
- **Integration:** relapse-handling flow (check-in → streak reset → high-risk routing → 48-hour protection), Panic Mode → contact/crisis paths.
- **Manual / exploratory:** copy review, offline behavior, lock-screen/ notification leakage, first-launch-before-setup behavior.

## C2. Safety Track (mandatory)

Structural (assert the *absence* is enforced, not just the UI):

- **S-1** No entity has a field capable of storing a gain, profit, net, offset, or recover-to target. Verify by schema inspection, not screen inspection. (Charter §3, §4; TDD §2, §8.)
- **S-2** LossLedgerEntry is write-once: `amountLost` cannot be reduced; entries cannot be netted or aggregated into a running P/L. (TDD §8.)
- **S-3** Derived streak survives a relapse: `longestStreakDays` is updated before `recoveryStartDate` advances; no history is deleted. (TDD §4; Charter §14.)
- **S-4** No cloud, analytics, or third-party tracker calls exist in the MVP build. Verify at the network layer. (Charter §12.)
- **S-13** No net, ratio, or recovery-percentage value combining ProtectionEntry and LossLedgerEntry exists in the model or UI; the two are never displayed adjacent or paired. ProtectionEntry has no target/goal/remaining field and cannot store a trading gain. Verify by schema inspection and screen review. (Charter §4; TDD §11, §15.)

Behavioral / copy:

- **S-5** A recorded relapse produces plain, non-shaming acknowledgement and routes to the next safe action. (Charter §10, §14.)
- **S-6** No notification shames the user or references streaks/losses. (Charter §13, §15.)
- **S-7** No `broken` SafetyCommitment status triggers shaming copy. (TDD §10.)
- **S-8** No screen presents a "total lost" figure styled or placed as a scoreboard. (PRD §C3.5.)

Crisis & offline:

- **S-9** Crisis support is reachable from Panic Mode in one tap, with no setup, on first launch, with no network. (Charter §9.)
- **S-10** The app never attempts to score or triage self-harm risk; it only surfaces human help. (Charter §9.)
- **S-11** Helpline data is locally relevant (Vietnam local + international fallback) and available offline. (Charter §9.)

Design:

- **S-12** No red/green-as-profit color, candlestick visuals, profit dashboards, or competitive/social-comparison surfaces. (Charter §11.)

## C3. Regression Gate

The safety track (S-1 through S-13) must pass on every release candidate. A failure in S-1 through S-4 or S-13 is a hard block — these are structural guarantees the whole product depends on. A new feature is not "done" until it has been run back through the Charter §16 test post-implementation, not just at design time (the Loss Ledger and Money Protected in particular, per PRD §C3.5 and §C3.7).

## C4. Pre-Launch Checklist

- [ ] Every MVP feature passed its Feature Template gate (incl. Charter §16)
- [ ] Safety track S-1 through S-12 all green
- [ ] MVP acceptance standard (Part B) fully met
- [ ] Copy reviewed end-to-end against Charter §10, §13
- [ ] Offline + pre-setup crisis path verified on a real device
- [ ] No trading/market vocabulary anywhere in shipped strings or schema

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-06-10 | Initial version. |

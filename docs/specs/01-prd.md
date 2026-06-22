# Product Requirements Document (PRD)

**Version:** 1.0.1  
**Last updated:** 2026-06-22

> Defers upward to `00-safety-charter.md`. Where anything in this document conflicts with the Safety Charter, the Charter wins. This PRD covers the product vision, positioning, principles, and MVP scope. Architecture and the data model live in `02-technical-design.md`; build order and QA live in `04-roadmap-and-qa.md`.

---

# Part A — Product Vision

## A1. Product Name

Working name: **SafeHour**

Shortlist (not yet decided): Anchor, AfterLoss, Hold, SafeHour, BreakTheLoop.

> Naming note: avoid anything that reads as a finance/trading brand. The name should signal _safety and pause_, not _recovery-of-money_. "SafeHour" and "Hold" both lean the right way. "AfterLoss" risks centering the loss; keep that in mind.

## A2. One-Sentence Summary

SafeHour is a recovery and accountability app that helps users interrupt gambling or leveraged trading urges, contact support, record relapse risks honestly, and prevent further financial harm.

## A3. Positioning

This is not a trading app. This is not a crypto journal, investment tracker, performance dashboard, or strategy tool. This app exists to create distance between the user and the next harmful action.

For a solo/lean build, this section also stands in for the business case: the "market" is people in gambling/leveraged-trading recovery (initial focus: Vietnamese users, VND, local support resources). Positioning is defined by refusal — the product is trusted precisely because of what it will not do. Monetization, if pursued later, can never override the Safety Charter.

## A4. Core Problem

The user is struggling with gambling-like behavior, especially through leveraged crypto-futures trading.

The main danger is not simply past financial loss. The main danger is the cycle:

- Stress, shame, debt pressure, or boredom appears.
- The user feels an urge to trade/gamble.
- The urge promises a quick fix or a way to win money back.
- The user acts quickly and privately.
- The loss becomes worse.
- Shame increases.
- Pressure builds.
- The cycle repeats.

The borrowed-money case is the most dangerous version of this cycle: debt pressure makes the urge stronger, and the "win it back" promise feels most urgent precisely when acting on it is most destructive.

## A5. Target User

The primary user is someone who:

- Has relapsed before
- Feels pressure to win back losses
- May borrow money or use debt to continue
- Acts impulsively during stress
- Hides gambling/trading behavior from others
- Needs immediate interruption, not trading advice
- Needs accountability, not market analysis

## A6. Product Goal

The goal is to help the user stop the next harmful action. The product should help the user: pause before acting, delay urges, contact a trusted person, record urges honestly, acknowledge losses without chasing them, build daily recovery consistency, and create practical barriers against relapse.

## A7. Success Definition

Success is not profit. Success means:

- The user does not gamble/trade today
- The user does not borrow more money
- The user contacts support during urges
- The user completes a daily check-in
- The user records relapse risk honestly
- The user creates friction between themselves and gambling access
- The user protects what remains

## A8. What This Product Must Never Become

A trading journal, a crypto dashboard, a PnL tracker, a leverage calculator, a strategy review tool, a market opportunity tracker, a "win back losses" planner, or a financial speculation assistant.

The brief states the intent; the Safety Charter §3 and §4 make it binding at the feature level.

## A9. Product Tone

Should feel: calm, direct, non-shaming, serious, protective, human, grounded.

Should not feel: exciting, gamified like a casino, market-focused, competitive, judgmental, overly clinical, or motivational in a fake way.

## A10. Core Product Message

The money already lost is painful. The goal is not to win it back. The goal is to stop adding to the damage.

## A11. Disclaimer (a product requirement, not just legal cover)

SafeHour is a self-help and accountability support tool. It is not medical treatment, not therapy, and not a substitute for professional care or a crisis service. It does not diagnose, and it cannot guarantee abstinence. Users in crisis are directed to human help (see Charter §9). Overstating what the app does would itself be a kind of false hope the product is built to avoid.

---

# Part B — Product Principles

> These principles govern every product, design, and engineering decision. Where a principle conflicts with engagement, growth, or convenience, the principle wins. Where a principle conflicts with the Safety Charter, the Charter wins.

## B1. Recovery First

Every feature must support relapse prevention, accountability, or harm reduction. If a feature makes the user think more about trading, gambling, markets, profit, leverage, or winning money back, it should not exist.

## B2. Opposite of a Trading Tool

This app must create distance from the gambling/trading loop. It must not include symbols, entry/exit prices, leverage, PnL, win rate, trading notes, strategy tags, market charts, price alerts, exchange connections, position sizing, or "recover loss" goals.

## B3. Delay Over Action

When the user is under pressure, the app should slow them down. The safest action is usually: pause, breathe, wait, contact someone, avoid touching money, record the urge. The app should never push fast financial decisions.

## B4. Contact Over Isolation

Relapse often happens privately. The app should make it easy to contact a trusted person during strong urges, debt panic, shame spirals, relapse moments, borrowing temptation, and "I can win it back" thoughts. The trusted person should be one of the most important parts of the app.

## B5. Honesty Over Optimization

The app should help the user tell the truth ("I had an urge," "I moved money toward gambling," "I relapsed," "I need help not making it worse"). It should not help the user optimize gambling behavior ("my setup failed," "my risk management was wrong," "I need a better strategy," "I can recover this with discipline").

## B6. No-Chase Framing

The app must never frame losses as a target to recover. Avoid: break even, recover losses, win it back, comeback plan, revenge trade, opportunity, one good trade, risk/reward. Use: stop the bleeding, protect what remains, delay the urge, no more borrowing, contact your person, one safe hour, one honest check-in.

## B7. Fewer Numbers Is Better

Numbers can trigger chasing behavior. Allowed where they support safety/ accountability: urge intensity, recovery streak, loss ledger amount, debt repayment obligations, check-in completion. Not allowed: PnL, profit targets, trading performance, win/loss ratio, market prices, leverage exposure, "amount needed to recover."

> Enforcement note: "money protected" toward a debt or savings goal counts as repayment/protection of what remains — never as a trading gain. The data model must make it structurally impossible to log a trading profit as recovery. See `02-technical-design.md` and Charter §4.

## B8. Calm UX Over Exciting UX

Avoid flashy animations, red/green profit colors, candlestick visuals, jackpot-like rewards, aggressive streak pressure, trading dashboard layouts. Prefer soft visual hierarchy, calm spacing, clear buttons, plain language, gentle reminders, simple recovery actions.

## B9. Safety Beats Engagement

The app should not maximize screen time. It should help the user take a safe action and leave. A successful session may be very short: open Panic Mode → contact trusted person → wait 10 minutes → close the app safely.

## B10. Direct But Not Cruel

Honest without shaming. Bad: "You failed again." Good: "You relapsed. The priority now is preventing the next harmful action." Bad: "You lost control." Good: "The urge was strong. The next step is to add support and friction."

## B11. Recovery Is Measured By Behavior

Track recovery actions, not gambling performance. Track: urges logged, check-ins completed, trusted person contacted, safety commitments created, relapses reviewed honestly, days without gambling/trading, days without borrowing or depositing toward gambling. Do not track: trading wins/losses, market performance, strategy success, missed opportunities.

## B12. The Streak Must Not Become Its Own Trap

A streak counter motivates, but a streak that feels precious can backfire: breaking it can trigger an "I've ruined it, might as well relapse fully" spiral — the same all-or-nothing thinking that drives chasing. Therefore:

- A relapse resets the current streak but never deletes history, and longest-streak is always preserved.
- The app never frames a reset as failure (see Charter §13).
- No streak-pressure mechanics: no "don't lose your streak!" notifications, no countdowns, no visual decay or guilt states.
- The streak is shown gently, as one number among several behavior signals — not as the score the user is playing for.

## B13. The App Is Not the Recovery

The app is a tool inside recovery, not recovery itself. It must never imply that using the app is sufficient, or that a perfect in-app record means the user is safe. The most important actions — telling a trusted person, contacting a professional or helpline, removing access to gambling/trading platforms — happen outside the app. The product should consistently point outward to those, not inward toward itself. Building or polishing the app is also not a substitute for taking those steps.

---

# Part C — MVP Scope

## C1. MVP Goal

The MVP should help the user survive urges, avoid relapse, contact support, and build a small daily recovery habit. It should not try to solve the user's whole financial life. The first version should be boring, safe, focused, and protective.

## C2. MVP Product Statement

Build a mobile-first recovery app for gambling and leveraged trading relapse prevention. The app should help the user:

- Open an emergency screen during urges.
- Wait 10 minutes before acting.
- Contact a trusted person quickly.
- Log urges in under 30 seconds.
- Complete a daily honesty check-in.
- Record losses without turning them into a recovery target.
- Create a basic safety plan.
- Keep a calm record of money protected — saved or repaid — without it becoming a target.

## C3. MVP Features

### C3.1 Panic Mode

Purpose: help the user interrupt an urge immediately. Core requirements:

- Large home screen CTA: "I feel the urge"
- Opens instantly
- Starts 10-minute timer
- Shows anti-chasing copy
- Provides one-tap call/message to trusted contact
- Offers urge logging after timer
- Surfaces crisis support contact reachable in one tap (Charter §9), working offline and available even before setup is complete

### C3.2 Accountability Contact

Purpose: make it easier to contact support instead of isolating. Core requirements: add trusted contact; store name and contact method; set primary contact; one-tap call or message; prewritten emergency message.

### C3.3 Urge Log

Purpose: record cravings and triggers without trading details. Core requirements: create in under 30 seconds; record intensity 1–10; record trigger; record emotion; record action taken; record whether support was contacted; record whether relapse happened.

### C3.4 Daily Check-In

Purpose: create a daily honesty ritual. Core requirements: one check-in per day; ask whether gambling/trading happened; ask whether money was moved toward gambling; ask urge level; ask mood; ask whether support was contacted; track recovery streak.

### C3.5 Loss Ledger

Purpose: acknowledge financial damage honestly without chasing. Core requirements: add loss amount; add currency; add source of money; mark if borrowed money; lock loss entry after confirmation; prevent reducing locked loss amount; never show recovery target.

> **Safety note (high-priority).** The Loss Ledger is the single MVP feature most at risk of violating the no-chase rule (§B6). It must present losses only as acknowledged, closed damage — never as a running total the user is invited to reduce, beat, or "make back." No aggregate "total lost" figure should be styled or placed in a way that reads as a scoreboard. Run this feature through the Charter §16 final safety test (especially questions 2 and 3) before and after implementation.

### C3.6 Basic Safety Plan

Purpose: define barriers before the next urge. Core requirements: choose safety commitments; add custom commitment; mark commitment as active; show active commitments on home/safety screen; encourage contact verification (optional for MVP).

### C3.7 Money Protected

Purpose: give the user a calm, honest record of money kept _out of the loop_ — money set aside from real income and money repaid toward debt — so progress is visible without ever becoming a recovery target. Core requirements:

- Record a protection entry: amount, currency, kind (`saved`, `debt_repaid`, or `withdrawal`), and destination. Reachability applies to `saved` and `withdrawal` entries.
- Destinations are kind-dependent labels only: for `saved`, where money is kept; for `debt_repaid`, who/what was repaid; for `withdrawal`, where protected money was drawn from. They must not store balances, account links, balance-fetching behavior, or external financial connections.
- Saved money held by a trusted person may count toward protected total because it creates real distance from relapse, but only with a mandatory friction gate, no frictionless reclaim/withdraw affordance, and append-only history for any reductions.
- Trusted-person handoff may also be modeled as a SafetyCommitment, because it is both protected money and a practical relapse barrier.
- Show a single gentle cumulative figure: "money protected so far," derived from entries rather than stored as a mutable running total.
- Frame strictly as protection — never "recovered," "back," "regained," or "earned back."
- Real income only. No field can hold a trading/gambling gain.
- **No targets.** No "you need X more," no goal line, no gap a trade could close.
- **No netting against the Loss Ledger.** The two never share a screen or a computation; there is no net figure anywhere.
- Shown gently and low in the hierarchy, like the streak — not as a dashboard.

> **Safety note (high-priority).** This feature is, alongside the Loss Ledger, the most able to quietly become a scoreboard the user plays to beat — the exact chasing pressure the product refuses to create. Inclusion in the MVP does not waive its gate: it must pass a full Feature Template review (Charter §16, especially Q2 and Q3, and §5c Backfire Check) before and after implementation. See its feature spec, `features/money-protected.md`.

## C4. MVP Exclusions

Do not build in MVP: trading journal, price charts, market data, crypto news, PnL tracking, leverage calculator, exchange import, strategy notes, financial projections, AI trading coach, community feed, leaderboards, advanced analytics, complex debt planner, budgeting system, bank integration.

Deliberate non-MVP decisions (documented so they don't drift back in):

- No streak-pressure mechanics (countdowns, "don't lose your streak" prompts, decay/guilt states). See §B12.
- No re-engagement or growth notifications. At most one optional, gentle daily check-in. See Charter §15.
- No cloud sync or analytics in MVP. Local-first only. See Charter §12.

## C5. MVP Screens

Required: Welcome/Onboarding, Home, Panic Mode, Trusted Contact Setup, Urge Log Form, Daily Check-In, Loss Ledger, Safety Plan, Money Protected, Settings.

Optional: Urge History, Check-In History, Edit Trusted Contact, Relapse Review.

## C6. Home Screen Priority

Recommended order: (1) Panic Mode CTA, (2) Contact trusted person, (3) Daily check-in, (4) Recovery streak, (5) Active safety commitments, (6) Money protected, (7) Log urge, (8) Loss ledger.

The recovery streak should be shown gently and low in the hierarchy — present, but never the dominant number on the screen. Money protected is likewise shown gently, as one quiet signal among several. If some protected money is held by a trusted person, the home screen may reflect it only as part of the calm cumulative protected total; it must not foreground a person-held balance, show a frictionless reclaim path, or create urgency around getting it back. The loss ledger sits last on purpose: reachable, not foregrounded. Money protected and the loss ledger must not be placed adjacent or visually paired — a "protected vs. lost" juxtaposition reads as a net/scoreboard and is forbidden (see `02-technical-design.md` §15).

## C7. MVP Design Direction

Should feel: calm, minimal, mobile-first, fast to use, non-judgmental, serious but not scary. Avoid: dashboard-heavy UI, too many stats, financial app aesthetics, crypto visual language, red/green profit colors, over-gamified streaks.

---

## Changelog

| Version | Date       | Change           |
| ------- | ---------- | ---------------- |
| 1.0.1   | 2026-06-22 | Clarified Money Protected destinations and trusted-person handoff behavior. |
| 1.0.0   | 2026-06-10 | Initial version. |

# Safety Charter

**Version:** 1.0.0  
**Last updated:** 2026-06-10

> **Status: highest-authority document in the project.** This is the constitution for SafeHour. It sits above the PRD, the Technical Design Doc, the Feature Template, and the Roadmap. Where any other document, feature request, design, roadmap pressure, or commercialization goal conflicts with this charter, **this charter wins**. Other docs cite this one by section number (e.g. "Charter §6"); this one cites no other doc as authority.

## 1. Purpose

This document defines the safety boundaries for the app.

These rules must be followed by all product, design, and engineering decisions.

If there is conflict between user engagement and user safety, choose user safety.

## 2. Highest Priority Rule

The app must never help the user gamble, trade, chase losses, borrow more money, or justify risky financial behavior.

## 3. No Trading Infrastructure

The app must not include:

- Trade entity
- Position entity
- Order entity
- Symbol field
- Entry price
- Exit price
- Leverage
- Margin
- Liquidation price
- PnL
- Win rate
- Exchange connection
- Trading strategy notes
- Market charts
- Market news
- Crypto price widgets

## 4. No Recovery Target

The app must not calculate or display:

- Amount needed to recover
- Break-even target
- Profit needed
- Daily earning target
- "Comeback" plan
- Suggested risky financial action
- Any number that turns loss into a goal

Losses may be recorded only as acknowledged damage.

**Clarification on "money recovered" / "money protected" features.** The app may track money the user has set aside or repaid toward a debt or savings goal. This is repayment / protection of what remains, never a trading or gambling gain. The data model must make it impossible to record a trading profit as "recovered" money. Debt repayment progress must be framed as calm, slow, real-income repayment — never as a target the user needs to hit, and never as something a trade could accelerate. Use the framing **"protected" / "kept out of the loop"**, never "recovered," "won back," "regained," or "earned back." (See PRD §Product Principles and the Technical Design Doc for the schema-level enforcement.)

The MVP includes a **Money Protected** feature on these terms (PRD §C3.7). Its inclusion is conditioned on an absolute rule: **money protected must never be netted against, paired with, or computed alongside recorded losses.** There is no "protected minus lost" figure, no recovery percentage, and no progress-toward-a-goal anywhere in the product. A net or recovery-percentage value appearing anywhere is a hard release block (Technical Design Doc §15).

## 5. High-Risk User States

The app should treat the following as high-risk signals:

- User says they want to win it back
- User reports urge level 8 or higher
- User reports borrowing temptation
- User reports wanting to deposit more money
- User reports hiding losses
- User reports gambling/trading today
- User reports relapse
- User opens Panic Mode multiple times in a short period
- User says they feel unable to stop

## 6. High-Risk Response

When the user is in a high-risk state, the app should prioritize:

1. Panic Mode
2. 10-minute delay
3. Contact trusted person
4. Helpline or emergency support information
5. No money movement
6. No borrowing
7. No trading/gambling apps
8. Short grounding copy
9. Urge logging after immediate danger passes

## 7. 48-Hour Protection Rule

After a major relapse, the app should encourage a 48-hour protection period.

During this period, the user should be guided toward:

- No gambling or trading
- No borrowing
- No deposits
- No new financial decisions alone
- Contacting trusted person
- Blocking trading/gambling apps
- Avoiding market content
- Completing daily check-ins
- Recording the loss honestly
- Planning repayment calmly later

## 8. Borrowed Money Rule

If the user lost borrowed money, the app should treat the situation as more urgent.

The app should remind the user:

- Do not borrow more to fix borrowed money.
- Do not gamble to solve debt pressure.
- Debt pressure makes urges stronger.
- Contact a trusted person before making financial decisions.
- Repayment requires a calm plan, not another risk.

## 9. Crisis Escalation

If the user expresses self-harm thoughts, immediate danger, or inability to stay safe, the app should encourage immediate help.

The app should direct the user to:

- Contact a trusted person now
- Call local emergency services
- Contact a local mental health or crisis hotline
- Stay away from financial apps and gambling/trading platforms

Implementation requirements for this rule:

- Crisis support contact information must be reachable from Panic Mode in one tap, without setup, even on first launch.
- The app must not attempt to assess, score, or triage self-harm risk itself. It surfaces human help; it does not act as a counselor.
- Helpline information must be locally relevant where possible (the primary user is in Vietnam; ship a sensible local + international fallback rather than a US-only number).
- This information must be available offline.

## 10. Copy Rules

Use short, direct, non-shaming language.

Good examples:

- Do not try to win it back today.
- The next 10 minutes matter.
- Pressure lies.
- Contact your person before touching money.
- The goal is to stop adding damage.
- You do not need a strategy. You need distance.
- One safe hour first.

Avoid:

- You failed.
- You are irresponsible.
- You ruined everything.
- Just use discipline.
- Trade smaller next time.
- Make a recovery plan through profit.
- You can fix this with one good decision in the market.

## 11. Design Safety Rules

Avoid:

- Red/green trading colors as primary meaning
- Candlestick visuals
- Exciting gambling-like rewards
- Profit dashboards
- Performance charts
- Countdown pressure that feels like urgency to act
- Competitive rankings
- Social comparison

Prefer:

- Calm backgrounds
- Large emergency action button
- Simple check-in cards
- Neutral loss records
- Clear support contact actions
- Gentle streak display
- Friction before risky flows

## 12. Data Safety Rules

The app may store sensitive recovery data.

Requirements:

- Keep user data private
- Do not expose sensitive information in logs
- Do not share data without explicit user action
- Allow user to export data for therapy/accountability if needed
- Consider local-first or encrypted storage where possible
- Use careful wording for notifications

MVP stance: local-first only. No cloud sync, no analytics, no third-party trackers in the MVP. This data identifies the user as a person with a gambling problem and debt; treat it accordingly. Also consider the case where another person picks up the device — avoid surfacing sensitive content on a lock screen or in notification previews.

## 13. Notification Safety Rules

Notifications should not shame the user.

Good:

- Time for a quick check-in.
- One honest minute today.
- Stay away from the loop today.
- Check in before the day ends.

Bad:

- You broke your streak.
- Did you gamble again?
- You are falling behind.
- You need to recover your losses.

## 14. Relapse Handling Rule

A relapse is a high-risk moment, not a moral failure, and the app must handle it without shame while being honest about what happened.

On a recorded relapse, the app must:

- Acknowledge it plainly, without guilt copy ("You relapsed. The priority now is the next safe action.").
- Reset the current clean streak but preserve all history and the longest streak.
- Route immediately into the high-risk response (§6) and offer the 48-hour protection period (§7).
- Prompt honest recording of what happened and the failure points, framed as building stronger barriers — not as self-punishment.
- Never present a relapse as the end of progress or as a reason to "give up and chase."

## 15. Notifications Frequency Rule

The app must not use notifications to drive engagement. At most one gentle daily check-in by default, user-adjustable, easy to turn off entirely. No re-engagement nudges, no streak-pressure pings, no "we miss you" messaging. (See PRD §Product Principles.)

## 16. Final Safety Test

Before adding any feature, ask:

1. Could this help the user gamble or trade?
2. Could this make the user think about winning money back?
3. Could this increase shame or urgency?
4. Could this be mistaken for trading infrastructure?
5. Does this make contacting support easier?
6. Does this create distance from harmful behavior?

If the answer to questions 1–4 is yes, reject or redesign the feature.

If the answer to questions 5–6 is no for a feature that touches a high-risk flow, reconsider whether it belongs in the MVP.

This test is reproduced inline in the Feature Template (§5b) so it cannot be skipped when specifying a new feature.

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-06-10 | Initial version. |

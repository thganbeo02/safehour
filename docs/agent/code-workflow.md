# Code Workflow

> Task module — read when writing, refactoring, or fixing app code. The §1 non-negotiables and §2 refusal policy in `AGENT.md` always apply on top of this. This module covers only the build-specific _mechanics_ of honoring them.

## 1. Build conduct

- **Stack:** React Native (Expo), mobile-first, local-first. No cloud sync, analytics, or third-party trackers in the MVP.
- **Schema is a safety surface.** Enforce safety structurally: if a forbidden value (trading gain, recovery target, net figure) has no field to live in, it cannot be smuggled in later. Before adding any field, check it against AGENT.md §1.
- **Copy is reviewed against the Charter** (`00-safety-charter.md` §10 good/avoid lists, §13 notifications). The forbidden vocabulary in AGENT.md §1 must never appear in shipped strings.
- **Test the absence.** QA verifies forbidden things _do not exist_ (S-1…S-13), by schema and network inspection — not only by looking at screens. See `04-roadmap-and-qa.md` §C2.
- **Loss Ledger and Money Protected** carry standing extra scrutiny (most able to become scoreboards): re-run the Charter §16 test after any change near them.

## 2. What "done" looks like

- TypeScript compiles, no new errors.
- The change matches the relevant doc — or the doc was updated first, in a separate commit. (A change that _contradicts_ a doc updates the doc; see `commit-and-wrapup.md`.)
- No new hardcoded magic numbers (e.g. the 10-minute delay, the 48-hour window come from config, not literals scattered in code).
- No `any`, `@ts-ignore`, or leftover `console.log` (and never log sensitive recovery/financial data — Charter §12).
- State patterns honored (pick one client-state approach and keep to it).
- **Safety pass (mandatory):** verify the change introduces nothing forbidden by AGENT.md §1 and no shaming copy; confirm the crisis path is still one-tap, offline, pre-setup. Build-time mirror of the QA safety track (`04-roadmap-and-qa.md` §C2).
- If the schema or a high-risk feature (Loss Ledger, Money Protected) was touched, re-run the Charter §16 test against the result.

## 3. Solo-dev testing priorities

- Tests are valued but not required everywhere. Concentrate them where a bug would be most dangerous:
- the Panic Mode / crisis path,
- the derived-streak calculation,
- the write-once Loss Ledger enforcement,
- the no-netting separation between losses and protection.
- If a task feels like three commits, it's three commits.
- No PR review process — the agent's pushback IS the review (AGENT.md §2).

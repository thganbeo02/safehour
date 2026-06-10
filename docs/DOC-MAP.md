# SafeHour Doc Map

> Working guide for navigating and updating the SafeHour documentation set. Defers upward to `AGENT.md` and, for product decisions, to `docs/specs/00-safety-charter.md`.

## 1. Authority Order

Use the highest matching doc when two docs disagree. Lower-authority docs should be corrected to match higher-authority docs.

| Order | Doc | Owns |
|---|---|---|
| 1 | `docs/specs/00-safety-charter.md` | Product safety constitution; forbidden capabilities; crisis, copy, privacy, and no-chase rules |
| 2 | `docs/specs/01-prd.md` | Product vision, principles, MVP scope, screen priority |
| 3 | `docs/specs/02-technical-design.md` | Architecture, data model, schema-level safety enforcement |
| 4 | `docs/specs/04-roadmap-and-qa.md` | Build order, milestones, MVP acceptance, QA safety track |
| 5 | `docs/specs/03-feature-template.md` | Required feature-spec structure and safety gate |
| 6 | `docs/specs/features/*.md` | Detailed contracts for individual features |
| Always | `AGENT.md` | Session rules, non-negotiables, task routing, refusal policy |
| Task-scoped | `docs/agent/*.md` | Workflow mechanics for docs, code, commit/wrap-up |

## 2. Current Audit

| Area | Status | Notes |
|---|---|---|
| Version headers | OK | Versioned spec docs use `Version` and `Last updated` lines under the title. |
| Per-doc changelogs | OK | Versioned spec docs include a local changelog table. |
| Central changelog | Needs maintenance | `docs/CHANGELOG.md` is the project-level summary and must be updated when docs change. |
| Present cross-references | OK | PRD, TDD, Roadmap/QA, Feature Template, and Money Protected references point to files present in the repo. |
| Safety Charter file | OK | `docs/specs/00-safety-charter.md` is present and is the highest product authority. |
| Money Protected separation | OK | PRD, TDD, Roadmap/QA, and feature spec consistently require no netting, no target, and no adjacency with Loss Ledger. |
| QA S-13 | Fixed | Roadmap/QA pre-launch checklist should include S-13 because the safety track defines it as mandatory. |

## 3. Update Dependency Map

When changing a concept, update the owning doc first, then every dependent doc listed here.

| Change | Primary owner | Also check/update |
|---|---|---|
| Safety rule, forbidden capability, crisis guarantee, copy rule | `00-safety-charter.md` | Every doc that cites the changed Charter section; `AGENT.md` if it affects non-negotiables |
| Product scope, MVP feature list, home priority | `01-prd.md` | `04-roadmap-and-qa.md`, affected feature specs, `02-technical-design.md` if data shape changes |
| Entity, field, schema constraint, storage/privacy architecture | `02-technical-design.md` | `01-prd.md` if product behavior changes, `04-roadmap-and-qa.md` safety track, affected feature specs |
| Build order, milestone, acceptance, QA safety track | `04-roadmap-and-qa.md` | `01-prd.md` MVP scope, `02-technical-design.md` referenced constraints, affected feature specs |
| Feature-spec structure or required gate | `03-feature-template.md` | All existing `docs/specs/features/*.md`, `docs/agent/doc-workflow.md` if workflow changes |
| Money Protected behavior | `docs/specs/features/money-protected.md` | `01-prd.md` §C3.7/§C6, `02-technical-design.md` §11/§15, `04-roadmap-and-qa.md` S-13 |
| Loss Ledger behavior | Future Loss Ledger spec | `01-prd.md` §C3.5, `02-technical-design.md` §8/§15, `04-roadmap-and-qa.md` S-2/S-8/S-13 |
| Panic Mode or crisis path | Future Panic Mode spec | `01-prd.md` §C3.1, `02-technical-design.md` offline/privacy notes, `04-roadmap-and-qa.md` S-9/S-10/S-11 |
| Recovery streak behavior | PRD/TDD depending on change | `01-prd.md` §B12, `02-technical-design.md` §4/§7, `04-roadmap-and-qa.md` S-3 |

## 4. Session Checklist

Use this before closing a docs session:

- Confirm the change belongs in the lowest-authority doc that owns it.
- Grep for the feature/entity/section name across `docs/` and update citations.
- Bump the touched spec doc version and `Last updated` date only for non-negligible changes.
- Add or update the touched spec doc's local changelog row only for non-negligible changes.
- Add a `docs/CHANGELOG.md` entry for non-negligible documentation changes.
- If feature/schema behavior changed, re-run the relevant Roadmap/QA safety-track items.
- Confirm no shipped/user-facing copy introduces forbidden vocabulary from `AGENT.md` §1.

## 5. Obvious QA Gaps To Track

These are not implementation failures yet; they are the test/design gaps most likely to matter when code starts.

- Panic Mode needs an implementation-level test for one-tap crisis support offline, before setup, and on first launch.
- Loss Ledger needs schema tests for write-once `amountLost`, no deletion/reduction path, and no aggregation that reads as PnL.
- Money Protected needs schema and screen tests proving no target/goal/remaining field, no trading-gain field, and no Loss Ledger adjacency or netting.
- Derived streak needs unit tests proving relapse preserves history and updates `longestStreakDays` before moving `recoveryStartDate`.
- Notifications need manual review for lock-screen leakage, shame language, and streak/loss pressure.
- Network inspection should confirm no analytics, trackers, cloud sync, exchange links, or market-data calls in MVP builds.

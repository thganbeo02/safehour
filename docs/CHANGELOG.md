# SafeHour — Changelog

Central change history for the SafeHour doc set. Each doc also carries its own changelog at its foot; this file is the project-level summary. Newest first.

Versioning convention (see `docs/agent/doc-workflow.md` §3 for the full rule):
- **MAJOR** — a change that invalidates other docs or reverses a decision. In practice only the Charter and PRD reach this. A Charter MAJOR bump forces a review of every doc that cites it.
- **MINOR** — a new feature, entity, or section.
- **PATCH** — wording, clarification, or formatting that changes nothing binding.

---

## [2026-06-11] — Add onboarding and loading foundation — v0.1.1

Started the M1 Safe Shell by adding the onboarding feature spec, design references, app-level loading screen, and initial source/theme structure.

### Added

- Added `docs/specs/features/onboarding.md` at v1.0.0.
- Added onboarding/loading design references under `docs/design/`.
- Added `assets/loading-background.png` as the runtime loading background.
- Added `src/app/AppRoot.tsx` as the app-level root wrapper.
- Added `src/screens/LoadingScreen.tsx` for startup UI outside the onboarding flow.
- Added `src/theme/colors.ts` and `src/theme/typography.ts` for shared design tokens.
- Added Space Grotesk font loading through `expo-font` and `@expo-google-fonts/space-grotesk`.

### Changed

- Replaced the default Expo starter UI in `App.tsx` with thin root wiring.
- Updated the loading tagline to "One safe hour at a time." and kept the screen free of cards or transparency overlays.
- Kept the loading screen outside onboarding because it is app startup UI.
- Ran `npm audit fix`; remaining moderate audit findings require a breaking Expo SDK upgrade and were deferred.

| Doc | Version |
|---|---|
| features/onboarding | 1.0.0 |

## [2026-06-10] — Add doc map and audit fixes — v0.1.0

Added a working doc map, incorporated the Safety Charter into the audit state, defined doc-change significance levels, and corrected two Roadmap/QA inconsistencies found during the audit.

### Added

- Added `DOC-MAP.md` as an unversioned working guide with the documentation hierarchy, update dependency map, session checklist, current audit status, and obvious QA gaps.

### Changed

- Removed per-file versioning and local changelog from `DOC-MAP.md` because it is a working guide, not a controlled product spec.
- Updated `docs/agent/doc-workflow.md` to distinguish negligible, patch, minor, and major documentation changes.

### Fixed

- Updated `04-roadmap-and-qa.md` to v1.0.1 so the pre-launch checklist includes mandatory safety track S-13.
- Clarified `04-roadmap-and-qa.md` §A3 so Money Protected remains in MVP while additional protection/repayment trackers stay future scope.
- Corrected this changelog's versioning-rule reference from `AGENT.md` §4 to `docs/agent/doc-workflow.md` §3.

| Doc | Version |
|---|---|
| 00-safety-charter | 1.0.0 |
| 04-roadmap-and-qa | 1.0.1 |
| DOC-MAP | unversioned |

## [2026-06-10] — Initial version

All docs at 1.0.0.

| Doc | Version |
|---|---|
| 00-safety-charter | 1.0.0 |
| 01-prd | 1.0.0 |
| 02-technical-design | 1.0.0 |
| 03-feature-template | 1.0.0 |
| 04-roadmap-and-qa | 1.0.0 |
| features/money-protected | 1.0.0 |

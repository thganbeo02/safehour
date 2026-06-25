# SafeHour — Changelog

Central change history for the SafeHour doc set. Each doc also carries its own changelog at its foot; this file is the project-level summary. Newest first.

Versioning convention (see `docs/agent/doc-workflow.md` §3 for the full rule):
- **MAJOR** — a change that invalidates other docs or reverses a decision. In practice only the Charter and PRD reach this. A Charter MAJOR bump forces a review of every doc that cites it.
- **MINOR** — a new feature, entity, or section.
- **PATCH** — wording, clarification, or formatting that changes nothing binding.

---

## [2026-06-24] — Reorganize app by feature and refine Money Protected — v0.1.6

Moved the app away from the flat screen folder toward feature-owned modules, then split Money Protected into smaller components and hooks so future safety-sensitive changes are easier to review. Preserved the Money Protected safety framing: no targets, no netting against losses, neutral total animation, and info-blue confirmation styling per Charter §11 and QA S-13/S-14.

### Added

- Added `src/features/` structure for screen ownership across home, onboarding, loading, contacts, urge log, settings, and protected money.
- Added protected-money components for the total card, where-kept section, recent-history section, info modal, and add-entry sheet.
- Added protected-money hooks for data loading/saving and the session-scoped protected total animation.
- Added `src/lib/` formatting helpers for currency and dates.

### Changed

- Moved navigation to `src/app/navigation/MainNavigator.tsx`.
- Moved onboarding runtime assets into `src/features/onboarding/assets/`.
- Updated Money Protected main screen layout to remove the logo header, use a fixed cyan top area, and show dashboard-style where-kept and recent-history sections.
- Changed Money Protected total animation to run only on first non-zero session entry and once after real total changes, with neutral amount color throughout.
- Added `colors.infoBlue` for confirmation checks so saved/changed money is not styled as a trading win or loss.

### Removed

- Removed the obsolete flat `src/screens/` folder after moving screens into feature folders.
- Removed the temporary `src/shared/` layer in favor of existing top-level `components`, `theme`, and `assets` folders.

## [2026-06-23] — Implement custom navigation and Money Protected MVP UI — v0.1.5

Created a beautiful custom bottom navigation bar with 5 tabs and built the full Money Protected screen following the interactive mockup design with inline custom place additions and friction gates. Added a high-fidelity animated save transition and global toast notification provider.

### Added

- Installed dependency `react-native-toast-notifications` to support non-intrusive modal success alerts. Added custom type `protection_saved` only; built-in success (green) and danger (red) alert styles are strictly forbidden to ensure color semantics do not trigger speculative trading dashboard habits (Charter §11).
- Created `src/screens/MainNavigator.tsx` for custom stateful bottom tab navigation.
- Created placeholder screens: `HomeScreen.tsx`, `ContactsScreen.tsx`, `UrgeLogScreen.tsx`, `SettingsScreen.tsx`.
- Created `ProtectedScreen.tsx` implementing the complete money protected UI with inline interactive SVGs, underline-only inputs, list of destinations, custom place additions, and friction gates on withdrawal.

### Changed

- Configured `AppRoot.tsx` with global `<ToastProvider>` set to standard neutral styling, bottom placement, and slide-in animations.
- Updated `src/app/AppRoot.tsx` to render the new `MainNavigator` instead of the static placeholder.
- Updated `src/storage/db.ts` to migrate the `protection_entries` table schema to Version 1.1.0 with kind-dependent destinations, reachability columns, signed amounts, and SQLite helper functions.

## [2026-06-22] — Add protected-money destinations safety model — v0.1.4

Documented the Money Protected destination model, including trusted-person held money as protected only behind a mandatory friction gate.

### Added

- Added `ProtectionEntry.destination`, scoped `reachability`, and `withdrawal` kind with signed amount behavior in the TDD.
- Added trusted-person held-money mitigation to the Money Protected feature spec.
- Added QA safety item S-14 for kind-dependent destination labels, no balance/link-out behavior, scoped reachability, signed withdrawal validation, and append-only reduction handling.

### Changed

- Clarified PRD Money Protected scope to include kind-dependent destinations and trusted-person handoff as both protected money and a SafetyCommitment.
- Confirmed no Safety Charter amendment is required because the change remains within protection framing, real-income-only records, no netting, and no recovery target.

| Doc | Version |
|---|---|
| 01-prd | 1.0.1 |
| 02-technical-design | 1.1.0 |
| 04-roadmap-and-qa | 1.1.0 |
| features/money-protected | 1.1.0 |

## [2026-06-16] — Add local persistence skeleton — v0.1.3

Completed the remaining M1 storage gap by adding a local-first SQLite skeleton and wiring onboarding completion to durable local state.

### Added

- Added `expo-sqlite` as the local-first storage dependency.
- Added `src/storage/db.ts` with initialization for M1/MVP core tables: `users`, `accountability_contacts`, `urges`, `check_ins`, `loss_ledger_entries`, `safety_plans`, `safety_commitments`, and `protection_entries`.
- Added `metadata` storage for app-level flags, including `onboardingCompleted`.
- Added dev-only storage debug logging for `metadata` and `users`.
- Added a dev-only onboarding reset button on the home placeholder.

### Changed

- App startup now initializes local storage before deciding whether to show onboarding.
- Completing onboarding now persists the completion flag and creates the default local user record with preferred currency and recovery start date.
- Updated the typography mapping so Binance Plex backs regular/light body text while onboarding steps share the same heading and item text styles.
- Changed onboarding setup cards into required-to-acknowledge previews while documenting that trusted contact, daily check-in/reminder behavior, and safety commitments are implemented in later milestones.
- Split developer tools into a lightweight onboarding reset and a separate local data wipe.

### Notes

- The schema keeps Loss Ledger and Money Protected structurally separate and contains no fields for gains, market data, targets, or netting, supporting Charter §4 and QA S-13.

## [2026-06-12] — Complete onboarding flow with local SVG registry — v0.1.2

Implemented the interactive 4-screen onboarding flow, asset re-routing, and centralized SVG registry component (`IconSvgLocal`) for dynamic theme tinting.

### Added

- Added `src/components/icons/IconSvgLocal.tsx` and `src/components/icons/index.ts` central local registry.
- Added support for 8 raw SVGs: `wind.svg`, `notebook-pen.svg`, `circle-user-round.svg`, `piggy-bank.svg`, `chart-candlestick.svg`, `target.svg`, `undo-2.svg`, `stop.svg`, `phone.svg`, `shield-check.svg`, `bell-ring.svg`, and `chevron.svg`.
- Added high-fidelity pressable `SetupCard` component inside `OnboardingScreen.tsx` with timing and scale press down transitions (scale to `0.96` and bg color transition to `colors.paleTeal` over 120ms).
- Added local-only state to onboarding flow to track completion of setup elements.
- Added gated "Enter SafeHour" logic and a gray warning text ("Complete the required steps to continue.") exactly 12px above the button when requirements are not satisfied.

### Changed

- Moved raw onboarding images (`intro.png`, `loading-background.png`, and `shield-love.png`) to `src/assets/onboarding/`.
- Configured SVG Metro bundler integration (`metro.config.js` and `react-native-svg-transformer`).
- Migrated relative imports across screens to TypeScript path alias `@/*`.
- Refactored `BoundariesPage` (Step 2) to display the new SVG boundaries with dynamic native tint-matching.
- Configured setup cards to hide the `REQUIRED` badge/tag instantly once marked as completed.

### Removed

- Removed all instances of typography `lineHeight` to meet viewport boundary requirements.

### Notes

- Identified a future Safety Track conflict (gated crisis access) on the onboarding flow: Charter §9 requires a direct route to emergency support that must not be gated behind onboarding or setup. Added to the design backlog.
- Implemented gated setup requirements on step 3 as an intentional testing mechanism for verifying interactive states; production will permit bypassing per FR-ONB-003.

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

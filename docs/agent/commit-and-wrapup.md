# Commit & Wrap-Up

> Task module — read when committing, wrapping up a session, or updating the changelog. Trigger phrases: "wrap up", "ready to commit", "I'm done", "commit time", "update the changelog", or equivalents. The §1 non-negotiables and §2 refusal policy in `AGENT.md` always apply on top of this.

## 1. Commit conventions

Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `chore`. (Five is enough for a solo project — a perf change is a `refactor` or `fix`; tests/build/config are `chore`; a revert is a `fix`.)

**Scopes** (SafeHour-specific):
- Features: `panic`, `contact`, `urge`, `checkin`, `ledger`, `protected`, `plan`
- Cross-cutting: `onboarding`, `settings`, `crisis`, `notifications`
- Foundation: `design-system`, `nav`, `state`, `storage`
- Meta: `docs`, `infra`, `deps`

(Stack is React Native / Expo, local-first — there is no backend scope. A local persistence layer like SQLite/MMKV goes under `storage`.)

**Subject:** ≤ 50 chars, imperative, no period. **Body:** non-trivial changes get a body explaining *what* and *why* — and for anything touching a safety guarantee, *which Charter rule it satisfies*. **Footer:** code-level refs only. Doc/version references belong in `CHANGELOG.md`, not commit messages.

> A commit message must never normalize a forbidden capability ("add quick PnL view for testing"). If you're describing something the Charter forbids, the change is the problem — stop and surface it (AGENT.md §1).

## 2. When to log a decision — the Six-Months Bar

When deciding whether a change deserves a detailed `CHANGELOG.md` entry versus a routine commit, ask:

> **"If future me, with no context, encountered this change, would I want to know *why* it happened?"**

- **Yes** → detailed changelog entry (capture the reasoning, especially the safety reasoning).
- **No** → routine commit.

Worth a detailed entry: a library/pattern choice with real tradeoffs; deferring or scoping something; rejecting an obvious approach for a non-obvious (often safety) reason; anything a reviewer would probe. **Especially** any decision that trades convenience for a safety guarantee.

Not worth it: routine choices, anything already stated in the PRD or TDD, ordinary implementation detail.

## 3. Build / session versioning (phase.session)

Versions the project's progress through the build, used on `CHANGELOG.md` session entries — **not** on individual docs (those use their own semver; see `doc-workflow.md` §3). Format: `v0.<phase>.<session>`.

- `<phase>` follows the roadmap milestones (`04-roadmap-and-qa.md`): M1→phase 1, M2→phase 2, … M5→phase 5. Entering a new phase starts a fresh bucket at `v0.<phase>.0`.
- `<session>` bumps for each meaningful wrap-up within the same phase (`v0.2.0 → v0.2.1 → v0.2.2`).
- Entering the next phase resets the session counter (`v0.2.4 → v0.3.0`).
- Half-phases (e.g. a `02.5`) stay in the parent phase bucket (`v0.2.x`) unless explicitly overridden.
- Preserve historical changelog entries as written; never retroactively renumber old versions unless explicitly asked.
- `v1.0.0` is reserved for the first public release.

## 4. Wrap-up workflow

**1. Inspect the full change set** — `git status` and `git diff --stat`, staged and unstaged.

**2. Stage deliberately.** Include the real modifications and new files. Exclude stray artifacts (`.DS_Store`, swap files, unrelated local config). Ask about ambiguous files (`package-lock.json`, `.env.example`). **Never `git add -A` blindly.**

**3. Update the changelog.** Every wrap-up gets at least a session entry (build version bump + short summary). Do this only during an explicit wrap-up/commit/done-style request, or when the owner directly asks to update the changelog; during normal work, keep notes in conversation or local notes instead. If docs changed, add categorized entries:
- **Added** — new content, sections, features, entities
- **Changed** — modifications to existing content
- **Removed** — deletions
- **Fixed** — concrete errors corrected (not wording)

Entry heading: `## [YYYY-MM-DD] — <summary> — v0.<phase>.<session>`. Use today's actual date. Same date + same wrap-up + same product slice should be consolidated into one entry; do not create one changelog entry per task. Use multiple same-day entries only for genuinely separate completed sessions or unrelated commits.

Do not reformat or rewrite older historical entries unless explicitly asked. If the current work continues an earlier already-closed session, add a new entry under today's date rather than retroactively editing the old one.

**4. Apply the build versioning rules** from §3 (phase from the current roadmap milestone; session bumps within a phase).

**5. One commit or split?** Lean toward one when close to the edge — splitting later is easy, rejoining fragmented history isn't.
- Same feature/purpose across files → one commit.
- A doc update + the code implementing it → may be one commit, but a change that *contradicts* a doc must update the doc first (see edge cases).
- Independent concerns, or cleanup + feature work → split.

**6. Draft commit messages** in the §1 format.

**7. Present the plan** (changes, changelog status, commit plan with messages and file lists) and then **stop. Do not commit.** The owner runs `git commit`.

### Wrap-up edge cases

- **Clean working tree** → say so and stop.
- **Merge conflict in progress** → stop; tell the owner to resolve first.
- **Untracked files the owner didn't mention** → surface and ask.
- **"Just commit it."** → still present the plan and stop; staging and messages are done, but the commit is the owner's to run. Never skip the safety pass to save a step.
- **Code change contradicts a doc** → surface it: *"This conflicts with `02-technical-design.md §15`. Update the doc in this commit, or split into a separate doc-update commit?"*
- **A change would touch a forbidden capability** → do not stage it. Surface the conflict per AGENT.md §1; this overrides any "just commit" instruction.

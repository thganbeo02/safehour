# Doc Workflow

> Task module — read when editing or creating a spec doc (Charter, PRD, TDD, roadmap, or a feature spec). The §1 non-negotiables and §2 refusal policy in `AGENT.md` always apply on top of this.

## 1. Document hierarchy

Authority order (higher wins on conflict):

```
00-safety-charter.md      ← constitution; governs everything
01-prd.md                 ← product: vision, principles, MVP scope
02-technical-design.md    ← architecture, data model, schema enforcement
04-roadmap-and-qa.md      ← build order, acceptance, QA strategy
03-feature-template.md    ← reusable form (copied per feature into features/)
features/*.md             ← individual feature specs
```

- Docs cite the Charter by section ("Charter §6"). The Charter cites nothing as authority — it is the top.
- When two docs disagree, the higher-authority doc is correct and the lower one is a bug to fix.
- Put new content in the **lowest-authority doc that owns it**: a feature → PRD + a spec; data shape → TDD; process/tests → Roadmap & QA. Only touch the Charter for genuine safety-rule changes.

## 2. Update workflow

Follow these steps in order every time:

- **Gate first (features only).** Any new or changed _feature_ must pass the Feature Template §16 final safety test and §5c Backfire Check **before** you write or edit anything else. If questions 1–4 of §16 are "yes," redesign until "no" — document the redesign, never waive the rule.
- **Charter check.** Does the change touch anything the Charter governs? If it could weaken a safety guarantee, **stop** — that is a deliberate Charter amendment, not a routine edit, and must be raised explicitly with the owner.
- **Edit the owning doc** (per §1 above).
- **Propagate citations.** Update every doc that references the changed section. This is the step most often skipped — do not skip it. Grep for the section number and the feature/entity name across all docs.
- **Bump version + changelog.** Update the `Version:` and `Last updated:` lines under the title on every doc you touched, add a row to that doc's own changelog, and add/extend the entry in `CHANGELOG.md`.
- **Re-run QA.** If it was a feature or schema change, re-run the affected safety track items in `04-roadmap-and-qa.md` §C2 — and re-run the §16 test _post-implementation_, not just at design time.

### The Charter-change rule (most important)

When `00-safety-charter.md` changes:

- Bump its version (a change that invalidates dependents is **MAJOR**).
- **Re-check every doc that cites the changed section** and confirm it still holds. List the re-checked docs in the changelog entry.
- A Charter change is never "just a wording tweak" if it alters what is permitted or forbidden.

## 3. Document versioning (semver, per file)

Versions a single document as a stable artifact. Sits directly under the doc title, as two plain lines (not a YAML front-matter block):

```
# Doc Title

**Version:** MAJOR.MINOR.PATCH
**Last updated:** YYYY-MM-DD

> Intro paragraph (states the doc's authority relationship — e.g. "defers to
> 00-safety-charter.md", or "highest authority" for the Charter).
```

The authority relationship lives in the intro paragraph, not a separate header field. Keep version and last_updated each on their own line.

- **MAJOR** — invalidates other docs or reverses a decision. Realistically only Charter and PRD. Forces dependent review.
- **MINOR** — new feature, entity, or section.
- **PATCH** — wording, clarification, formatting; nothing binding changes.

A copied feature template starts its _own_ spec at `1.0.0`; the template file's version tracks changes to the form itself.

(Build/session versioning — `v0.<phase>.<session>` on changelog entries — is a separate scheme used at wrap-up. See `commit-and-wrapup.md`.)

## 4. Checklist before finishing a doc task

- [ ] Passed the Feature Template §16 gate + §5c Backfire Check (if a feature)
- [ ] Citations propagated across all docs that reference the change
- [ ] Versions + both changelogs (per-doc and central `CHANGELOG.md`) updated
- [ ] Nothing introduced that AGENT.md §1 forbids; no shaming copy or forbidden vocabulary
- [ ] Relevant QA safety-track items re-run (if schema/feature changed)

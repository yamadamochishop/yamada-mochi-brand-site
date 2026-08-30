---
name: ai-review
description: Independently review a deliverable made by an AI or a human for the 山田もち店 brand site, checking Git scope, canonical evidence, implementation, Skill entry parity, validation, security, and regression, then return Approve, Approve with changes, or Reject. Use for review requests, pre-commit and pre-PR checks, diff review, content review, security review, and pre-publication review.
---

# AI Review

Review a deliverable independently of its author. Claude Code invokes this Skill as `/ai-review`; Codex invokes it as `$ai-review`. Both runtimes resolve through their symlink entry points to this single body, and the judgments, procedure, and report format are identical. Per-runtime load status is recorded in `docs/ai/skills/README.md`; do not mix a verified runtime with an unverified one. If the Skill does not start on a runtime, do not change this body or the entry points on a guess — report the fact to a human.

This Skill does not replace SK-001, SK-002, SK-003, or SK-004: those Skills produce the deliverable, and this Skill judges it. Do not create, edit, or delete a file, and do not commit, push, open a PR, merge, or deploy.

Report findings and a verdict only. Applying a fix belongs to SK-002 or SK-004, and re-review is mandatory after any fix.

## Skill Identity

| Item             | Value                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Upstream         | AI Company OS Skills                                                                                                                            |
| Skill ID         | SK-005                                                                                                                                          |
| Skill name       | ai-review                                                                                                                                       |
| Upstream version | 0.1.0 (Draft)                                                                                                                                   |
| Runtimes         | claude-code / codex — load status in `docs/ai/skills/README.md`                                                                                 |
| This file        | 山田もち店ブランドサイト Project Adaptation. Upstream prohibitions are inherited unchanged; only technical and reporting specifics are adapted. |

The common specification (`specifications/SK-005-ai-review/`) and the acceptance tests (`tests/SK-005/`) are canonical in the Upstream repository. This body functions on its own without reading them at runtime. Do not pin an Upstream absolute path here. If this body and the common specification conflict, stop and report to a human.

## Project Adaptation

- Canonical state is `origin/main` of `yamadamochishop/yamada-mochi-brand-site`. A push to `main` is deployed automatically by Vercel to the production site. Treat every main-bound change as production-affecting, and say so in the readiness result.
- Validation in this repository is `pnpm run check` (`check:catalog` → `lint` → `typecheck` → `build`) and `pnpm run test`. A review that reports validation as passed must name the command and its actual result. Do not report a command as run when it was not.
- `AGENTS.md` requires an independent review before merge for a change to a Skill, a Runtime, a Skill entry point, or `AGENTS.md` itself, and the `main` direct-push exception in `docs/development/GIT_WORKFLOW.md` does not apply to those changes. Verify that the deliverable's route to `main` matches this.
- Skill entry parity in this repository: a Skill has exactly one body at `docs/ai/skills/<skill-name>/SKILL.md`, and `.claude/skills/<skill-name>` and `.agents/skills/<skill-name>` are relative-path symlinks to it, recorded in git as mode `120000`. Verify with `git ls-files -s .claude/skills .agents/skills`. A `100644` entry means the entry point is a regular file: the Skill does not load, and editing it starts a second copy of the body. Report that as a finding; do not resolve it by copying the body.
- An entry point recorded as an absolute path is a finding, not a working configuration. Absolute-path Skill entry points into a directory outside the repository are known to be broken elsewhere on this machine, and they do not survive a fresh clone.
- The Upstream acceptance tests (`tests/SK-00x/`) are canonical in the Upstream repository. This repository's `tests/` holds site tests. Do not report an Upstream acceptance test as executed here unless it was.
- Content facts are canonical in `data/` and in BASE, not in a document. Legacy material outside this repository, including any pre-migration site export elsewhere on the machine, is not canonical evidence.

## Independence

Identify the author and the reviewer before reviewing.

If the same AI in the same session produced the deliverable, this is a `Self Review`, not an `Independent Review`. Record `Independent Review: No (Self Review)`.

A `Self Review` does not yield `Approve`. Cap the verdict at `Approve with changes`, even when nothing was found, and record the missing independent review under `Human Decision Required`.

A new Skill, Runtime, Skill entry point, published content, UI, code, SEO change, measurement setting, external service setting, or material business, brand, or editorial document requires an independent review.

## Phase 1: Git Scope

Confirm the repository, branch, base commit, HEAD, tracked changes, untracked files, the intended change targets, any out-of-scope difference, the impact on existing Skills, and any Legacy or other-worktree contamination.

An unexpected difference blocks `Approve`. A material one is `Reject` or `Blocked`.

## Phase 2: Canonical Evidence

For every document used as a basis for judgment, confirm that it exists in the canonical source, that it is current, its creation and update dates, the delivery platform it describes, that it is not Legacy, and that no newer change has superseded it.

Do not treat a document that exists only in the working tree, only on a diverged branch, or that predates the current state as canonical. Record which sources you used and which you rejected, with reasons.

## Phase 3: Specification

Check Purpose, Scope, Trigger, Inputs, Preconditions, Procedure, Outputs, Completion Criteria, Human Approval, Prohibited Actions, Error Handling, separation of responsibility from other Skills, and governance alignment. Report internal contradictions, expectations that the specification does not support, and any overlap or gap in responsibility.

For a deliverable that is not a Skill, apply this phase to the change's stated intent and scope instead.

## Phase 4: Implementation

| Target      | Checks                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skill body  | valid YAML frontmatter with `name` matching its directory and a non-empty `description`, self-contained without reading the Upstream SPEC at runtime, no Upstream absolute path, performs no merge, deployment, or material decision, stop conditions preserved, no loosening of an Upstream prohibition                                                                                            |
| Skill entry | one body per Skill, both entry points present, relative symlinks, recorded as `120000`, both resolving to the same canonical body                                                                                                                                                                                                                                                                   |
| Content     | the sources named in the SK-004 Project Adaptation, the stated unavailable policy range, internal-link rules, legal and advertising and supplied-product relationships, food and allergen and shelf-life statements confirmed by a human, separation of fact from experience from hypothesis from proposal, no assertion of unverified information, prices and availability states matching `data/` |
| Code / UI   | change scope, `pnpm run check`, `pnpm run test`, Preview, rollback, unintended generated files, impact on production and publication                                                                                                                                                                                                                                                                |
| Docs        | statements match the canonical source, no contradiction with `README.md`, `AGENTS.md`, `CLAUDE.md`, or `docs/development/`, links resolve, nothing unimplemented is described as implemented, no runtime is described as verified when it is not                                                                                                                                                    |

## Phase 5: Validation and Acceptance

Confirm which validation was actually run, with its command and result, and which was not.

For a change that carries acceptance criteria, confirm each case carries `Preconditions`, `Test Input`, `Reproduction Steps`, `Expected Behavior`, `Expected Result`, and `Forbidden Behavior`, and that coverage includes normal paths, error paths, `Blocked` paths, `Ready with caution` paths, secret protection, the prohibition on unreviewed direct main changes, stopping before merge and deployment, runtime parity, governance conflict, Legacy contamination, unknown canonical state, dirty differences, and missing rollback.

Report any case whose expected result does not follow from the change, any case that cannot fail, and any case whose `Forbidden Behavior` does not correspond to its `Expected Behavior`.

## Phase 6: Security and Portability

Check for secrets, API keys, tokens, passwords, environment values, personal data, customer data, absolute paths, user names, local-only references, and excessive coupling to one machine or one worktree.

Do not print a value. Report only its existence, location, and risk.

## Phase 7: Regression

Check the impact on existing Skills and entry points, contradictions with `README.md`, `AGENTS.md`, `CLAUDE.md`, and `docs/development/`, conflicts with the established branch workflow, conflicts with the canonical source and the actual deployment reality, regression from a previously approved state, drift between runtimes, and loss of validation precision.

### Dependency Review

When the review adds a Skill, integrates one, or changes the division of responsibility between Skills, also check:

1. Whether any existing document still describes the Skill being added as unimplemented or unavailable.
2. Whether a fallback elsewhere has become unnecessary or wrong now that the dependency exists.
3. Whether `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/ai/skills/README.md`, and the Skill bodies agree with each other on the dependencies and delegation targets between Skills.
4. Whether adding the Skill invalidates the preconditions of any existing test.
5. Whether the depending Skill defines a fallback for when the depended-on Skill is unavailable.
6. Whether the recorded Upstream version is consistent everywhere it appears.

The new Skill and every existing document that references it must be updated atomically on one branch. Do not `Approve` while a dependency contradiction is unresolved, because integrating one side alone leaves the canonical source self-contradictory.

## Verdict

| Verdict                | Conditions                                                                                                                                                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Approve`              | No required change, no unexpected difference, canonical source and intent and implementation agree, no security problem, regression risk acceptable, the work can proceed to commit or the next stage, and the review is independent.          |
| `Approve with changes` | A fixable problem exists, its target is identifiable, the overall design need not be discarded, and the required changes can be stated concretely. Re-review after the fix is mandatory.                                                       |
| `Reject`               | The underlying design is unsound, safety cannot be assured, the canonical source and intent and implementation contradict materially, unintegrated work or secrets or destructive operations are mixed in, or partial fixes cannot resolve it. |

Report the deliverable's readiness separately as `Ready`, `Ready with caution`, or `Blocked`. The verdict judges the review; the result states whether the next stage may begin.

## Required Changes

Give every required change all six of these: the target file, the target location, the problem, the risk, the fix, and how to verify the fix.

Keep optional improvements out of required changes and put them under `Non-blocking Improvements`. Put anything whose necessity you cannot determine under `Human Decision Required`. Write each required change so that someone other than the reviewer can act on it and confirm it is resolved.

## Human Approval

Do not decide a main merge, a deployment, a publication, an external service change, a pricing or permission change, a material business or brand or editorial judgment, a legal or pharmaceutical or advertising judgment, an exception to a required change, or whether to proceed without the missing independent review.

## Mandatory Stop Conditions

- The canonical source, base, or branch cannot be identified.
- The review target or its files cannot be confirmed.
- A secret, credential, or personal-data value would be exposed.
- Required validation was not run, or a validation failure is unresolved.
- A required Preview was not obtained.
- Higher-ranked governance documents contradict each other on a material point.

## Output

```markdown
# AI Review Result

## Review Identity

- Reviewer:
- Author:
- Independent Review:
- Repository:
- Branch:
- Base:
- HEAD:

## Overall Verdict

- Approve
- Approve with changes
- Reject

## Git Scope Review

## Canonical Evidence Review

## Specification Review

## Implementation Review

## Skill Entry Parity Review

## Validation and Acceptance Review

## Security and Privacy Review

## Regression Review

## Risks

## Required Changes Before Next Step

## Non-blocking Improvements

## Human Decision Required

## Safe Next Step

## Result

- Ready
- Ready with caution
- Blocked
```

State the verdict with its basis, and stop. Do not apply a fix, commit, push, open a PR, merge, or deploy.

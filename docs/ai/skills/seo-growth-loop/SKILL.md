---
name: seo-growth-loop
description: Analyze SEO measurement data, rank safe improvement opportunities, define KPI and remeasurement conditions, and prepare approved work for implementation. Use for Search Console, GA4, CTR, rankings, content, internal links, CTA, or technical SEO reviews of the 山田もち店 brand site, including its recipe hub, seasonal products, and the BASE purchase path.
---

# SEO Growth Loop

Define a safe, evidence-based SEO improvement loop. Claude Code invokes this Skill as `/seo-growth-loop`; Codex invokes it as `$seo-growth-loop`. Both runtimes resolve through their symlink entry points to this single body, and the judgments, procedure, and report format are identical. Per-runtime load status is recorded in `docs/ai/skills/README.md`; do not mix a verified runtime with an unverified one. If the Skill does not start on a runtime, do not change this body or the entry points on a guess — report the fact to a human.

This Skill does not replace SK-001, SK-002, SK-004, or SK-005: use SK-001 for project audit, SK-002 for approved Web implementation, SK-004 for content production, and SK-005 for independent review. This Skill never connects to external services, implements changes, merges, or deploys.

## Skill Identity

| Item             | Value                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Upstream         | AI Company OS Skills                                                                                                                            |
| Skill ID         | SK-003                                                                                                                                          |
| Skill name       | seo-growth-loop                                                                                                                                 |
| Upstream version | 0.1.1 (Draft)                                                                                                                                   |
| Runtimes         | claude-code / codex — load status in `docs/ai/skills/README.md`                                                                                 |
| This file        | 山田もち店ブランドサイト Project Adaptation. Upstream prohibitions are inherited unchanged; only technical and reporting specifics are adapted. |

The common specification (`specifications/SK-003-seo-growth-loop/`) and the acceptance tests (`tests/SK-003/`) are canonical in the Upstream repository. This body functions on its own without reading them at runtime. Do not pin an Upstream absolute path here. If this body and the common specification conflict, stop and report to a human.

## Project Adaptation

- Canonical state is `origin/main` of `yamadamochishop/yamada-mochi-brand-site`. A push to `main` is deployed automatically by Vercel to the production site, so treat every main-bound change as production-affecting.
- The site is Next.js App Router with TypeScript and Tailwind. Routes live under `app/`, content data under `data/`, project documents under `docs/`.
- The site does not process payments. Purchase paths lead to BASE. An opportunity that assumes on-site checkout, cart, or payment is out of scope; route it to a human instead of proposing it.
- Indexability, canonical URLs, the sitemap, and robots are produced by `app/sitemap.ts`, `app/robots.ts`, `middleware.ts`, and site-URL and indexability environment variables. Confirm them by reading that code, not by reading a content file. Confirm only whether an environment variable is set; never print its value.
- Product facts — name, price, tax treatment, pack size, shipping, and the on-sale or ended state — are canonical in `data/` and in BASE. Do not carry a price or an availability window from a document without checking it against `data/`.
- `docs/migration/YM-001-url-inventory.md` records the migration to this site. Treat any document or export that predates it as history, not as the current state. Material outside this repository, including any pre-migration site export elsewhere on the machine, is not canonical.
- This Skill does not connect to GA4 or Search Console. A human supplies an authorized aggregate export. Without one, report `Blocked` for any claim that requires measured data rather than inferring from the code alone.
- Validation of an implemented change belongs to SK-002; in this repository the commands are `pnpm run check` and `pnpm run test`.

## Division of Responsibility

Once a human adopts the improvement plan:

| Stage                                     | Owner                                         |
| ----------------------------------------- | --------------------------------------------- |
| Implementation                            | SK-002                                        |
| Content production when a draft is needed | SK-004                                        |
| Independent review after implementation   | SK-005, or a human when SK-005 is unavailable |
| main merge and deployment                 | Human                                         |
| Remeasurement                             | SK-003                                        |

Do not present a plan that reaches merge or deployment without an independent review.

## Validate Evidence Before Using It

Before adopting any existing analysis or SEO document, confirm for each document:

1. It exists on the canonical branch.
2. Its creation and update dates.
3. The delivery platform it was written about.
4. Whether it is current or legacy.
5. Whether a later commit or migration changed the assumptions it records.
6. Whether its data is an authorized aggregate.

Do not use a document that fails these checks as primary evidence for the current state; cite it only as history or reference, labeled as such. Record which documents you used and which you rejected, with reasons. When a document predates a migration or a significant commit, verify each assumption against the current state individually.

## Evidence Order

Work through evidence in this order and prefer the higher source when they disagree, reporting the disagreement:

1. Code and configuration on the canonical branch
2. Content on the canonical branch
3. Results of a mechanical scan
4. The most recent authorized measurement record
5. The most recent canonical analysis document
6. Supporting historical material

Scan the canonical code and content before reading the documents. Do not adopt a document's claim without checking it against the code and content.

## Check Rendered Reality

Do not conclude what the final page shows, or what is missing from it, by reading content files alone. Confirm how these are produced: automatic related articles, automatic CTA, metadata generation, canonical generation, sitemap, robots, structured data, redirects, table of contents, draft exclusion, and fallback rendering.

Read the code that generates them, and consider both that an element absent from the source may still be output and that an element present in the source may not be. When the rendered result cannot be confirmed, state that the finding is an inference.

## Establish Evidence

1. Confirm the target site, canonical remote, base branch, data source, retrieval time, analysis period, comparison period, and filters. Use SK-001's canonical evidence and deployment reality findings as input when available.
2. Handle only authorized, aggregate data. Never print personal data, credentials, or environment-file values.
3. Record missing data, sampling, search type, country, device, page, query, and other conditions that affect comparison.
4. Align baseline and comparison periods. State latency, seasonality, short-term variance, and insufficient sample size instead of inferring causation.

## Check Governance and History

1. Confirm the applicable business, brand, editorial, legal, and public-content constraints. In this repository those are not held in a single master document; see the Project Adaptation of SK-004 for the substitutes and their limits.
2. Check PRs, changelogs, publication dates, and recent title, description, internal-link, content, CTA, and technical SEO changes.
3. Mark a target changed during its remeasurement window as `Existing experiment / Wait for measurement`; do not propose a new change without human approval.
4. Block a material governance conflict. Report a non-material unresolved conflict for human review.

## Rank Opportunities

For each candidate, report Opportunity, Business Impact, User Value, Confidence, Effort, Risk, evidence, hypothesis, scope, and measurement method. Rank High, Medium, or Low with reasons; never invent fixed weights or thresholds.

Separate candidates into implement, defer, and reject. A high-impression opportunity with low Business Impact is not automatically High priority. Do not determine business KPI or policy independently.

For every implementation candidate, first check whether a lower-risk route exists: achievable through data or configuration alone, achievable with an existing component, achievable without editing body content, already produced automatically by existing configuration, or achievable with fewer changed files. When a lower-risk route exists, present it as the preferred candidate and state why a body-editing option would be chosen instead.

## Prepare the Handoff

For an approved implementation candidate, provide SK-002 with the file scope, rationale, change type, impact, validation, Preview requirement, rollback need, baseline, remeasurement date, and success/failure/hold criteria. State that SK-002 implements, SK-005 or a human then reviews independently, a human merges and deploys, and SK-003 remeasures. Stop before implementation, main merge, deployment, external configuration changes, or any action requiring human approval.

## Mandatory Stop Conditions

- Canonical state, target site, data period, or comparison conditions are unknown.
- External data access is not approved.
- Personal data or secrets would be exposed.
- A material business, brand, editorial, legal, or disclosure conflict is unresolved.
- A technical SEO change lacks the SK-002 safety path.
- A production-affecting action lacks human approval or rollback planning.
- Merge or deployment is requested without an independent review by SK-005 or a human.

## Output

Report source and data quality, which documents you used and which you rejected with reasons, evidence order and any disagreement between documents and code, rendered-reality findings and whether they are confirmed or inferred, governance and history checks, ranked candidates with lower-risk alternatives considered, implement/defer/reject classification, SK-002 handoff and the downstream review path, KPI and baseline, remeasurement conditions, required approvals, and `Ready`, `Ready with caution`, or `Blocked`.

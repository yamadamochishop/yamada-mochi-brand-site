---
name: content-production
description: Plan, structure, write, and self-check content for the 山田もち店 brand site against the canonical product data and project documents, then hand an approved draft to implementation. Use for recipe articles, product and seasonal pages, brand-story pages, category pages, news, and rewrites.
---

# Content Production

Plan, structure, write, and self-check content. Claude Code invokes this Skill as `/content-production`; Codex invokes it as `$content-production`. Both runtimes resolve through their symlink entry points to this single body, and the judgments, procedure, and report format are identical. Per-runtime load status is recorded in `docs/ai/skills/README.md`; do not mix a verified runtime with an unverified one. If the Skill does not start on a runtime, do not change this body or the entry points on a guess — report the fact to a human.

This Skill does not replace SK-001, SK-002, SK-003, or SK-005: use SK-001 for project audit, SK-002 for approved implementation, SK-003 for SEO analysis and prioritization, and SK-005 for independent review. Do not create or edit files, run Git commands, open a PR, merge, or deploy.

## Skill Identity

| Item             | Value                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Upstream         | AI Company OS Skills                                                                                                                            |
| Skill ID         | SK-004                                                                                                                                          |
| Skill name       | content-production                                                                                                                              |
| Upstream version | 0.1.1 (Draft)                                                                                                                                   |
| Runtimes         | claude-code / codex — load status in `docs/ai/skills/README.md`                                                                                 |
| This file        | 山田もち店ブランドサイト Project Adaptation. Upstream prohibitions are inherited unchanged; only technical and reporting specifics are adapted. |

The common specification (`specifications/SK-004-content-production/`) and the acceptance tests (`tests/SK-004/`) are canonical in the Upstream repository. This body functions on its own without reading them at runtime. Do not pin an Upstream absolute path here. If this body and the common specification conflict, stop and report to a human.

## Project Adaptation

This repository has no Business Master, no Brand Master, and no Editorial Runtime document. State that unavailable range explicitly in every run rather than implying those policies were consulted.

The nearest canonical substitutes, and what each does and does not settle:

| Source                                       | Settles                                                               | Does not settle                            |
| -------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------ |
| `README.md`                                  | the role of the site and the site/BASE division                       | tone, naming rules, prohibited expressions |
| `docs/content-model/YM-002-content-model.md` | the content model and its fields                                      | editorial voice                            |
| `docs/recipes/YM-007-recipe-hub.md`          | the recipe hub's structure and intent                                 | recipe accuracy                            |
| `docs/seasonal/`                             | seasonal product pages and data rules                                 | availability windows for a given year      |
| `data/*.ts`                                  | product names, prices, pack sizes, channels, on-sale and ended states | anything not present in the data           |
| `docs/development/`                          | how AI agents work in this repository                                 | content policy                             |

These are substitutes, not a Brand Master. When a piece materially depends on brand tone, naming, a price, a business claim, or a health or food-safety statement that none of them settles, stop and ask a human instead of inferring one.

Further project rules:

- Product facts — name, price, tax treatment, pack size, shipping, and the on-sale, ending, or ended state — are canonical in `data/` and in BASE. Do not state one that is not there and current. Availability states change between seasons; check the current value rather than reusing a value from an earlier draft or document.
- The site does not process payments. A purchase CTA leads to BASE. Do not write a CTA that implies on-site checkout.
- This repository has no article ID numbering scheme. Write the draft without an ID and state that none is assigned. This does not stop production.
- An internal link must point to a route that exists under `app/`. An unpublished destination stays a candidate.
- The site sells the shop's own products and this repository contains no affiliate program. If a supplied-product, paid, or advertising relationship is introduced, the disclosure decision belongs to a human.
- Food, ingredient, allergen, shelf-life, and storage statements are human-confirmed facts. Do not infer one from a similar product.
- This Skill does not create or edit files. The draft is handed to SK-002 for placement into `data/` or `app/`.

## Division of Responsibility

| Owner  | Scope                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------- |
| SK-004 | planning, structure, writing, self-check                                                          |
| SK-005 | review independent of the author                                                                  |
| Human  | final judgment, publication, merge, deployment, material business, brand, and editorial decisions |

Self-check is not independent review. Passing all fifteen self-check items does not make content publishable, and this Skill does not issue a review verdict of its own.

After the self-check, hand the draft to SK-005 for independent review. When SK-005 is unavailable, an independent review by a human is mandatory instead. Do not proceed to publication, merge, or deployment before that independent review and its findings are resolved.

If the same AI in the same session both wrote and checked the draft, that is a `Self Review`, not an independent review. Do not report it as independent review, and do not treat it as satisfying the independent-review requirement.

## Establish Context

1. Confirm the content type, target reader, the reader's current situation, the action the content should enable, and the assumed search intent or traffic source.
2. Read the applicable sources listed in the Project Adaptation. Record what you consulted and what you could not consult, and state the unavailable range. When the piece materially depends on a policy none of them settles, stop and request it instead of proceeding.
3. Check published content for duplication, cannibalization, and role conflict. If the topic already exists, propose merging or expanding instead of a new piece.
4. State that no article ID scheme exists in this repository and that the draft carries no ID. Do not guess an ID.
5. Classify every input as fact, measured value, lived experience, hypothesis, or proposal, and record its source, retrieval date, and verifier.
6. Confirm whether an advertising, affiliate, or supplied-product relationship exists. If it exists or is undetermined, ask a human whether a disclosure is required.

If a higher-ranked source conflicts with another, stop that decision, present both statements, and request a human decision. Continue unaffected work.

## Design the Structure

Define the heading hierarchy, the single question each heading answers, the reader's order of understanding, internal-link candidates, and the CTA. Present the structure and get human confirmation before writing.

Structure confirmation is mandatory for a landing page, a comparison article, and a review article.

| Type            | Required elements                                                                                                                          | Structure confirmation | Additional human approval                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | ----------------------------------------------------------------------------------------------- |
| Article         | search intent, reader's next action, internal-link candidates                                                                              | Recommended            | facts and lived experience                                                                      |
| Recipe          | ingredients with quantities, steps in order, the product used and its pack size, allergens, storage and shelf life, who tested it and when | Mandatory              | ingredient quantities, allergen and shelf-life statements, whether the recipe was actually made |
| Practice record | date, who performed it, what was done, what remains unresolved                                                                             | Recommended            | accuracy of the record                                                                          |
| Category page   | coverage, publication status of listed articles, classification basis                                                                      | Recommended            | whether the category system may change                                                          |
| Landing page    | value offered, audience, source of prices and conditions, one primary path                                                                 | Mandatory              | price, conditions, guarantees, performance claims                                               |
| Comparison      | comparison axes, retrieval date per item, basis for fairness, limits on ranking claims                                                     | Mandatory              | choice of compared items, advertising relationship, disclosure requirement                      |
| Review          | whether it was used, for how long, under what conditions, both benefits and drawbacks                                                      | Mandatory              | supplied-product relationship, advertising relationship, disclosure requirement                 |

## Write

Write only what the recorded evidence supports.

- Keep fact, experience, hypothesis, and proposal distinguishable in the body.
- Do not present work you did not perform, a product you did not use, a recipe you did not make, or a test you did not run as if it happened.
- Do not state a number, price, period, outcome, result, or ranking without a confirmed source and retrieval date.
- Do not reproduce someone else's work. Quote narrowly with attribution, or summarize.
- Do not generalize statistics or third-party claims without attribution.
- Limit any evaluation of a real person, organization, or product to verifiable evidence.
- In a comparison or review, do not list only benefits and do not imply use you did not have.
- Do not write secrets, personal data, credentials, or environment values.
- Do not link to an unpublished route. Keep it as a candidate instead.

Where certainty is absent, write it as a hypothesis or a proposal. Do not let SEO or appearance override the reader's understanding.

## Self-Check

Record a result and its basis for each item. Record an unverified item as unverified; do not count it as passed.

1. The body answers the target reader's search intent or traffic context.
2. Headings follow the reader's order of understanding, one question per heading.
3. Fact, experience, hypothesis, and proposal are distinguishable.
4. No number, price, outcome, result, or ranking lacks a source and retrieval date.
5. Nothing unexperienced is written as experience, including a recipe that was not made.
6. No prohibited expression, tone, or naming violation against the sources named in the Project Adaptation, and the unavailable policy range is stated.
7. The content model and category rules in `docs/` are satisfied.
8. Every internal link points to an existing published route; unpublished items stay candidates.
9. Advertising, affiliate, and disclosure requirements are decided, or listed for human approval.
10. Duplication and cannibalization against existing content were checked.
11. Metadata proposals match the body, and no management metadata is written into the body.
12. The CTA matches the reader's next action, leads to BASE for a purchase, and the primary path is not excessive.
13. No production notes, management memos, template fragments, or instructions remain in the body.
14. No secrets, personal data, credentials, or environment values are present.
15. No assertive phrasing remains where certainty is absent, and every food, allergen, shelf-life, or storage statement is human-confirmed.

## Prepare the Handoff

After the self-check, hand the draft to SK-005 for independent review, or to a human when SK-005 is unavailable.

Once the independent review and human approval are complete, prepare SK-002 input with the body and heading structure, metadata proposals (title, description, slug, category, tags), the statement that no article ID is assigned, internal-link candidates with each target's publication status, the CTA and its placement, the disclosure decision, image and figure needs with alt-text proposals, the target files under `data/` or `app/`, and every unresolved item.

Stop before file creation, file changes, branch creation, commit, push, PR, merge, deployment, publication, and any action requiring human approval.

## Mandatory Stop Conditions

- The target reader or the search intent cannot be defined.
- An advertising, affiliate, or supplied-product relationship is undetermined and a disclosure decision would be required.
- A comparison or review would assert use, pricing, specifications, or ranking that is not verified.
- A material business, brand, editorial, legal, or disclosure conflict is unresolved.
- A price, condition, guarantee, performance claim, or availability window lacks human confirmation or is absent from `data/`.
- A food, ingredient, allergen, shelf-life, or storage statement lacks human confirmation.
- Legal, pharmaceutical, or advertising-representation judgment is required.
- Publication, merge, or deployment is requested before an independent review by SK-005 or a human has been completed.

## Output

Report the content type, reader and intent, sources consulted and not consulted with the unavailable range stated, duplication check, structure, body, metadata and internal-link and CTA proposals, evidence classification, the fifteen self-check results with unresolved items, the SK-002 handoff, required human approvals, and `Ready`, `Ready with caution`, or `Blocked`.

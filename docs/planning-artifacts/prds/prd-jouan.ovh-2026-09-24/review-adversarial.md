# Adversarial product review — blog editorial PRD

**Review date:** 2026-09-25  
**Mode:** read-only product review. This review did not modify `prd.md` or `addendum.md`.  
**Sources:** the current working-tree PRD/addendum, `docs/specs/spec-blog-editorial/SPEC.md` and companions, the brownfield investigation, the current planning/sprint context, and the brownfield files cited by the investigation.

## Verdict

**CHANGES REQUIRED — do not approve the draft for implementation and do not create implementation stories yet.**

The current draft is materially better than an ordinary PRD: it now acknowledges the brownfield baseline, labels several capabilities as phase 2, adds a visibility baseline, separates local/browser/production bundles, adds proof and privacy guardrails, and explicitly rejects invented performance targets. Its editorial direction is aligned with the user priority: prove technical authority first, serve a qualified technical audience second, support commercial utility third.

It is still not a safe implementation contract. The committed slice and the success signals disagree; the proposed defaults are explicitly provisional but still look operative to downstream agents; direct-route exposure, repository privacy, field-level AEO governance, and the brownfield migration remain open; and the “proof” requirement is still a principle rather than an auditable gate. A green build can still produce weak authority, leaked draft material, or contradictory public metadata.

**Disposition:** keep the PRD in `draft`; take the blocking decisions through `bmad-correct-course`; close them in the SPEC/companions/decision log; then re-review. The safest first implementation is one real, privacy-reviewed article plus the minimum public discovery/reading path, reusing the existing SEO/AEO owners.

## Severity scale

- **Critical:** can leak private content, create contradictory public routes/metadata, or make delivery impossible to scope/accept safely.
- **High:** materially threatens authority, privacy, SEO, brownfield stability, or the stated product priority.
- **Medium:** creates ambiguity, weak evidence, operational risk, or avoidable rework.
- **Low:** documentation or editorial debt that should be cleaned before story extraction.

## Critical findings

### C-01 — Phase boundaries still contradict the MVP and success signals

**Evidence.** The capabilities now marked phase 2 include hubs (`FR-5`), related (`FR-8`), and the enriched author page (`FR-10`), and the first slice explicitly defers them (`prd.md §13.1`). Nevertheless, the same `In Scope` list still includes hubs, the author page, project relations, related, expanded SEO/AEO, and conditional RSS; `SM-2` still requires all hubs and the author page; `SM-1` still says it validates `FR-1` through `FR-17`; and `SM-4` still validates the conditional RSS capability. The addendum explicitly rejects premature project pages and taxonomy (`addendum.md` anti-patterns).

**Adversarial assessment.** “Phase 2” is a label, not a release boundary. An implementation agent can read the broad In Scope list, the primary success signals, or the first-slice list and produce three different backlogs. A later phase can be simultaneously out of the first slice and required by a primary success metric. This is the principal scope-creep failure.

**Required disposition.** `bmad-correct-course` must designate one committed first slice. Move every phase-2 item out of the first-slice In Scope and out of first-slice SMs, or explicitly make those SMs release-level rather than story-level. Create a traceability table: capability/FR → slice → story → dependency → blocking evidence → owner. Conditional RSS must have one unambiguous status (`out` or `in`), not both.

### C-02 — The authority promise is still not an auditable release gate

**Evidence.** The priority is clear (`prd.md §1`), and the draft now says that an article cannot be published as proof without editorial review (`prd.md §6.1`). That review has no rubric, reviewer role, evidence record, pass/fail rule, or minimum standard for “first-hand,” “method,” “result,” or “qualified reader.” `FR-2` now asks for sources, versions, environments, licenses, and trust/attribution, but does not define where those facts are validated or what makes an article publishable. `SM-8` and `SM-9` name qualified-reader signals and a proof checklist without a data method (`prd.md §14`). The addendum still calls its six-question checklist “proposée” (`addendum.md §3`).

**Adversarial assessment.** A generic article with a valid schema, a canonical, a related link, and a completed checkbox list can pass all structural gates. The draft has improved the vocabulary of proof but not the proof mechanism. The stated primary objective therefore remains unmeasured and unreviewable.

**Required disposition.** Define a minimal evidence rubric and a named review owner before the first real publication. Require an evidence record covering first-hand work versus synthesis, problem/constraints, method, sources/artifacts, result or explicit absence of result, limitations/failure/uncertainty, reproducibility, and next reusable step. Treat the first real article as an editorial validation task, not merely a route fixture. Define privacy-safe feedback collection for qualified readers without manufacturing a numeric target.

### C-03 — The privacy promise covers generated exports, not the content supply chain

**Evidence.** `prd.md §11` says drafts, fixtures, private repositories, client data, and form data are “not exported”; `FR-14` checks generated outputs. The investigation establishes that Markdown, Git, Content, HTML, AEO, CI, and the crawler are separate surfaces. The current remote is a GitHub repository, but the PRD does not state its visibility, permitted draft locations, branch policy, or history handling. `SITE.projects` contains internal/private-project descriptions and statuses. `FR-2` now mentions trust and attribution, but the referenced policy is not present as a testable artifact or owner-controlled checklist.

**Adversarial assessment.** A draft can be absent from `.output/public` and still be present in a branch, commit, CI workspace, build cache, screenshot, source map, or history. “No private repository URL” does not catch secrets in code, customer names in logs, tokens in images, or internal paths in error output. The new trust wording is directionally correct but currently aspirational.

**Required disposition.** Before authoring production content, define repository visibility, draft storage, branch/PR policy, redaction and secret scanning, screenshot/log review, third-party/client-data rules, image provenance, and the exact field allow-list for HTML, JSON-LD, Markdown, AEO, RSS, analytics, and links. Use canary private markers in fixtures and test all public and repository surfaces. Treat “not generated” and “not accessible” as separate requirements.

### C-04 — Direct access, preview, and noindex behavior are only a provisional baseline

**Evidence.** `prd.md §6.3` now includes a useful visibility matrix, but marks it a baseline whose exceptions and assertions still must be fixed. Draft/future/sitemap-excluded entries are shown as absent with “404 / preview only”; published noindex remains “according to policy”; `robots: false` has no row. The same decisions are still open in §15 and in `SPEC.md` Open Questions. The brownfield says the current HTML article route filters publication only, while the AEO middleware protects `.md` URLs; `crawlLinks: true` can expand a rendered link into a route (`brownfield.md`; investigation Findings 21, 25, 26).

**Adversarial assessment.** The draft has improved documentation but has not closed the security boundary. A noindex article can be directly shared; a sitemap-excluded article can be reachable in dev/runtime HTML; a relation can make a route public; and “preview only” is undefined in a static GitHub Pages architecture. A matrix that is explicitly provisional cannot be used as a release gate.

**Required disposition.** Ratify one state-by-surface contract before implementation: static route existence, dev/runtime status, HTML/meta robots, homepage/list/hub/related visibility, sitemap, AEO/Markdown, RSS, and preview authorization. Add direct-request tests for excluded entries, test the crawler before rendering, and specify how preview is built and isolated. Do not let `robots: false` inherit an accidental policy from `sitemap: false`.

### C-05 — The brownfield schema change has no migration or compatibility contract

**Evidence.** The current `content.config.ts` still accepts the old shape (`date`, `updated`, tags/read/image, optional draft) and has no `author`, `pillar`, `format`, `goals`, `project`, `related`, or the full SEO object. The current CI fixtures use that old shape. The PRD requires the new fields in `FR-1` and a resolver in the first slice, but supplies no normalizer, dual-read period, migration order, compatibility policy, or rollback. The investigation maps `date` through Content queries, the article route, Nitro scanning, sitemap, JSON-LD, AEO, and CI; the addendum calls `blog-indexability.ts` a source of truth even though the investigation identifies duplicated policy in several layers.

**Adversarial assessment.** This is a cross-layer product migration, not a frontmatter addition. Changing requiredness, image shape, date semantics, or relationship fields can break the homepage, SSG route discovery, AEO cleanup, and CI while leaving a superficially green build. The PRD also hides a resolver decision in product language.

**Required disposition.** Specify an atomic migration map and one resolver/normalizer contract. Decide whether old content is migrated, temporarily defaulted, or rejected; preserve existing consumers during transition; define failure semantics; add old/new/invalid/divergent fixtures; and document rollback and checkpoint ownership. The companion matrix should be executable, not merely cited.

### C-06 — Epic 14 and analytics are still an unstable, privacy-sensitive dependency

**Evidence.** The PRD requires Epic 14 stabilization, while the sprint register still shows Epic 14 in progress, 14.1 in progress, and 14.2/14.6 in review. The investigation records uncommitted changes in the same Content, SEO, AEO, page, plugin, and CI files. `NFR-11` says no new event is required, but `SM-5` requires reading/discovery/contact observability; current Epic 14 code already emits article title/slug/reading-time and `blog_code_copied` events.

**Adversarial assessment.** The blog would sit on unfinished privacy, consent, replay, and SEO/AEO work. A failure could be attributed to either epic, and the blog could smuggle telemetry into a privacy surface that has not been closed. “Existing analytics remains non-regressive” is an assumption, not a dependency gate.

**Required disposition.** Freeze/review/commit or isolate Epic 14 first and record the checkpoint. Keep blog analytics out of the first slice unless event names, payloads, consent/DNT behavior, minimization, retention, ownership, and test evidence are explicitly approved. Do not mix the two diffs.

## High findings

### H-01 — Provisional defaults are still presented as an implementation contract

The draft now labels the defaults “Provisoire” and calls §15 questions ratification gates (`prd.md §6.3`), which is an improvement. It still repeats the same values as operative bullets and leaves the actual ratification owner, date, evidence, and decision-log entry unspecified. `SPEC.md` and its decision log still mark date, author, project, preview, related, RSS, canonical, goals, and trailing slash as open. A downstream agent may reasonably treat the defaults as permission to implement before ratification.

**Action:** make the status machine explicit (`proposed`, `ratified`, `rejected`, `deferred`), and prohibit story readiness for any `proposed` dependency. Record the selected value, rationale, affected surfaces, migration, and rollback in one authoritative decision log.

### H-02 — The first slice says “reuse SEO/AEO,” but the scope says “extend” them

The brownfield table describes SEO/AEO as an extension of public fields; `FR-14` and the In Scope list call for extended SEO/AEO; the first slice says existing SEO/AEO only need to remain coherent. The PRD claims a field → owner → output → CI assertion matrix is normative, but neither cited companion currently supplies that complete matrix. This leaves the boundary between Epic 14 non-regression and new blog AEO work undefined, with privacy and duplicate-owner risk.

**Action:** make the first slice explicitly reuse-only, attach a concrete field allow-list and owner map, and defer any new public field until a separate decision. Do not let “extended” and “without divergence” coexist in one slice.

### H-03 — RSS remains a scope contradiction

RSS is marked “hors premier slice” in the default table, but remains an `In Scope` item, a conditional FR, part of the release-complete gate, and a target of `SM-4`. The source says the route does not exist and the addendum says it needs its own owner/MIME contract.

**Action:** choose `out of MVP` or `in MVP` now. If out, remove RSS from first-slice/release evidence; if in, specify owner, path, generation, MIME, discovery, item fields, limits, exclusions, and production checks before story creation.

### H-04 — Canonical, overrides, author URL, and trailing slash are still not closed

The draft keeps self-canonical and `/about` as provisional defaults, allows an approved canonical override, and leaves the override set and trailing-slash policy open. The current `usePageSeo` helper derives canonical from a path and does not define nested `seo.canonical` resolution. The investigation reports a possible production mismatch between slashless canonicals and GitHub Pages redirects.

**Action:** choose one URL form, one canonical owner, allowed override fields, alias behavior, and HTTP redirect assertions before adding hubs or author aliases. A “self-canonical by default” sentence is not sufficient when a `canonical` field is also allowed.

### H-05 — `related` still lacks a deterministic resolver and pre-crawl safety contract

The order explicit → project → pillar → tags → recency and maximum three are stated, but there is no score, tie-break, deduplication rule, missing-project fallback, or deterministic behavior for multiple explicit relations. The draft now marks related phase 2 while still including it in the first slice. `crawlLinks: true` means a relation error can create a public route rather than merely omit a suggestion.

**Action:** either remove related from the first slice or specify a deterministic resolver, strictness by relation class, filtering before render/crawl, and fixtures for missing/draft/future/noindex/sitemap-excluded/self/tie cases.

### H-06 — Project relations remain impossible to implement safely as written

`FR-11` requires a stable public project and bidirectional context, but the current `IProject` has no stable ID and no project-detail route. Current project data includes private-repository badges and internal status. The first slice includes context only if a destination is confirmed, while the In Scope list still includes the relation.

**Action:** choose text-only public context, a confirmed public destination plus stable IDs, or defer the relation. Never infer a URL or ID from a human project name; define the public projection and redaction boundary.

### H-07 — Hubs are phase-labelled but their route/discovery contract is still missing

The brownfield requires dedicated Vue routes because the catch-all treats `/blog/**` as articles, and the Content scanner does not discover Vue hubs. The PRD states desired behavior but does not specify reserved slugs, route precedence, prerender inclusion, sitemap ownership, or a non-capture assertion.

**Action:** if hubs are deferred, remove them from first-slice evidence; if included in a later release, add dedicated-route and discovery criteria before stories. A URL list is not a routing design.

### H-08 — Analytics is still a hidden blog capability and privacy surface

`NFR-11` says no new event is needed, while `SM-5` requires events. Existing Epic 14 tracking already includes article identifiers/title, reading completion, and a copy event despite copy UI being a non-goal. The PRD has no blog event schema, retention rule, payload minimization, or consent acceptance criterion.

**Action:** leave analytics to Epic 14 or approve a privacy-reviewed event contract separately. Blog success should not depend on a telemetry capability owned by an unfinished epic.

### H-09 — The Definition of Done is layered but not yet executable

The draft now distinguishes a blocking local bundle, a pre-merge browser bundle, and a post-deployment production bundle (`prd.md §4.7`), which addresses the earlier false-closure problem. It still does not specify an executable local command for the CI artifact assertions, an owner, an evidence location, or the exact pass/fail status for each bundle. The current workflow performs many assertions after the package scripts, so the Docker command alone is not the full static gate.

**Action:** identify the exact CI assertion entry point (or expose a script), assign owners, define evidence paths, and state which checks are merge-blocking versus release-blocking. Keep production probes separate but make them mandatory for release closure.

### H-10 — The design/theme baseline remains contradictory

The PRD says the blog must fit the existing light/dark system, while `AGENTS.md` and `project-context.md` prescribe dark-first with no light theme; `epics.md` and the current Nuxt configuration describe light/dark. The draft now requires visual comparison and browser checks, which is good, but it still has no authoritative visual reference or resolved theme baseline.

**Action:** reconcile the DS source of truth before UX stories, then bind desktop/mobile comparative screenshots and spatial/a11y evidence to the selected baseline.

### H-11 — Provenance and content-trust requirements are assertions without an artifact

`FR-2` now asks for primary sources, versions, environments, licenses, trust, and attribution, and `FR-3` adds an immutable publication date and a Git correction note. These are valuable improvements, but the PRD does not define the source/provenance format, a reviewer, a broken-source policy, a public correction surface, or how private/copyrighted evidence is represented. A prose instruction can still be ignored by a template.

**Action:** add a small provenance/trust contract and a correction-note format, with acceptance checks for missing sources, stale versions, unlicensed code/screenshots, broken links, and private references.

### H-12 — The homepage “featured editorial” delta is an unowned feature

The new brownfield table says `/` may gain an “éventuel featured éditorial,” but no FR defines selection, fallback, visibility, or non-regression behavior. `FR-4` requires “contenus fondamentaux” and selections by pillar without a selection policy; `featured` remains optional and its visibility is unresolved. This is hidden scope on a route that already feeds the homepage from the blog.

**Action:** either remove the featured delta from this PRD or define its owner, source of truth, empty-corpus behavior, and exact acceptance criteria before changing homepage behavior.

## Medium findings

### M-01 — Qualitative success signals lack a measurement contract

`SM-5` through `SM-9` and the counter-metrics have no data dictionary, denominator, time window, owner, sampling method, or privacy boundary. “Number, diversity, and depth” can incentivize volume even without a target. The no-invented-metrics rule is correct; it does not make a qualitative signal measurable.

**Action:** define what is observed, how it is recorded, and which decision it changes. Do not invent a threshold to fill the gap.

### M-02 — Correction and slug lifecycle remains only partially specified

The draft now makes the original date immutable, adds a Git correction note, and keeps published slugs stable for the first release. It still lacks a public correction history, a rule for what qualifies as substantial, a correction/takedown owner, and a later slug migration/redirect policy.

**Action:** define the minimum public correction record and migration decision before the first release.

### M-03 — Personas and qualified-reader hypotheses are still unvalidated

The journeys are explicitly provisional and the descriptions now say they must be confronted with real reading sessions. That is honest, but no session plan, sample, reviewer, or decision rule exists. Machine readers are included in the same audience model, which risks confusing human technical credibility with agent traffic.

**Action:** keep them as hypotheses and schedule lightweight validation after the first real article; do not use them to justify optional surfaces.

### M-04 — Optional fields and `goals` remain a hidden scope/ranking mechanism

`featured`, `evergreen`, `read`, `series`, and `archived` are deferred while the companion still models them. `goals` includes `business` and is internal by default, but no rule prevents it from influencing selection or CTA prominence beyond a prose guardrail. `series` is both a possible schema-only field and a P2 non-goal.

**Action:** decide the first schema’s exact fields and state that internal goals cannot change publication, related order, search priority, or prominence.

### M-05 — Accessibility evidence is improving but still not a complete blocking contract

The draft now names desktop 1280/mobile 375, breadcrumbs, return links, external-link labels, images, themes, forced contrast, and CTA privacy. It still does not explicitly bind keyboard order, `ZExternalLink` behavior in Markdown contexts, terminal dark sanctuarization, or a pass/fail evidence format to the story gate.

**Action:** incorporate the verification-plan checklist and record actual browser results, not just a planned check.

### M-06 — The trust/attribution policy has no owner or implementation boundary

The PRD now mentions raw HTML, remote images, links, code, licenses, and attribution, but does not say which are allowed, how they are reviewed, or how a broken external dependency is represented. This is especially relevant for technical reproductions and screenshots.

**Action:** add a minimal content trust policy and owner; do not build a heavy moderation system for the first slice.

### M-07 — Navigation and information architecture remain under-owned

The investigation says the blog is linked from homepage/footer but not the main header; the PRD still asks whether it belongs in primary navigation. Adding phase-2 hubs and an author surface can create duplicate entry points or competing navigation ownership.

**Action:** choose the minimal discovery surfaces and name their owner before UI stories.

### M-08 — Rollback and takedown are named but not operational

`NFR-12` mentions rollbacks in the Dev Agent Record, but there is no branch/checkpoint policy, schema rollback, route kill switch, content takedown procedure, or owner. A static deployment may require a rebuild and release rollback for a bad claim or leaked route.

**Action:** write a rollback/takedown runbook and make it part of the release gate.

### M-09 — Empty and failure states for new relations are incomplete

The draft specifies an empty `/blog` state but not the behavior for an empty hub, a project with no authorized articles, a missing image, a malformed external link, or a resolver failure. These states determine whether the product degrades honestly or emits broken trust signals.

**Action:** define fallback and error acceptance criteria for every optional relation.

### M-10 — Research and original-brief provenance remains incomplete

The addendum cites external pages but does not record retrieval dates, excerpts, or which observation is treated as evidence. The original brief is still conversational provenance and the PRD asks whether to version it. This weakens auditability of taxonomy, RSS, and authority decisions.

**Action:** preserve the brief and research evidence separately from normative decisions; label external observations as hypotheses rather than requirements.

## Low findings

### L-01 — Editorial copy is not implementation-clean

The PRD still contains mixed-language and typographical forms such as “Réalise,” “des tokens,” “publicly addressable,” and “recommendation IA.” These can leak into labels, analytics names, or acceptance criteria. Normalize them before story extraction.

### L-02 — Human labels and machine enum values are not mapped

The glossary uses labels such as `deep dive` and `lab note`, while the companion specifies `deep-dive` and `lab-note`. Keep one machine vocabulary and one presentation-label map so Zod, UI, AEO, and RSS cannot diverge.

### L-03 — The Fast path label still does not replace a scope decision

Fast path is now explicit in the PRD and addendum, but it is a process label rather than a capability-to-slice trace. Add a short mapping so “Fast path” cannot be used to justify expanding the first slice.

### L-04 — The risk table has no triggers, owners, deadlines, or evidence links

The table names leakage, route collision, Epic 14 churn, and canonical drift, but it reads as a disclaimer rather than an operational risk register. Link each risk to a decision, test, checkpoint, and owner.

## Decisions that must be deferred to `bmad-correct-course`

These should not be silently inferred by an implementation agent:

1. Epic 6 extension versus a new Epic; clean Epic 14 checkpoint; branch/worktree and reviewer ownership.
2. The committed first slice versus phase-2 hubs, author enrichment, project relations, related, RSS, analytics, and AEO extension.
3. `date` versus `publishedAt`, alias/divergence behavior, `updated`, Europe/Paris semantics, migration, and rollback.
4. Required fields, exact enums, labels, image shape, optional-field visibility, and migration of current Content/CI fixtures.
5. Draft/future/noindex/robots/sitemap/preview/direct-HTML behavior across every surface.
6. Project IDs, public projection, destination, and treatment of private/internal projects.
7. Related ordering/tie-breaks, invalid-target strictness, and pre-crawl filtering.
8. `/about` versus `/a-propos`, SEO overrides, canonical ownership, trailing slash, redirects, and production probes.
9. AEO field allow-list, Epic 14 reuse boundary, RSS inclusion/owner/path/MIME/discovery, and analytics scope.
10. Authority proof rubric, reviewer, first real article, audience feedback, correction governance, and provenance rules.
11. Theme/DS baseline, navigation owner, visual comparison references, and required a11y evidence.
12. Migration compatibility, content takedown, rollback, deployment probes, and the exact blocking Definition of Done.

## What is directionally sound and should be preserved

- The hierarchy **technical authority > qualified audience > commercial support** is explicit and aligned with the user’s stated priority.
- The draft does not invent traffic, ranking, citation, ROI, or conversion targets and explicitly distinguishes structural limits from performance promises.
- It rejects generated filler, fake fixtures as production content, CMS/search/newsletter scope, duplicate SEO/AEO ownership, and ranking promises.
- It now recognizes the brownfield baseline, the empty corpus, the need to isolate Epic 14, the direct-route risk, the crawler risk, and the need for one resolver.
- It now includes useful guardrails for source/attribution, trust, immutable publication dates, proof-before-CTA, phase labels, visibility baselines, and layered validation bundles.
- It still correctly leaves the original brief, project destination, direct access, related strictness, RSS contract, canonical policy, and planning integration visible as decisions rather than pretending they are complete.

## Approval gate before story creation

1. Run `bmad-correct-course`; choose the planning unit, Epic 14 checkpoint, and one committed first slice.
2. Ratify the date, frontmatter, publication, preview, project, related, SEO/canonical, AEO, RSS, and analytics decisions in the authoritative SPEC/decision log.
3. Attach executable resolver/migration, state-by-surface visibility, field-level AEO, privacy/redaction, and provenance contracts.
4. Add the authority rubric, reviewer, first-real-article plan, and correction/takedown governance.
5. Make static assertions, browser/a11y evidence, and production probes executable, owned, and separately blocking.
6. Reconcile the theme/design baseline and planning artifacts before UX or SEO stories.
7. Re-review the resulting PRD/SPEC pair. Until then: **draft, blocked, no implementation stories**.

## Bottom line

The PRD has the right editorial instinct and is becoming a better brownfield plan, but it still combines a narrow proof-first slice with a broad platform roadmap and treats several safety-critical choices as provisional defaults. The safe product move is narrower: prove the authority loop with one real, privacy-reviewed article and a trustworthy public reading path; reuse existing SEO/AEO owners; defer hubs, project relations, RSS, analytics, and optional taxonomy until a `bmad-correct-course` decision and evidence justify them.

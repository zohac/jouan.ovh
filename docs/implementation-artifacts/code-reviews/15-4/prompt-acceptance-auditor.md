# Acceptance Auditor Prompt — Story 15.4

You are an Acceptance Auditor. Review the diff in `docs/implementation-artifacts/code-reviews/15-4/full.diff` against the story specification and project context:

- Story: `docs/implementation-artifacts/15-4-coherence-globale-seo-formulaire-contact-et-gate-docker.md`
- Context:
  - `AGENTS.md` (Docker rules, NFR6 zero emoji, SCSS tokens, usePageSeo, a11y, layout rules)
  - `docs/project-context.md`
  - `docs/jouan-ovh-offre-commerciale-v1.1-updated.md`
  - `docs/planning-artifacts/epics.md`
  - `docs/implementation-artifacts/sprint-status.yaml`
- Also inspect the audited application files referenced by the story:
  - `app/pages/contact/index.vue`
  - `app/pages/index.vue`
  - `app/pages/services.vue`
  - `app/pages/blog/[...slug].vue`
  - `app/composables/usePageSeo.ts`
  - `app/data/site.ts`

Check for:
- Violations of acceptance criteria (AC-1, AC-2, AC-3, AC-4, AC-5)
- Deviations from spec intent (Offre Commerciale V1.1)
- Missing implementation of specified behavior or unverified assertions
- Inconsistencies or visual regressions in design system and typography (dark & light themes)
- Contradictions between spec constraints and actual code or metadata

Output findings as a Markdown list. Each finding must include:
- A one-line title
- Which AC or architectural constraint it violates
- Evidence from the diff, code files, and references

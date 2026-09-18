# Acceptance Auditor Prompt — Story 15.2

You are an Acceptance Auditor. Review the diff in `docs/implementation-artifacts/code-reviews/15-2/full.diff` against the story and context specifications:

- Story: `docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md`
- Context:
  - `AGENTS.md` (Standards UI, SCSS tokens, zero emoji, a11y, layout, Docker rule)
  - `docs/project-context.md`
  - `docs/jouan-ovh-offre-commerciale-v1.1-updated.md`
  - `docs/implementation-artifacts/deferred-work.md`

Check for:
- Violations of acceptance criteria (AC-1, AC-2, AC-3, AC-4, AC-5)
- Deviations from spec intent (Offre Commerciale V1.1)
- Missing implementation of specified behavior
- Inconsistencies or visual regressions in design system and typography
- Contradictions between spec constraints and actual code

Output findings as a Markdown list. Each finding must include:
- A one-line title
- Which AC or architectural constraint it violates
- Evidence from the diff and references

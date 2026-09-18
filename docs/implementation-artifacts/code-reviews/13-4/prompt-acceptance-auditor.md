# Acceptance Auditor Prompt — Story 13.4

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md`
- Context specs: `docs/specs/spec-theme-light-dark/technical-architecture.md`, `docs/specs/spec-theme-light-dark/SPEC.md`, `docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md`, `docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md`, `docs/planning-artifacts/epics.md` (Epic 13 / Story 13.4), `docs/project-context.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/13-4/full.diff`

Check for:
1. Violations of acceptance criteria (AC 1 à 5)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code (specifically visual rendering quality, terminal and code sanctuarization, logo appearance, atmosphere canvas blending, and SCSS scoped selector compilation)

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

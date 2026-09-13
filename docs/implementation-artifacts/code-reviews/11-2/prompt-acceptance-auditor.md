# Acceptance Auditor Prompt — Story 11.2

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md`
- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.2), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/11-2/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

# Acceptance Auditor Prompt — Epic 11

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/specs/spec-home-awwwards/SPEC.md`
- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Stories 11.1 à 11.6), `docs/project-context.md`, `docs/implementation-artifacts/deferred-work.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/epic-11/full.diff`

Check for:
1. Violations of acceptance criteria (AC) across Epic 11 stories (11.1 to 11.6) and SPEC.md capabilities (CAP-1 to CAP-10)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

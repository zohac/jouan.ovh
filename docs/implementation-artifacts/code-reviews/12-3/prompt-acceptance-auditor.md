# Acceptance Auditor Prompt — Story 12.3

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md`
- Context specs: `docs/specs/spec-repositionnement-ia/SPEC.md`, `docs/specs/spec-repositionnement-ia/messaging-matrix.md`, `docs/specs/spec-repositionnement-ia/services-and-pricing.md`, `docs/planning-artifacts/epics.md` (Epic 12 / Story 12.3), `docs/project-context.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/12-3/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

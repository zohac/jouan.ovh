# Edge Case Hunter Prompt — Story 15.1

Invoke the `bmad-review-edge-case-hunter` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/15-1/full.diff`

Goal: Walk every branching path and boundary condition in content, report only unhandled edge cases.
Method: Exhaustive path enumeration — mechanically walk every code path and identify what can break.
Output format: Output findings as a JSON array of objects with fields:
- `location`: file and line reference
- `trigger_condition`: exact condition triggering the edge case
- `guard_snippet`: suggested code guard
- `potential_consequence`: what happens when triggered
Output raw JSON only.

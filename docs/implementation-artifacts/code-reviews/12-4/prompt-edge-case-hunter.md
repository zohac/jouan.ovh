# Edge Case Hunter Prompt — Story 12.4

Invoke the `bmad-review-edge-case-hunter` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/12-4/full.diff`

Goal: Walk every branching path and boundary condition in content, report only unhandled edge cases.
Method: Exhaustive path enumeration — mechanically walk every branch, report ONLY paths and conditions that lack handling. Discard handled ones silently. Do NOT editorialize or add filler. Do not assign severity labels, rankings, or priority levels.

Return ONLY a valid JSON array of objects. Each edge-case finding contains exactly these four fields:
[
  {
    "location": "file:start-end (or file:line)",
    "trigger_condition": "one-line description (max 15 words)",
    "guard_snippet": "minimal code sketch that closes the gap (single-line escaped string)",
    "potential_consequence": "what could actually go wrong (max 15 words)"
  }
]

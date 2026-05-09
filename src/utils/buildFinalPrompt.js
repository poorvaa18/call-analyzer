export function buildFinalPrompt(acceptedAnalyzers, inputs) {
  const analyzerBlocks = acceptedAnalyzers
    .map((a) => {
      const schema = {
        id: a.id,
        name: a.name,
        description: a.description,
        purpose: a.purpose,
        analysis_criteria: a.analysis_criteria,
        analysis_workflow: a.analysis_workflow,
        output_format: a.output_format,
        example_output: a.example_output,
      }
      return `--- Analyzer ${a.id}: ${a.name} ---\n${JSON.stringify(schema, null, 2)}`
    })
    .join('\n\n')

  const contextSection = [
    inputs.agentPrompt
      ? `=== AGENT CONTEXT ===\n${inputs.agentPrompt.trim()}`
      : null,
    inputs.businessGoal
      ? `=== BUSINESS GOAL ===\n${inputs.businessGoal.trim()}`
      : null,
  ]
    .filter(Boolean)
    .join('\n\n')

  return `You are an AI call quality analyst. Your job is to analyze a call transcript using the structured analyzers defined below.

For each analyzer:
1. Follow its analysis_workflow step by step.
2. Apply its analysis_criteria to the transcript.
3. Return output as a FLAT JSON object matching exactly the fields in output_format.
   - No nested objects. All fields must be at the root level.
   - Use the example_output as a reference for field types and format.

${contextSection ? contextSection + '\n\n' : ''}=== ANALYZERS ===

${analyzerBlocks}

=== TRANSCRIPT TO ANALYZE ===
[Paste the call transcript here]

=== OUTPUT FORMAT ===
Return a single JSON object where each key is the analyzer name and each value is the flat output object:

{
  "${acceptedAnalyzers[0]?.name ?? 'Analyzer Name'}": {
    // flat JSON matching that analyzer's output_format
  }${acceptedAnalyzers.length > 1 ? `,\n  // ... one entry per analyzer` : ''}
}

Important:
- Analyze the transcript objectively using only what is explicitly stated or clearly implied.
- Do not fabricate information not present in the transcript.
- Every output_format field must be present in your response, even if the value is null or empty string.
- All example_output values show the expected data types — match them exactly.`
}

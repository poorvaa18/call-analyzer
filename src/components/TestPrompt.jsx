import { useState } from 'react'

export default function TestPrompt({ generatedPrompt, onBack }) {
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  async function handleRun() {
    setError('')
    setLoading(true)
    try {
      const filledPrompt = generatedPrompt.replace('[Paste the call transcript here]', transcript.trim())
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: filledPrompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResults(data)
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (results) {
    return (
      <Results
        results={results}
        onRunAgain={() => { setResults(null); setTranscript('') }}
        onBack={() => setResults(null)}
      />
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Paste a call transcript to test
        </label>
        <textarea
          rows={14}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder={"Bot: Hi, how can I help you today?\nUser: I want to cancel my subscription.\nBot: I'm sorry to hear that. Can I ask why?\nUser: Just transfer me to an agent..."}
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-y transition font-mono"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="py-2.5 px-5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={handleRun}
          disabled={!transcript.trim() || loading}
          className="flex-1 py-2.5 px-5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Analyzing…
            </>
          ) : (
            'Run Analysis'
          )}
        </button>
      </div>
    </div>
  )
}

const NEGATIVE_KEYS = ['transfer_occurred', 'failure_detected', 'escalation_requested', 'abandoned', 'human_intervention_occurred', 'frustration_detected', 'intent_shift_detected', 'effort_complaint_detected', 'prior_contact_referenced', 'followup_required']
const POSITIVE_KEYS = ['resolution_confirmed_by_user', 'question_answered', 'consent_obtained', 'had_natural_closing']

function valueColor(key, value) {
  if (typeof value === 'boolean') {
    if (NEGATIVE_KEYS.some((k) => key.includes(k)) && value === true) return 'text-red-600 font-semibold'
    if (POSITIVE_KEYS.some((k) => key.includes(k)) && value === true) return 'text-green-600 font-semibold'
    if (value === false && NEGATIVE_KEYS.some((k) => key.includes(k))) return 'text-green-600'
  }
  if (typeof value === 'number' && (key.includes('score') || key.includes('severity'))) {
    if (value >= 7) return 'text-red-600 font-semibold'
    if (value >= 4) return 'text-yellow-600 font-semibold'
    return 'text-green-600 font-semibold'
  }
  return 'text-gray-800'
}

function Results({ results, onRunAgain, onBack }) {
  function handleExport() {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analyzer-results.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800 font-medium">
        Analysis complete — {Object.keys(results).length} analyzer{Object.keys(results).length > 1 ? 's' : ''} ran
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {Object.entries(results).map(([analyzerName, fields]) => (
          <div key={analyzerName} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-800">{analyzerName}</p>
            </div>
            <div className="divide-y divide-gray-100">
              {Object.entries(fields).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start px-4 py-2 gap-4">
                  <span className="text-xs text-gray-500 font-mono shrink-0">{key}</span>
                  <span className={`text-xs font-mono text-right break-all ${valueColor(key, value)}`}>
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="py-2.5 px-5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
          Back
        </button>
        <button onClick={handleExport} className="flex items-center gap-2 py-2.5 px-5 rounded-lg border border-indigo-300 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition">
          Export JSON
        </button>
        <button onClick={onRunAgain} className="ml-auto py-2.5 px-5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
          Test Another
        </button>
      </div>
    </div>
  )
}

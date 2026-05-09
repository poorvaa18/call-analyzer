export default function AnalyzerSelection({ analyzers, accepted, onToggle, onGenerate, onBack }) {
  const acceptedCount = accepted.size
  const maxScore = analyzers[0]?.score ?? 0

  function relevanceLabel(score) {
    if (maxScore === 0) return null
    const pct = score / maxScore
    if (pct >= 0.7) return { label: 'High match', color: 'bg-green-100 text-green-700' }
    if (pct >= 0.35) return { label: 'Good match', color: 'bg-yellow-100 text-yellow-700' }
    return null
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Top matches pre-selected based on your inputs.
          <span className="ml-1 font-medium text-indigo-600">{acceptedCount} selected</span>
        </p>
        <div className="flex gap-2 text-xs text-gray-400">
          <button
            onClick={() => analyzers.forEach((a) => onToggle(a.id, true))}
            className="hover:text-indigo-600 underline transition"
          >
            Select all
          </button>
          <span>·</span>
          <button
            onClick={() => analyzers.forEach((a) => onToggle(a.id, false))}
            className="hover:text-indigo-600 underline transition"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid gap-2.5 max-h-[520px] overflow-y-auto pr-1">
        {analyzers.map((analyzer) => {
          const isAccepted = accepted.has(analyzer.id)
          const badge = relevanceLabel(analyzer.score)
          return (
            <label
              key={analyzer.id}
              className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isAccepted
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={isAccepted}
                onChange={(e) => onToggle(analyzer.id, e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-indigo-600 cursor-pointer shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-semibold ${isAccepted ? 'text-indigo-800' : 'text-gray-800'}`}>
                    {analyzer.name}
                  </p>
                  {badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{analyzer.description}</p>
                {isAccepted && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.keys(analyzer.output_format).map((field) => (
                      <span
                        key={field}
                        className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-mono"
                      >
                        {analyzer.output_format[field].split(':')[0].replace(/"/g, '').trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </label>
          )
        })}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="py-2.5 px-5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={onGenerate}
          disabled={acceptedCount === 0}
          className="flex-1 py-2.5 px-5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Generate Final Prompt {acceptedCount > 0 ? `(${acceptedCount} analyzer${acceptedCount > 1 ? 's' : ''})` : ''}
        </button>
      </div>
    </div>
  )
}

export default function PhaseIndicator({ phase }) {
  const steps = [
    { num: 1, label: 'Input' },
    { num: 2, label: 'Select Analyzers' },
    { num: 3, label: 'Final Prompt' },
    { num: 4, label: 'Test' },
  ]

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                phase === step.num
                  ? 'bg-indigo-600 text-white'
                  : phase > step.num
                  ? 'bg-indigo-200 text-indigo-700'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {phase > step.num ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                phase === step.num ? 'text-indigo-700' : phase > step.num ? 'text-indigo-400' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-3 ${phase > step.num ? 'bg-indigo-300' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

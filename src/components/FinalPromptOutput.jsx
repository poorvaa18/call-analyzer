import { useState } from 'react'

export default function FinalPromptOutput({ prompt, acceptedCount, onBack, onReset, onTest }) {
  const [editedPrompt, setEditedPrompt] = useState(prompt)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(editedPrompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleDownload() {
    const blob = new Blob([editedPrompt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'call-analyzer-prompt.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-green-800">
            Prompt generated with {acceptedCount} analyzer{acceptedCount > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-green-600 mt-0.5">
            You can edit the prompt below before testing or copying.
          </p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={editedPrompt}
          onChange={(e) => setEditedPrompt(e.target.value)}
          rows={22}
          spellCheck={false}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-xs font-mono text-gray-700 bg-gray-50 resize-y focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition leading-relaxed"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              copied
                ? 'bg-green-100 text-green-700'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="py-2.5 px-5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 py-2.5 px-5 rounded-lg border border-indigo-300 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition"
        >
          Download .txt
        </button>
        <button
          onClick={() => onTest(editedPrompt)}
          className="flex-1 py-2.5 px-5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
        >
          Test This Prompt
        </button>
        <button
          onClick={onReset}
          className="py-2.5 px-5 rounded-lg bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}

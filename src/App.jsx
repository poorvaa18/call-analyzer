import { useState, useRef } from 'react'
import PhaseIndicator from './components/PhaseIndicator'
import InputForm from './components/InputForm'
import AnalyzerSelection from './components/AnalyzerSelection'
import FinalPromptOutput from './components/FinalPromptOutput'
import TestPrompt from './components/TestPrompt'
import { suggestAnalyzers, getDefaultAccepted } from './utils/suggestAnalyzers'
import { buildFinalPrompt } from './utils/buildFinalPrompt'

const initialInputs = { agentPrompt: '', businessGoal: '', transcripts: '' }

export default function App() {
  const [phase, setPhase] = useState(1)
  const [inputs, setInputs] = useState(initialInputs)
  const [suggested, setSuggested] = useState([])
  const [accepted, setAccepted] = useState(new Set())
  const [finalPrompt, setFinalPrompt] = useState('')
  const [testPrompt, setTestPrompt] = useState('')
  const cachedInputsRef = useRef(null)

  function handleInputChange(field, value) {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  function inputsChanged() {
    const cached = cachedInputsRef.current
    if (!cached) return true
    return (
      cached.agentPrompt !== inputs.agentPrompt ||
      cached.businessGoal !== inputs.businessGoal ||
      cached.transcripts !== inputs.transcripts
    )
  }

  function handleGenerateAnalyzers() {
    if (suggested.length > 0 && !inputsChanged()) {
      // Inputs unchanged — reuse cached analyzers, preserve user's checkbox state
      setPhase(2)
      return
    }
    const all = suggestAnalyzers(inputs)
    setSuggested(all)
    setAccepted(getDefaultAccepted(all))
    cachedInputsRef.current = { ...inputs }
    setPhase(2)
  }

  function handleToggle(id, checked) {
    setAccepted((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function handleGeneratePrompt() {
    const acceptedAnalyzers = suggested.filter((a) => accepted.has(a.id))
    const prompt = buildFinalPrompt(acceptedAnalyzers, inputs)
    setFinalPrompt(prompt)
    setPhase(3)
  }

  function handleReset() {
    setPhase(1)
    setInputs(initialInputs)
    setSuggested([])
    setAccepted(new Set())
    setFinalPrompt('')
    cachedInputsRef.current = null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            AI Call Analyzer Builder
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Generate structured analysis prompts for your AI agent calls
          </p>
        </div>

        <PhaseIndicator phase={phase} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {phase === 1 && (
            <InputForm
              inputs={inputs}
              onChange={handleInputChange}
              onSubmit={handleGenerateAnalyzers}
            />
          )}

          {phase === 2 && (
            <AnalyzerSelection
              analyzers={suggested}
              accepted={accepted}
              onToggle={handleToggle}
              onGenerate={handleGeneratePrompt}
              onBack={() => setPhase(1)}
            />
          )}

          {phase === 3 && (
            <FinalPromptOutput
              prompt={finalPrompt}
              acceptedCount={accepted.size}
              onBack={() => setPhase(2)}
              onReset={handleReset}
              onTest={(edited) => { setTestPrompt(edited); setPhase(4) }}
            />
          )}

          {phase === 4 && (
            <TestPrompt
              generatedPrompt={testPrompt}
              onBack={() => setPhase(3)}
            />
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Transcripts are sent to Anthropic only during testing · Nothing else is stored
        </p>
      </div>
    </div>
  )
}

export default function InputForm({ inputs, onChange, onSubmit }) {
  const { agentPrompt, businessGoal, transcripts } = inputs
  const canSubmit = agentPrompt.trim() || businessGoal.trim()

  return (
    <div className="space-y-5" autoComplete="off">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Agent Prompt
          <span className="ml-1 font-normal text-gray-400">(paste your bot's system prompt)</span>
        </label>
        <textarea
          rows={6}
          value={agentPrompt}
          onChange={(e) => onChange('agentPrompt', e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="You are a customer service agent for Acme Corp. Your job is to help customers with billing questions, account management, and technical support..."
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-y transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Business Goal
          <span className="ml-1 font-normal text-gray-400">(what should the bot achieve?)</span>
        </label>
        <textarea
          rows={3}
          value={businessGoal}
          onChange={(e) => onChange('businessGoal', e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="Reduce human agent transfers by 40%. Resolve billing disputes and account queries without escalation. Track customer satisfaction and containment rate."
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-y transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Sample Transcripts
          <span className="ml-1 font-normal text-gray-400">(optional — helps tailor suggestions)</span>
        </label>
        <textarea
          rows={6}
          value={transcripts}
          onChange={(e) => onChange('transcripts', e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="Bot: Hi, how can I help you today?&#10;User: I want to cancel my subscription.&#10;Bot: I'm sorry to hear that. Can I ask why you'd like to cancel?&#10;User: Just transfer me to an agent..."
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-y transition"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Generate Analyzers
      </button>
    </div>
  )
}

import { analyzerCatalog } from './analyzerCatalog'

// --- Industry / domain detection ---
const industryProfiles = [
  {
    name: 'ecommerce',
    signals: ['order', 'delivery', 'shipping', 'return', 'refund', 'product', 'cart', 'purchase', 'track', 'package', 'store', 'item', 'checkout'],
    topAnalyzers: [5, 3, 9, 4, 13, 15], // Resolution, Common Qs, Intent, Sentiment, User Effort, FCR
  },
  {
    name: 'banking_finance',
    signals: ['bank', 'account', 'loan', 'mortgage', 'credit', 'debit', 'transaction', 'balance', 'fund', 'invest', 'financial', 'payment', 'transfer funds'],
    topAnalyzers: [8, 15, 5, 3, 9, 4], // Compliance, FCR, Resolution, Common Qs, Intent, Sentiment
  },
  {
    name: 'healthcare',
    signals: ['patient', 'doctor', 'appointment', 'clinic', 'hospital', 'prescription', 'medication', 'symptom', 'health', 'medical', 'insurance claim', 'diagnosis'],
    topAnalyzers: [8, 4, 5, 15, 3, 13], // Compliance, Sentiment, Resolution, FCR, Common Qs, User Effort
  },
  {
    name: 'telecom',
    signals: ['plan', 'data', 'network', 'signal', 'sim', 'roaming', 'internet', 'broadband', 'mobile', 'recharge', 'prepaid', 'postpaid', 'telecom'],
    topAnalyzers: [5, 11, 3, 12, 9, 4], // Resolution, Containment, Common Qs, Efficiency, Intent, Sentiment
  },
  {
    name: 'saas_tech',
    signals: ['software', 'app', 'feature', 'bug', 'integration', 'api', 'dashboard', 'account setup', 'onboard', 'login', 'password', 'subscription', 'saas', 'platform'],
    topAnalyzers: [2, 5, 10, 13, 3, 12], // Bot Failure, Resolution, Response Quality, User Effort, Common Qs, Efficiency
  },
  {
    name: 'insurance',
    signals: ['policy', 'claim', 'coverage', 'premium', 'insur', 'deductible', 'beneficiary', 'renewal', 'accident', 'damage'],
    topAnalyzers: [8, 15, 5, 3, 9, 4], // Compliance, FCR, Resolution, Common Qs, Intent, Sentiment
  },
  {
    name: 'food_delivery',
    signals: ['food', 'restaurant', 'meal', 'order food', 'deliver food', 'menu', 'cuisine', 'rider', 'chef'],
    topAnalyzers: [5, 4, 3, 13, 7, 9], // Resolution, Sentiment, Common Qs, User Effort, Abandonment, Intent
  },
  {
    name: 'hr_internal',
    signals: ['employee', 'hr', 'payroll', 'leave', 'onboarding', 'policy', 'benefit', 'salary', 'attendance', 'resignation', 'internal'],
    topAnalyzers: [8, 3, 9, 5, 12, 15], // Compliance, Common Qs, Intent, Resolution, Efficiency, FCR
  },
  {
    name: 'travel',
    signals: ['flight', 'hotel', 'booking', 'reservation', 'ticket', 'trip', 'travel', 'itinerary', 'cancel booking', 'check-in', 'luggage'],
    topAnalyzers: [5, 3, 4, 15, 9, 13], // Resolution, Common Qs, Sentiment, FCR, Intent, User Effort
  },
  {
    name: 'retail_support',
    signals: ['warranty', 'complaint', 'exchange', 'store', 'customer service', 'service request', 'after sales'],
    topAnalyzers: [4, 5, 6, 13, 3, 15], // Sentiment, Resolution, Escalation, User Effort, Common Qs, FCR
  },
]

// --- Business goal intent mapping ---
// Read the business goal and map what the business cares about to analyzer ids
const goalIntentProfiles = [
  {
    // Business wants to understand WHY customers are calling
    intent: 'understand_call_drivers',
    signals: ['why', 'understand', 'identify reason', 'find out', 'what are', 'common topics', 'call reason', 'call driver', 'what do customer'],
    topAnalyzers: [3, 9, 12, 2], // Common Qs, Intent, Efficiency, Bot Failure
  },
  {
    // Business wants to improve customer experience / satisfaction
    intent: 'improve_cx',
    signals: ['satisfaction', 'experience', 'csat', 'nps', 'happy', 'delight', 'frustrat', 'improve experience', 'customer effort', 'ease'],
    topAnalyzers: [4, 13, 5, 10], // Sentiment, User Effort, Resolution, Response Quality
  },
  {
    // Business wants to measure and improve resolution
    intent: 'improve_resolution',
    signals: ['resolv', 'fix', 'solve', 'first call', 'fcr', 'close', 'complete', 'success rate', 'handle'],
    topAnalyzers: [5, 15, 2, 10], // Resolution Rate, FCR, Bot Failure, Response Quality
  },
  {
    // Business wants to reduce costs / improve automation
    intent: 'reduce_cost_automate',
    signals: ['cost', 'automat', 'contain', 'deflect', 'self-serv', 'reduce call', 'efficiency', 'aht', 'handle time', 'bot rate', 'human intervention'],
    topAnalyzers: [11, 12, 2, 7], // Containment, Efficiency, Bot Failure, Abandonment
  },
  {
    // Business wants to drive revenue / upsell
    intent: 'revenue_growth',
    signals: ['revenue', 'upsell', 'cross-sell', 'convert', 'sale', 'upgrade', 'offer', 'monetize', 'lead'],
    topAnalyzers: [14, 9, 4, 5], // Upsell, Intent, Sentiment, Resolution
  },
  {
    // Business wants compliance / audit trail
    intent: 'compliance',
    signals: ['complian', 'audit', 'legal', 'regulat', 'disclosure', 'script', 'mandator', 'gdpr', 'hipaa', 'consent'],
    topAnalyzers: [8, 15, 5, 9], // Compliance, FCR, Resolution, Intent
  },
  {
    // Business wants to measure bot quality / performance
    intent: 'bot_quality',
    signals: ['quality', 'performance', 'how well', 'bot doing', 'measure bot', 'accuracy', 'response quality', 'improve bot', 'failure'],
    topAnalyzers: [2, 10, 13, 12], // Bot Failure, Response Quality, User Effort, Efficiency
  },
  {
    // Business wants to improve routing / reduce misdirects
    intent: 'routing',
    signals: ['routing', 'right agent', 'misroute', 'wrong department', 'route', 'direct'],
    topAnalyzers: [9, 1, 6, 11], // Intent, Transfer, Escalation, Containment
  },
]

// --- What the bot is designed to DO (agent prompt task analysis) ---
const taskProfiles = [
  {
    name: 'faq_info',
    signals: ['answer question', 'provide information', 'tell customer', 'inform', 'knowledge base', 'faq', 'explain'],
    topAnalyzers: [3, 9, 10, 5], // Common Qs, Intent, Response Quality, Resolution
  },
  {
    name: 'transactional',
    signals: ['book', 'schedule', 'cancel', 'update', 'change', 'place order', 'process', 'submit', 'modify', 'renew'],
    topAnalyzers: [5, 15, 13, 12], // Resolution, FCR, User Effort, Efficiency
  },
  {
    name: 'complaint_handling',
    signals: ['complaint', 'dissatisf', 'issue', 'problem', 'dispute', 'unhappy', 'wrong', 'error', 'mistake'],
    topAnalyzers: [4, 6, 5, 13], // Sentiment, Escalation, Resolution, User Effort
  },
  {
    name: 'sales_assist',
    signals: ['recommend', 'suggest', 'best plan', 'best product', 'help choose', 'compare', 'sell', 'pitch'],
    topAnalyzers: [14, 4, 9, 5], // Upsell, Sentiment, Intent, Resolution
  },
  {
    name: 'authentication_account',
    signals: ['verify', 'authenticate', 'login', 'reset password', 'account access', 'identity', 'otp', 'security'],
    topAnalyzers: [5, 13, 12, 2], // Resolution, User Effort, Efficiency, Bot Failure
  },
]

function detectContext(text) {
  const lower = text.toLowerCase()

  const industryScores = industryProfiles.map((p) => ({
    profile: p,
    score: p.signals.filter((s) => lower.includes(s)).length,
  }))
  industryScores.sort((a, b) => b.score - a.score)
  const topIndustry = industryScores[0].score > 0 ? industryScores[0].profile : null

  const goalScores = goalIntentProfiles.map((p) => ({
    profile: p,
    score: p.signals.filter((s) => lower.includes(s)).length,
  }))
  goalScores.sort((a, b) => b.score - a.score)
  const topGoal = goalScores[0].score > 0 ? goalScores[0].profile : null

  const taskScores = taskProfiles.map((p) => ({
    profile: p,
    score: p.signals.filter((s) => lower.includes(s)).length,
  }))
  taskScores.sort((a, b) => b.score - a.score)
  const topTask = taskScores[0].score > 0 ? taskScores[0].profile : null

  return { topIndustry, topGoal, topTask }
}

export function suggestAnalyzers(inputs) {
  const { agentPrompt, businessGoal, transcripts } = inputs
  const allText = `${agentPrompt} ${businessGoal} ${transcripts}`
  const promptText = `${agentPrompt} ${businessGoal}` // weight prompt+goal more than transcripts

  const { topIndustry, topGoal, topTask } = detectContext(allText)

  // Build a score map: analyzerId → score
  const scoreMap = {}
  analyzerCatalog.forEach((a) => { scoreMap[a.id] = 0 })

  // Industry profile boosts (strongest signal — +5 for top picks)
  if (topIndustry) {
    topIndustry.topAnalyzers.forEach((id, rank) => {
      scoreMap[id] = (scoreMap[id] || 0) + Math.max(5 - rank, 1)
    })
  }

  // Business goal boosts (+4 for top picks)
  if (topGoal) {
    topGoal.topAnalyzers.forEach((id, rank) => {
      scoreMap[id] = (scoreMap[id] || 0) + Math.max(4 - rank, 1)
    })
  }

  // Task profile boosts (+3 for top picks)
  if (topTask) {
    topTask.topAnalyzers.forEach((id, rank) => {
      scoreMap[id] = (scoreMap[id] || 0) + Math.max(3 - rank, 1)
    })
  }

  // Surface keyword scan as a weak signal (+1 per keyword hit, capped at +3)
  analyzerCatalog.forEach((analyzer) => {
    const keywordHits = analyzer.keywords.filter((kw) =>
      promptText.toLowerCase().includes(kw.toLowerCase())
    ).length
    scoreMap[analyzer.id] = (scoreMap[analyzer.id] || 0) + Math.min(keywordHits, 3)
  })

  const scored = analyzerCatalog
    .map((a) => ({ ...a, score: scoreMap[a.id] }))
    .sort((a, b) => b.score - a.score || a.id - b.id)

  return scored
}

export function getDefaultAccepted(scoredAnalyzers) {
  return new Set(scoredAnalyzers.slice(0, 8).map((a) => a.id))
}

export const analyzerCatalog = [
  {
    id: 1,
    name: "Transfer Rate Analyzer",
    description: "Detects when and why calls were transferred to a human agent.",
    keywords: ["transfer", "agent", "escalat", "handoff", "human", "live agent", "operator"],
    purpose: "Identifies all instances where the bot transferred the call to a human agent, capturing the reason, timing, and context of each transfer to help reduce unnecessary handoffs.",
    analysis_criteria: {
      detection_rules: "Look for phrases like 'transferring you', 'connecting to an agent', 'let me get someone', 'hold for an agent', or any intent that results in a human handoff.",
      logic: "1. Scan transcript for transfer trigger phrases. 2. Identify the user intent immediately before transfer. 3. Classify transfer reason (complexity, user request, bot failure, compliance). 4. Record timing and conversation stage.",
      segments_to_analyze: "Bot utterances indicating transfer, user utterances immediately preceding transfer, conversation turn count at point of transfer.",
      edge_cases: "Silent transfers (no announcement), failed transfer attempts, user-requested vs bot-initiated transfers, warm vs cold handoffs.",
      minimum_threshold: "At least one complete conversation turn before any transfer event."
    },
    analysis_workflow: {
      step_1: "Identify all transfer events in the transcript by scanning for transfer-related phrases and intents.",
      step_2: "For each transfer event, extract the 3 turns preceding it to understand the trigger context.",
      step_3: "Classify the transfer reason into one of: user_requested, bot_failure, complexity, compliance, other.",
      step_4: "Calculate the turn number and percentage through the conversation when transfer occurred.",
      step_5: "Determine if the transfer was avoidable based on whether the bot had capability to handle the intent."
    },
    output_format: {
      field_1: "transfer_occurred (boolean): Whether a transfer happened in this call",
      field_2: "transfer_reason (string): Classified reason for transfer",
      field_3: "transfer_trigger_phrase (string): Exact phrase that initiated transfer",
      field_4: "turns_before_transfer (number): Number of conversation turns before transfer",
      field_5: "avoidable (boolean): Whether the transfer could have been prevented"
    },
    example_output: {
      transfer_occurred: true,
      transfer_reason: "bot_failure",
      transfer_trigger_phrase: "I'm sorry, I'm not able to help with that. Let me connect you to an agent.",
      turns_before_transfer: 4,
      avoidable: true
    }
  },
  {
    id: 2,
    name: "Bot Failure Detection",
    description: "Identifies cases where the bot couldn't resolve the user's query.",
    keywords: ["can't help", "don't understand", "repeat", "loop", "fallback", "sorry", "unable", "cannot", "not sure", "didn't get that"],
    purpose: "Detects conversation patterns where the bot repeatedly fails to understand or resolve a user's intent, creating frustrating loops or dead ends that damage user experience.",
    analysis_criteria: {
      detection_rules: "Flag instances of repeated fallback responses, user rephrasing the same intent 2+ times, bot expressing inability to help, or conversation loops where the same topic recurs without resolution.",
      logic: "1. Count fallback/error responses from bot. 2. Detect repeated user intents (same topic across 2+ turns). 3. Identify dead-end responses with no actionable follow-up. 4. Score overall bot failure severity.",
      segments_to_analyze: "Bot fallback utterances, user repetition patterns, unresolved conversation branches, error states.",
      edge_cases: "Legitimate complexity vs bot failure, user providing incomplete info, multilingual confusion, background noise causing misrecognition.",
      minimum_threshold: "At least 2 bot turns to assess failure patterns."
    },
    analysis_workflow: {
      step_1: "Count the total number of fallback or 'didn't understand' responses from the bot.",
      step_2: "Identify any user intents that were stated more than once without resolution.",
      step_3: "Check if the conversation ended with the user's primary goal unresolved.",
      step_4: "Classify the failure type: comprehension failure, knowledge gap, capability gap, or system error.",
      step_5: "Calculate a failure severity score from 0-10 based on frequency and impact."
    },
    output_format: {
      field_1: "failure_detected (boolean): Whether a bot failure occurred",
      field_2: "failure_type (string): Type of failure detected",
      field_3: "fallback_count (number): Number of fallback responses in the call",
      field_4: "repeated_intent (string): The intent the user had to repeat, if any",
      field_5: "failure_severity (number): Severity score from 0 to 10"
    },
    example_output: {
      failure_detected: true,
      failure_type: "comprehension_failure",
      fallback_count: 3,
      repeated_intent: "cancel subscription",
      failure_severity: 7
    }
  },
  {
    id: 3,
    name: "Common Questions Extractor",
    description: "Extracts the most frequently asked questions or topics raised by callers.",
    keywords: ["faq", "question", "ask", "common", "frequent", "topic", "what is", "how do", "where is", "why"],
    purpose: "Systematically identifies and categorizes the primary questions and topics users bring to the bot, enabling teams to prioritize knowledge base improvements and training data.",
    analysis_criteria: {
      detection_rules: "Extract user utterances that are interrogative (contain question words: what, how, where, when, why, can I, do you) or that express an information-seeking intent.",
      logic: "1. Extract all user questions. 2. Identify the primary intent behind each question. 3. Group semantically similar questions. 4. Tag with topic category.",
      segments_to_analyze: "All user utterances, particularly those with question words or rising intonation markers.",
      edge_cases: "Implicit questions (statements that imply a question), multi-part questions, questions within complaints.",
      minimum_threshold: "At least one user utterance present."
    },
    analysis_workflow: {
      step_1: "Extract all user utterances from the transcript.",
      step_2: "Identify which utterances contain explicit or implicit questions.",
      step_3: "Classify each question by topic category (billing, technical, policy, account, product).",
      step_4: "Identify the single primary question that represents the call's main purpose.",
      step_5: "Assess whether the primary question was answered satisfactorily."
    },
    output_format: {
      field_1: "primary_question (string): The main question or topic the caller raised",
      field_2: "question_category (string): Category of the primary question",
      field_3: "total_questions_asked (number): Total number of distinct questions in the call",
      field_4: "question_answered (boolean): Whether the primary question was resolved",
      field_5: "secondary_topics (string): Comma-separated list of additional topics raised"
    },
    example_output: {
      primary_question: "How do I reset my password?",
      question_category: "account",
      total_questions_asked: 2,
      question_answered: true,
      secondary_topics: "account_locked, login_help"
    }
  },
  {
    id: 4,
    name: "Sentiment Analyzer",
    description: "Measures caller frustration and satisfaction signals throughout the call.",
    keywords: ["sentiment", "frustrat", "angry", "happy", "satisf", "emotion", "tone", "upset", "pleased", "dissatisf"],
    purpose: "Tracks the emotional arc of the caller throughout the conversation, identifying moments of frustration or satisfaction and how bot responses affect caller sentiment over time.",
    analysis_criteria: {
      detection_rules: "Identify emotionally charged language (profanity, intensifiers, ALL CAPS, exclamation marks), explicit sentiment expressions ('this is ridiculous', 'thank you so much'), and sentiment-indicating phrases.",
      logic: "1. Assign sentiment score per user turn (-2 to +2). 2. Track sentiment trajectory (improving/declining/stable). 3. Identify peak negative and positive moments. 4. Compute overall call sentiment.",
      segments_to_analyze: "All user utterances, especially those containing emotional language or explicit satisfaction/frustration signals.",
      edge_cases: "Sarcasm, polite complaints, cultural differences in expression, frustrated about external issues not related to bot.",
      minimum_threshold: "At least 2 user utterances to assess sentiment trend."
    },
    analysis_workflow: {
      step_1: "Score each user utterance from -2 (very negative) to +2 (very positive).",
      step_2: "Identify the utterance with the highest negative sentiment (peak frustration point).",
      step_3: "Identify the utterance with the highest positive sentiment (peak satisfaction point).",
      step_4: "Determine whether sentiment improved, declined, or stayed stable across the call.",
      step_5: "Compute the overall call sentiment as positive, neutral, or negative."
    },
    output_format: {
      field_1: "overall_sentiment (string): Overall sentiment as positive, neutral, or negative",
      field_2: "sentiment_trend (string): Whether sentiment improved, declined, or stayed stable",
      field_3: "peak_frustration_quote (string): The most negative user statement in the call",
      field_4: "frustration_detected (boolean): Whether significant frustration was detected",
      field_5: "satisfaction_expressed (boolean): Whether the caller expressed satisfaction"
    },
    example_output: {
      overall_sentiment: "negative",
      sentiment_trend: "declined",
      peak_frustration_quote: "I've been asking the same thing for 10 minutes and you keep giving me the same answer!",
      frustration_detected: true,
      satisfaction_expressed: false
    }
  },
  {
    id: 5,
    name: "Resolution Rate Tracker",
    description: "Tracks whether the caller's primary issue was fully resolved by the end of the call.",
    keywords: ["resolv", "fix", "solved", "success", "complet", "done", "finish", "outcome", "result", "close"],
    purpose: "Determines whether each call ended with the user's primary issue resolved, partially resolved, or unresolved — the most fundamental metric for measuring bot effectiveness.",
    analysis_criteria: {
      detection_rules: "Look for explicit resolution signals ('your issue has been resolved', 'done, is there anything else?') or user acknowledgment ('great, thanks', 'that worked'). Flag unresolved calls by absence of resolution signals or presence of frustration at call end.",
      logic: "1. Identify the user's primary intent at call start. 2. Check if that intent was addressed. 3. Look for closing confirmation. 4. Classify resolution status.",
      segments_to_analyze: "Opening user utterance (primary intent), closing bot utterance, final user response, any explicit resolution or confirmation phrases.",
      edge_cases: "User abandons call before resolution, partial resolution (issue partially addressed), user says thanks but issue not resolved, multiple issues where only one is resolved.",
      minimum_threshold: "Must have both an opening intent and a call ending to classify resolution."
    },
    analysis_workflow: {
      step_1: "Extract the user's primary intent from the first 1-3 turns.",
      step_2: "Scan the conversation for any direct response or action taken addressing that intent.",
      step_3: "Examine the final 3 turns for resolution confirmation or continued frustration.",
      step_4: "Classify resolution as: fully_resolved, partially_resolved, or unresolved.",
      step_5: "Identify the reason if the call was not fully resolved."
    },
    output_format: {
      field_1: "resolution_status (string): fully_resolved, partially_resolved, or unresolved",
      field_2: "primary_intent (string): The caller's main goal at the start of the call",
      field_3: "resolution_confirmed_by_user (boolean): Whether user explicitly confirmed resolution",
      field_4: "unresolved_reason (string): Reason issue was not resolved, if applicable",
      field_5: "resolution_turn (number): Turn number where resolution occurred, or -1 if unresolved"
    },
    example_output: {
      resolution_status: "fully_resolved",
      primary_intent: "check account balance",
      resolution_confirmed_by_user: true,
      unresolved_reason: "",
      resolution_turn: 5
    }
  },
  {
    id: 6,
    name: "Escalation Trigger Detector",
    description: "Finds the specific phrases or patterns that caused calls to escalate.",
    keywords: ["escalat", "supervisor", "manager", "complaint", "demand", "insist", "speak to", "higher up"],
    purpose: "Pinpoints the exact conversation moments and trigger phrases that lead users to demand escalation, helping teams understand and prevent unnecessary escalations.",
    analysis_criteria: {
      detection_rules: "Detect user demands to speak with a human ('let me speak to a manager', 'I want a real person'), explicit escalation requests, complaint language combined with bot failures, and repeated failed resolution attempts.",
      logic: "1. Find escalation demand utterances. 2. Analyze 3-5 turns preceding each demand. 3. Identify the triggering factor. 4. Classify escalation type.",
      segments_to_analyze: "User utterances containing escalation language, bot responses that immediately preceded escalation demands.",
      edge_cases: "Preemptive escalation requests (user always wants human), escalation after resolution (escalating a resolved issue), indirect escalation signals.",
      minimum_threshold: "At least one explicit escalation demand or strong implicit signal."
    },
    analysis_workflow: {
      step_1: "Scan for explicit escalation phrases ('speak to manager', 'real person', 'human agent').",
      step_2: "If no explicit phrase found, look for implicit signals (repeated frustration + resolution failure).",
      step_3: "Extract the bot's last response before the escalation trigger.",
      step_4: "Classify what caused escalation: bot_failure, emotional_response, policy_dispute, user_preference.",
      step_5: "Assess whether the escalation could have been prevented with a different bot response."
    },
    output_format: {
      field_1: "escalation_requested (boolean): Whether user requested escalation",
      field_2: "escalation_trigger_phrase (string): The exact phrase that signaled escalation",
      field_3: "escalation_cause (string): Root cause category of the escalation",
      field_4: "preceding_bot_response (string): The bot's response just before escalation was demanded",
      field_5: "preventable (boolean): Whether the escalation could have been prevented"
    },
    example_output: {
      escalation_requested: true,
      escalation_trigger_phrase: "I want to speak to a real person right now.",
      escalation_cause: "bot_failure",
      preceding_bot_response: "I'm sorry, I didn't quite catch that. Could you please repeat your request?",
      preventable: true
    }
  },
  {
    id: 7,
    name: "Call Abandonment Detector",
    description: "Detects when callers hung up before their issue was resolved.",
    keywords: ["drop", "abandon", "hung up", "disconnect", "hang up", "left", "ended", "quit", "gave up"],
    purpose: "Identifies calls where users abandoned the conversation before resolution, and the likely cause, to reduce abandonment rates and improve conversation completion.",
    analysis_criteria: {
      detection_rules: "Look for abrupt call endings without resolution confirmation, calls that end mid-flow (not at a natural closing), user silence followed by call end, or very short calls that didn't complete a primary intent.",
      logic: "1. Check if call ended with natural closing ('goodbye', 'is there anything else?'). 2. Check if primary intent was resolved. 3. If no natural close and no resolution, flag as abandoned. 4. Identify at what stage abandonment occurred.",
      segments_to_analyze: "Final 3-5 turns of the call, call duration relative to typical resolution, presence or absence of closing pleasantries.",
      edge_cases: "Technical disconnection vs intentional hang-up, very short calls (wrong number, immediate hang-up), calls that were completed but ended abruptly.",
      minimum_threshold: "At least one user utterance beyond greeting."
    },
    analysis_workflow: {
      step_1: "Check the final turn of the transcript for natural closing indicators.",
      step_2: "Assess whether the user's primary intent was resolved before the call ended.",
      step_3: "If no natural close and no resolution, classify as abandoned.",
      step_4: "Identify the call stage where abandonment occurred: greeting, intent_capture, resolution_attempt, or follow_up.",
      step_5: "Infer the most likely reason for abandonment based on conversation context."
    },
    output_format: {
      field_1: "abandoned (boolean): Whether the call was abandoned before resolution",
      field_2: "abandonment_stage (string): Stage of the call where abandonment occurred",
      field_3: "likely_abandonment_reason (string): Inferred reason for abandonment",
      field_4: "turns_completed (number): Number of turns completed before abandonment",
      field_5: "had_natural_closing (boolean): Whether the call had a proper closing exchange"
    },
    example_output: {
      abandoned: true,
      abandonment_stage: "resolution_attempt",
      likely_abandonment_reason: "User frustrated by repeated bot misunderstanding",
      turns_completed: 6,
      had_natural_closing: false
    }
  },
  {
    id: 8,
    name: "Compliance & Script Adherence Checker",
    description: "Verifies that the bot delivered required disclosures and followed the approved script.",
    keywords: ["complian", "disclosur", "script", "required", "legal", "policy", "terms", "privacy", "consent", "mandator"],
    purpose: "Audits each call to ensure the bot delivered all legally required disclosures, obtained necessary consent, and followed the approved conversation script for regulatory compliance.",
    analysis_criteria: {
      detection_rules: "Check for presence of mandatory phrases (privacy notice, call recording disclosure, consent language, terms acceptance). Flag any calls where required disclosures are absent or incomplete.",
      logic: "1. Define required disclosure checklist from the agent prompt. 2. Scan transcript for each required element. 3. Note any that are missing or incomplete. 4. Flag compliance risk.",
      segments_to_analyze: "Opening utterances (where disclosures typically occur), any point where personal data is collected, closing utterances.",
      edge_cases: "User interrupts before disclosure is complete, disclosure delivered but not acknowledged, disclosure paraphrased rather than verbatim.",
      minimum_threshold: "At least the greeting/opening exchange must be present."
    },
    analysis_workflow: {
      step_1: "Extract the required disclosures list from the agent prompt provided.",
      step_2: "Scan the opening turns of the transcript for each required disclosure.",
      step_3: "Note which disclosures were found, which were missing, and which were partial.",
      step_4: "Assess whether consent was properly obtained if required.",
      step_5: "Assign a compliance status: compliant, partial, or non_compliant."
    },
    output_format: {
      field_1: "compliance_status (string): compliant, partial, or non_compliant",
      field_2: "disclosures_delivered (string): Comma-separated list of disclosures found",
      field_3: "disclosures_missing (string): Comma-separated list of missing required disclosures",
      field_4: "consent_obtained (boolean): Whether required consent was properly obtained",
      field_5: "compliance_risk_level (string): low, medium, or high risk"
    },
    example_output: {
      compliance_status: "partial",
      disclosures_delivered: "call_recording_notice, privacy_policy",
      disclosures_missing: "terms_of_service_consent",
      consent_obtained: false,
      compliance_risk_level: "medium"
    }
  },
  {
    id: 9,
    name: "Intent Classification",
    description: "Categorizes the primary reason and sub-reason for each call.",
    keywords: ["intent", "reason", "purpose", "categor", "topic", "why calling", "what brings", "help with"],
    purpose: "Automatically classifies the primary and secondary intents of each call to enable routing optimization, volume analysis, and knowledge base gap identification.",
    analysis_criteria: {
      detection_rules: "Extract the user's stated purpose from the first 1-3 turns. Look for action verbs (cancel, check, update, report, request) combined with objects (account, payment, order, password).",
      logic: "1. Identify primary intent from opening turns. 2. Classify into a high-level category. 3. Identify sub-intent if present. 4. Note any intent shifts mid-call.",
      segments_to_analyze: "First 3 user utterances, any utterance that starts with 'also', 'and', or 'another thing', intent-bearing verbs and nouns.",
      edge_cases: "Vague opening ('I need help'), multiple simultaneous intents, intent that shifts mid-call, calls that begin with complaints before stating the actual need.",
      minimum_threshold: "At least one user utterance stating or implying a purpose."
    },
    analysis_workflow: {
      step_1: "Read the first 3 user turns and extract all stated needs or purposes.",
      step_2: "Identify the single primary intent (the most important or first-stated need).",
      step_3: "Classify the primary intent into a category: billing, technical, account, product, complaint, information.",
      step_4: "Note any secondary intents raised later in the conversation.",
      step_5: "Flag if the intent changed significantly mid-call."
    },
    output_format: {
      field_1: "primary_intent (string): The main reason for the call",
      field_2: "intent_category (string): High-level category of the intent",
      field_3: "secondary_intent (string): Secondary need raised in the call, if any",
      field_4: "intent_shift_detected (boolean): Whether the user's primary intent changed mid-call",
      field_5: "intent_clarity (string): clear, ambiguous, or vague"
    },
    example_output: {
      primary_intent: "cancel_subscription",
      intent_category: "account",
      secondary_intent: "request_refund",
      intent_shift_detected: false,
      intent_clarity: "clear"
    }
  },
  {
    id: 10,
    name: "Response Quality Scorer",
    description: "Evaluates how accurate, helpful, and appropriate the bot's responses were.",
    keywords: ["quality", "accurate", "helpful", "appropriate", "correct", "response", "answer", "reply", "helpful"],
    purpose: "Assesses whether the bot's responses were factually accurate, contextually appropriate, and genuinely helpful — going beyond task completion to measure response quality.",
    analysis_criteria: {
      detection_rules: "Evaluate bot responses for: relevance to user's question, completeness of information, appropriate tone, absence of hallucinated or incorrect facts, and actionability of answers.",
      logic: "1. For each bot response, assess relevance (0-3). 2. Assess completeness (0-3). 3. Assess tone appropriateness (0-2). 4. Flag any potentially incorrect information. 5. Average for overall quality score.",
      segments_to_analyze: "All bot utterances in response to direct user questions or requests.",
      edge_cases: "Responses to ambiguous questions, responses where correct answer is unknown, responses that are accurate but unhelpful in tone.",
      minimum_threshold: "At least 2 bot response turns to evaluate quality."
    },
    analysis_workflow: {
      step_1: "List all bot responses that directly answered a user question or request.",
      step_2: "For each response, rate relevance to the user's actual question (on-topic vs off-topic).",
      step_3: "Identify the weakest response — the one that was least helpful or most off-target.",
      step_4: "Identify the strongest response — the one that best addressed the user's need.",
      step_5: "Assign an overall response quality score from 1 to 10."
    },
    output_format: {
      field_1: "overall_quality_score (number): Response quality score from 1 to 10",
      field_2: "weakest_response (string): The least helpful bot response in the call",
      field_3: "strongest_response (string): The most helpful bot response in the call",
      field_4: "off_topic_responses_count (number): Number of responses that missed the user's intent",
      field_5: "response_quality_summary (string): Brief assessment of overall response quality"
    },
    example_output: {
      overall_quality_score: 6,
      weakest_response: "I understand you're frustrated. Is there anything else I can help you with?",
      strongest_response: "Your account balance is $247.50 as of today. Your next billing date is June 15th.",
      off_topic_responses_count: 2,
      response_quality_summary: "Generally accurate but missed user's secondary intent and redirected too quickly"
    }
  },
  {
    id: 11,
    name: "Containment Rate Analyzer",
    description: "Measures whether the bot fully handled the call without any human intervention.",
    keywords: ["contain", "self-serve", "automated", "fully handled", "bot resolved", "no agent", "automation"],
    purpose: "Tracks whether each call was fully contained within the automated bot system or required any human touchpoint, which is the primary metric for automation ROI.",
    analysis_criteria: {
      detection_rules: "A call is contained if: it ends with resolution, no transfer occurs, no human agent appears in the transcript, and user expressed satisfaction or confirmed resolution.",
      logic: "1. Check for any transfer or handoff events. 2. Check for human agent utterances. 3. Verify resolution occurred. 4. Classify containment type.",
      segments_to_analyze: "Entire transcript for transfer events, all speaker labels, closing exchange.",
      edge_cases: "Calls where user voluntarily called back, calls with silent transfers, partial containment (bot resolves one issue, agent handles another).",
      minimum_threshold: "Complete call transcript required."
    },
    analysis_workflow: {
      step_1: "Check if any human agent appears as a speaker in the transcript.",
      step_2: "Check if any transfer event or handoff occurred.",
      step_3: "Verify whether the user's primary intent was resolved.",
      step_4: "Classify containment: fully_contained, partially_contained, or not_contained.",
      step_5: "If not contained, identify the containment failure point."
    },
    output_format: {
      field_1: "containment_status (string): fully_contained, partially_contained, or not_contained",
      field_2: "human_intervention_occurred (boolean): Whether any human agent was involved",
      field_3: "containment_failure_reason (string): Why containment failed, if applicable",
      field_4: "bot_handled_turns (number): Number of turns handled purely by bot",
      field_5: "containment_failure_turn (number): Turn where containment broke down, or -1 if contained"
    },
    example_output: {
      containment_status: "not_contained",
      human_intervention_occurred: true,
      containment_failure_reason: "User requested account exception that bot has no authority to grant",
      bot_handled_turns: 8,
      containment_failure_turn: 9
    }
  },
  {
    id: 12,
    name: "Conversation Length & Efficiency Analyzer",
    description: "Measures whether the call was resolved in an efficient number of turns.",
    keywords: ["length", "efficiency", "turns", "duration", "long", "short", "verbose", "concise", "fast", "slow"],
    purpose: "Evaluates whether the bot guided the user to resolution efficiently or created unnecessarily long conversations through repetition, over-clarification, or poor flow design.",
    analysis_criteria: {
      detection_rules: "Count total turns, identify any turn pairs where bot asks the same clarifying question twice, detect unnecessary filler or transitional responses that add length without value.",
      logic: "1. Count total conversation turns. 2. Identify redundant or filler turns. 3. Calculate effective turns (total minus redundant). 4. Rate efficiency relative to intent complexity.",
      segments_to_analyze: "All turns, focusing on bot clarification questions, repeated requests for the same information, transitional phrases.",
      edge_cases: "Complex intents legitimately requiring more turns, user providing incomplete info causing extra clarification, calls with multiple intents.",
      minimum_threshold: "At least 4 turns to assess efficiency meaningfully."
    },
    analysis_workflow: {
      step_1: "Count the total number of turns (each bot + user exchange = 1 turn).",
      step_2: "Identify any turns where the bot asked for information already provided.",
      step_3: "Count filler turns (bot responses that don't advance resolution).",
      step_4: "Classify conversation efficiency as efficient, average, or verbose.",
      step_5: "Estimate how many turns could have been saved with optimal flow."
    },
    output_format: {
      field_1: "total_turns (number): Total number of conversation turns",
      field_2: "efficiency_rating (string): efficient, average, or verbose",
      field_3: "redundant_turns_count (number): Number of unnecessary or repeated turns",
      field_4: "turns_to_resolution (number): Turns taken to achieve resolution",
      field_5: "estimated_turns_saveable (number): How many turns could have been eliminated"
    },
    example_output: {
      total_turns: 14,
      efficiency_rating: "verbose",
      redundant_turns_count: 4,
      turns_to_resolution: 14,
      estimated_turns_saveable: 4
    }
  },
  {
    id: 13,
    name: "User Effort Score",
    description: "Measures how much effort the user had to expend to get their issue resolved.",
    keywords: ["effort", "friction", "repeat", "rephrase", "struggle", "difficult", "easy", "simple", "hard", "complex"],
    purpose: "Quantifies the amount of effort the user had to put in — including rephrasing, repetition, waiting, and providing the same information multiple times — to track and minimize customer effort.",
    analysis_criteria: {
      detection_rules: "Count instances of user repetition (same info stated 2+ times), user rephrasing (same intent in different words), expressions of effort ('I already told you', 'I said that'), and multi-step user actions required for simple tasks.",
      logic: "1. Count user repetitions. 2. Count rephrasings. 3. Count times user had to provide same info. 4. Note any expressions of effort. 5. Score effort from 1 (low) to 10 (high).",
      segments_to_analyze: "All user utterances, comparing consecutive turns for repetition and rephrasing patterns.",
      edge_cases: "Intentional repetition for confirmation, rephrasing due to own mistake, effort caused by external factors (looking up account number).",
      minimum_threshold: "At least 3 user turns to assess effort patterns."
    },
    analysis_workflow: {
      step_1: "Count how many times the user stated the same piece of information more than once.",
      step_2: "Count how many times the user had to rephrase their intent due to bot misunderstanding.",
      step_3: "Identify any explicit expressions of frustration about having to repeat themselves.",
      step_4: "Assess the overall number of steps/actions required from the user for the given intent.",
      step_5: "Assign a user effort score from 1 (effortless) to 10 (extremely high effort)."
    },
    output_format: {
      field_1: "user_effort_score (number): Effort score from 1 (low) to 10 (high)",
      field_2: "repetition_count (number): Times user had to repeat the same information",
      field_3: "rephrasing_count (number): Times user had to rephrase their intent",
      field_4: "effort_complaint_detected (boolean): Whether user explicitly complained about effort",
      field_5: "primary_effort_driver (string): Main reason for high user effort, if applicable"
    },
    example_output: {
      user_effort_score: 8,
      repetition_count: 3,
      rephrasing_count: 2,
      effort_complaint_detected: true,
      primary_effort_driver: "Bot failed to understand account number format repeatedly"
    }
  },
  {
    id: 14,
    name: "Upsell & Cross-sell Opportunity Detector",
    description: "Identifies moments in the call where upsell or cross-sell opportunities were present or missed.",
    keywords: ["upsell", "cross-sell", "upgrade", "offer", "product", "recommend", "promot", "opportunit", "sale", "revenue"],
    purpose: "Scans calls for moments where the bot could have introduced a relevant product, upgrade, or complementary service, and whether those opportunities were taken or missed.",
    analysis_criteria: {
      detection_rules: "Look for user mentions of usage, needs, or problems that could be addressed by additional products/services. Flag bot responses that introduced offers. Note user receptiveness to any offers made.",
      logic: "1. Identify user statements revealing needs that match other products. 2. Check if bot made any offer. 3. If offer made, assess user response. 4. If no offer, flag as missed opportunity.",
      segments_to_analyze: "User statements about usage, problems, or needs; any bot product recommendations or offers; user responses to offers.",
      edge_cases: "Complaint calls where upsell is inappropriate, user who stated no interest in offers, calls that are too short for upsell.",
      minimum_threshold: "At least 4 turns and a resolved primary intent before upsell assessment."
    },
    analysis_workflow: {
      step_1: "Identify any user statements that reveal additional needs or pain points beyond the primary intent.",
      step_2: "Check whether the bot made any product recommendation or upsell offer.",
      step_3: "If an offer was made, classify the user's response as receptive, neutral, or rejected.",
      step_4: "If no offer was made, assess whether an opportunity was present and missed.",
      step_5: "Note the specific product or service that could have been offered."
    },
    output_format: {
      field_1: "upsell_opportunity_present (boolean): Whether an upsell opportunity existed in this call",
      field_2: "upsell_attempted (boolean): Whether the bot made an upsell or cross-sell offer",
      field_3: "user_receptiveness (string): receptive, neutral, rejected, or not_applicable",
      field_4: "missed_opportunity_description (string): Description of the missed opportunity, if any",
      field_5: "recommended_product (string): Product or service that was or could have been offered"
    },
    example_output: {
      upsell_opportunity_present: true,
      upsell_attempted: false,
      user_receptiveness: "not_applicable",
      missed_opportunity_description: "User mentioned they frequently have billing questions — premium plan with dedicated support could have been offered",
      recommended_product: "Premium Support Plan"
    }
  },
  {
    id: 15,
    name: "First Call Resolution (FCR) Analyzer",
    description: "Determines whether the caller's issue was resolved in a single call without needing to follow up.",
    keywords: ["first call", "fcr", "follow up", "callback", "call back", "return", "again", "previous call", "last time", "already called"],
    purpose: "Tracks whether this call resolved the user's issue completely on the first attempt, or if evidence suggests the user has called before or will need to call again — a critical efficiency metric.",
    analysis_criteria: {
      detection_rules: "Look for references to previous calls ('I called before', 'last time I spoke with'), indicators that the issue will need further action, or promises of callback. Also detect if resolution was definitive vs temporary.",
      logic: "1. Check for any reference to prior contact. 2. Assess if resolution was complete or requires follow-up action. 3. Check if bot promised to call back. 4. Classify FCR status.",
      segments_to_analyze: "Opening turns (references to previous contact), resolution moment, closing turns (any commitments to follow up).",
      edge_cases: "User calls for an update on a previous case (inherently not FCR), issues that legitimately require multiple steps, promised callbacks as part of normal process.",
      minimum_threshold: "Complete call including closing exchange."
    },
    analysis_workflow: {
      step_1: "Check opening turns for any reference by the user to a previous call or contact.",
      step_2: "Assess whether the issue was fully resolved or requires any follow-up action.",
      step_3: "Check closing turns for any commitments made to contact the user again.",
      step_4: "Classify FCR status as: first_call_resolved, repeat_call, or requires_followup.",
      step_5: "Note any evidence that the user may call back."
    },
    output_format: {
      field_1: "fcr_status (string): first_call_resolved, repeat_call, or requires_followup",
      field_2: "prior_contact_referenced (boolean): Whether user mentioned a previous call",
      field_3: "followup_required (boolean): Whether the resolution requires further contact",
      field_4: "followup_reason (string): Why follow-up is needed, if applicable",
      field_5: "fcr_confidence (string): high, medium, or low confidence in the FCR classification"
    },
    example_output: {
      fcr_status: "repeat_call",
      prior_contact_referenced: true,
      followup_required: false,
      followup_reason: "",
      fcr_confidence: "high"
    }
  }
]

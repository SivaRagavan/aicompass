export type QuestionOption = {
  value: string
  label: string
  recommendedPillars: string[]
}

export type Question = {
  id: string
  prompt: string
  helper?: string
  options: QuestionOption[]
}

export const questions: Question[] = [
  {
    id: 'ai-maturity',
    prompt: 'How would you describe your AI adoption stage?',
    helper: 'This helps prioritize internal adoption and data readiness questions.',
    options: [
      {
        value: 'exploring',
        label: 'Exploring / pilots',
        recommendedPillars: ['internal-adoption', 'data-readiness', 'executive-alignment'],
      },
      {
        value: 'scaling',
        label: 'Scaling across teams',
        recommendedPillars: ['internal-adoption', 'talent', 'governance-risk'],
      },
      {
        value: 'optimized',
        label: 'Optimizing & monetizing',
        recommendedPillars: ['ai-value', 'product-strategy', 'governance-risk'],
      },
    ],
  },
  {
    id: 'data-sensitivity',
    prompt: 'How sensitive is the data your teams use with AI?',
    helper: 'Higher sensitivity increases governance and shadow AI importance.',
    options: [
      {
        value: 'low',
        label: 'Mostly public or low-risk data',
        recommendedPillars: ['internal-adoption'],
      },
      {
        value: 'mixed',
        label: 'Mix of internal and regulated data',
        recommendedPillars: ['governance-risk', 'shadow-ai'],
      },
      {
        value: 'high',
        label: 'Highly regulated or proprietary',
        recommendedPillars: ['governance-risk', 'shadow-ai', 'data-readiness'],
      },
    ],
  },
  {
    id: 'product-ai',
    prompt: 'Is AI part of your customer-facing product roadmap?',
    helper: 'Determines whether product strategy and revenue impact apply.',
    options: [
      {
        value: 'not-yet',
        label: 'Not yet',
        recommendedPillars: ['internal-adoption'],
      },
      {
        value: 'planned',
        label: 'Planned in the next 12 months',
        recommendedPillars: ['product-strategy', 'data-readiness'],
      },
      {
        value: 'live',
        label: 'Live in production',
        recommendedPillars: ['product-strategy', 'ai-value', 'governance-risk'],
      },
    ],
  },
  {
    id: 'workforce',
    prompt: 'What best describes your AI talent posture?',
    helper: 'Used to focus on AI talent and leadership alignment.',
    options: [
      {
        value: 'limited',
        label: 'Limited in-house talent',
        recommendedPillars: ['talent', 'executive-alignment'],
      },
      {
        value: 'growing',
        label: 'Growing a core team',
        recommendedPillars: ['talent', 'internal-adoption'],
      },
      {
        value: 'established',
        label: 'Established AI teams',
        recommendedPillars: ['talent', 'ai-value'],
      },
    ],
  },
]

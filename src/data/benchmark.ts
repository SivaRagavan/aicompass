export type SliderLabels = [string, string, string, string, string]

export type Metric = {
  id: string
  name: string
  description: string
  weight: number
  labels: SliderLabels
}

export type Pillar = {
  id: string
  name: string
  description: string
  weight: number
  metrics: Metric[]
}

export type Benchmark = {
  name: string
  version: string
  pillars: Pillar[]
}

export const defaultLabels: SliderLabels = [
  'Ad-hoc',
  'Basic',
  'Defined',
  'Advanced',
  'Leading',
]

export const defaultBenchmark: Benchmark = {
  name: 'AI Adoption Benchmark',
  version: '0.1',
  pillars: [
    {
      id: 'internal-adoption',
      name: 'Internal Adoption',
      description: 'How broadly AI tools are used across teams and workflows.',
      weight: 1,
      metrics: [
        {
          id: 'adoption-coverage',
          name: 'Workflow Coverage',
          description: 'Percent of core workflows using AI assistance.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'adoption-depth',
          name: 'Depth of Use',
          description: 'How advanced AI usage is within teams.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'enablement',
          name: 'Enablement Programs',
          description: 'Training, enablement, and adoption support.',
          weight: 1,
          labels: defaultLabels,
        },
      ],
    },
    {
      id: 'shadow-ai',
      name: 'Shadow AI',
      description: 'Visibility and control over unsanctioned AI usage.',
      weight: 1,
      metrics: [
        {
          id: 'visibility',
          name: 'Tool Visibility',
          description: 'Visibility into AI tools and usage.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'policy-enforcement',
          name: 'Policy Enforcement',
          description: 'Ability to enforce AI usage policies.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'risk-mitigation',
          name: 'Risk Mitigation',
          description: 'Controls to reduce data leakage from shadow AI.',
          weight: 1,
          labels: defaultLabels,
        },
      ],
    },
    {
      id: 'talent',
      name: 'AI Talent',
      description: 'Skills, hiring, and capability building.',
      weight: 1,
      metrics: [
        {
          id: 'skill-coverage',
          name: 'Skill Coverage',
          description: 'Percentage of roles with AI skill baseline.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'specialist-depth',
          name: 'Specialist Depth',
          description: 'Availability of AI/ML specialists.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'career-paths',
          name: 'Career Paths',
          description: 'Clear AI roles, growth paths, and incentives.',
          weight: 1,
          labels: defaultLabels,
        },
      ],
    },
    {
      id: 'executive-alignment',
      name: 'Executive Alignment',
      description: 'Leadership sponsorship, governance, and funding.',
      weight: 1,
      metrics: [
        {
          id: 'leadership-sponsorship',
          name: 'Leadership Sponsorship',
          description: 'Executive ownership and advocacy of AI.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'portfolio-prioritization',
          name: 'Portfolio Prioritization',
          description: 'How AI initiatives are prioritized and funded.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'governance-model',
          name: 'Governance Model',
          description: 'Decision-making and accountability structure.',
          weight: 1,
          labels: defaultLabels,
        },
      ],
    },
    {
      id: 'data-readiness',
      name: 'Data Readiness',
      description: 'Data quality, access, and infrastructure.',
      weight: 1,
      metrics: [
        {
          id: 'data-quality',
          name: 'Data Quality',
          description: 'Completeness, accuracy, and consistency.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'data-access',
          name: 'Data Access',
          description: 'Availability and discoverability of data.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'mlops',
          name: 'AI Infrastructure',
          description: 'Pipelines, MLOps, and tooling readiness.',
          weight: 1,
          labels: defaultLabels,
        },
      ],
    },
    {
      id: 'product-strategy',
      name: 'AI Product Strategy',
      description: 'AI in product roadmap and differentiation.',
      weight: 1,
      metrics: [
        {
          id: 'roadmap',
          name: 'AI Roadmap',
          description: 'Clear product strategy for AI capabilities.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'differentiation',
          name: 'Differentiation',
          description: 'AI-driven competitive advantage.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'customer-feedback',
          name: 'Customer Feedback Loop',
          description: 'Feedback and iteration on AI features.',
          weight: 1,
          labels: defaultLabels,
        },
      ],
    },
    {
      id: 'ai-value',
      name: 'AI Revenue & Value',
      description: 'Monetization and measurable business impact.',
      weight: 1,
      metrics: [
        {
          id: 'value-realization',
          name: 'Value Realization',
          description: 'Quantified benefits and ROI tracking.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'revenue-contribution',
          name: 'Revenue Contribution',
          description: 'Revenue directly tied to AI features.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'productivity-gains',
          name: 'Productivity Gains',
          description: 'Measured operational efficiency improvements.',
          weight: 1,
          labels: defaultLabels,
        },
      ],
    },
    {
      id: 'governance-risk',
      name: 'Governance & Risk',
      description: 'Responsible AI, safety, and compliance.',
      weight: 1,
      metrics: [
        {
          id: 'responsible-ai',
          name: 'Responsible AI',
          description: 'Ethics, bias mitigation, and transparency.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'security',
          name: 'Security Controls',
          description: 'Security testing, access controls, and monitoring.',
          weight: 1,
          labels: defaultLabels,
        },
        {
          id: 'compliance',
          name: 'Compliance Readiness',
          description: 'Regulatory policies and auditability.',
          weight: 1,
          labels: defaultLabels,
        },
      ],
    },
  ],
}

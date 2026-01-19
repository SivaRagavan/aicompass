export type SliderLabels = [string, string, string, string, string]

export type Question = {
  id: string
  prompt: string
}

export type Metric = {
  id: string
  name: string
  description: string
  weight: number
  labels: SliderLabels
  questions: Question[]
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
  name: 'AI Compass',
  version: '0.2',
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
          description: 'How widely AI is embedded in core workflows.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'coverage-1', prompt: 'How many core workflows use AI assistance?' },
            { id: 'coverage-2', prompt: 'How many teams rely on AI for daily work?' },
            { id: 'coverage-3', prompt: 'How standardized are AI-enabled workflows?' },
          ],
        },
        {
          id: 'adoption-depth',
          name: 'Depth of Use',
          description: 'How advanced AI usage is within teams.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'depth-1', prompt: 'How advanced are AI use cases in production?' },
            { id: 'depth-2', prompt: 'How integrated is AI into decision-making?' },
            {
              id: 'depth-3',
              prompt: 'How often are AI outputs trusted without manual workarounds?',
            },
          ],
        },
        {
          id: 'enablement',
          name: 'Enablement Programs',
          description: 'Training, enablement, and adoption support.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'enablement-1', prompt: 'How formalized is AI training across roles?' },
            { id: 'enablement-2', prompt: 'How well-supported are internal AI champions?' },
            { id: 'enablement-3', prompt: 'How accessible are AI playbooks and guidelines?' },
          ],
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
          questions: [
            { id: 'visibility-1', prompt: 'How well do you track AI tool usage?' },
            { id: 'visibility-2', prompt: 'How complete is your inventory of AI vendors?' },
            { id: 'visibility-3', prompt: 'How frequently is usage data reviewed?' },
          ],
        },
        {
          id: 'policy-enforcement',
          name: 'Policy Enforcement',
          description: 'Ability to enforce AI usage policies.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'policy-1', prompt: 'How clearly are AI policies communicated?' },
            { id: 'policy-2', prompt: 'How consistently are AI policies enforced?' },
            { id: 'policy-3', prompt: 'How effective are guardrails for approved tools?' },
          ],
        },
        {
          id: 'risk-mitigation',
          name: 'Risk Mitigation',
          description: 'Controls to reduce data leakage from shadow AI.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'risk-1', prompt: 'How strong are controls to prevent data leakage?' },
            { id: 'risk-2', prompt: 'How well are high-risk prompts detected?' },
            { id: 'risk-3', prompt: 'How quickly are shadow AI incidents handled?' },
          ],
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
          description: 'Breadth of AI skills across the workforce.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'skill-1', prompt: 'How many roles have defined AI skill baselines?' },
            { id: 'skill-2', prompt: 'How quickly can teams learn new AI tools?' },
            { id: 'skill-3', prompt: 'How embedded are AI skills in hiring criteria?' },
          ],
        },
        {
          id: 'specialist-depth',
          name: 'Specialist Depth',
          description: 'Availability of AI/ML specialists.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'specialist-1', prompt: 'How deep is the AI/ML specialist bench?' },
            { id: 'specialist-2', prompt: 'How well-staffed are AI platform teams?' },
            { id: 'specialist-3', prompt: 'How sustainable is AI hiring pipeline?' },
          ],
        },
        {
          id: 'career-paths',
          name: 'Career Paths',
          description: 'Clear AI roles, growth paths, and incentives.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'career-1', prompt: 'How clear are AI career paths and progression?' },
            { id: 'career-2', prompt: 'How competitive are AI compensation bands?' },
            { id: 'career-3', prompt: 'How strong are retention programs for AI talent?' },
          ],
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
          questions: [
            { id: 'leadership-1', prompt: 'How visible is executive sponsorship of AI?' },
            { id: 'leadership-2', prompt: 'How aligned are leaders on AI priorities?' },
            { id: 'leadership-3', prompt: 'How consistent is executive communication on AI?' },
          ],
        },
        {
          id: 'portfolio-prioritization',
          name: 'Portfolio Prioritization',
          description: 'How AI initiatives are prioritized and funded.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'portfolio-1', prompt: 'How disciplined is AI investment prioritization?' },
            { id: 'portfolio-2', prompt: 'How clear are AI business cases?' },
            { id: 'portfolio-3', prompt: 'How consistently are AI initiatives funded?' },
          ],
        },
        {
          id: 'governance-model',
          name: 'Governance Model',
          description: 'Decision-making and accountability structure.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'governance-1', prompt: 'How clear are AI governance roles?' },
            { id: 'governance-2', prompt: 'How effective is AI decision-making cadence?' },
            { id: 'governance-3', prompt: 'How strong is accountability for AI outcomes?' },
          ],
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
          questions: [
            { id: 'data-quality-1', prompt: 'How reliable is data quality for AI use cases?' },
            { id: 'data-quality-2', prompt: 'How complete are key datasets?' },
            { id: 'data-quality-3', prompt: 'How automated are data quality checks?' },
          ],
        },
        {
          id: 'data-access',
          name: 'Data Access',
          description: 'Availability and discoverability of data.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'data-access-1', prompt: 'How easy is it to access data for AI work?' },
            { id: 'data-access-2', prompt: 'How mature is data governance for sharing?' },
            { id: 'data-access-3', prompt: 'How self-serve is data discovery?' },
          ],
        },
        {
          id: 'mlops',
          name: 'AI Infrastructure',
          description: 'Pipelines, MLOps, and tooling readiness.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'mlops-1', prompt: 'How production-ready are AI pipelines?' },
            { id: 'mlops-2', prompt: 'How standardized are model deployment practices?' },
            { id: 'mlops-3', prompt: 'How strong is monitoring of AI systems?' },
          ],
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
          questions: [
            { id: 'roadmap-1', prompt: 'How clear is the AI product roadmap?' },
            { id: 'roadmap-2', prompt: 'How well does AI align with product strategy?' },
            { id: 'roadmap-3', prompt: 'How frequently is the AI roadmap reviewed?' },
          ],
        },
        {
          id: 'differentiation',
          name: 'Differentiation',
          description: 'AI-driven competitive advantage.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'diff-1', prompt: 'How differentiated are AI features in market?' },
            { id: 'diff-2', prompt: 'How defensible are AI capabilities?' },
            { id: 'diff-3', prompt: 'How measurable is AI-driven advantage?' },
          ],
        },
        {
          id: 'customer-feedback',
          name: 'Customer Feedback Loop',
          description: 'Feedback and iteration on AI features.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'feedback-1', prompt: 'How systematic is AI feedback collection?' },
            {
              id: 'feedback-2',
              prompt: 'How quickly are AI insights turned into improvements?',
            },
            { id: 'feedback-3', prompt: 'How well are AI outcomes communicated to customers?' },
          ],
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
          questions: [
            { id: 'value-1', prompt: 'How well is AI value tracked and reported?' },
            { id: 'value-2', prompt: 'How repeatable is AI value measurement?' },
            { id: 'value-3', prompt: 'How strong are ROI baselines for AI?' },
          ],
        },
        {
          id: 'revenue-contribution',
          name: 'Revenue Contribution',
          description: 'Revenue directly tied to AI features.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'revenue-1', prompt: 'How meaningful is AI-driven revenue today?' },
            { id: 'revenue-2', prompt: 'How clear are AI monetization paths?' },
            { id: 'revenue-3', prompt: 'How consistent is AI revenue forecasting?' },
          ],
        },
        {
          id: 'productivity-gains',
          name: 'Productivity Gains',
          description: 'Measured operational efficiency improvements.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'prod-1', prompt: 'How measured are AI productivity gains?' },
            { id: 'prod-2', prompt: 'How widely realized are efficiency improvements?' },
            { id: 'prod-3', prompt: 'How sustained are AI efficiency gains over time?' },
          ],
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
          questions: [
            { id: 'resp-1', prompt: 'How well are bias risks assessed in AI systems?' },
            { id: 'resp-2', prompt: 'How transparent are AI models and decisions?' },
            { id: 'resp-3', prompt: 'How robust are responsible AI reviews?' },
          ],
        },
        {
          id: 'security',
          name: 'Security Controls',
          description: 'Security testing, access controls, and monitoring.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'sec-1', prompt: 'How mature are AI security controls?' },
            { id: 'sec-2', prompt: 'How continuous is AI threat monitoring?' },
            { id: 'sec-3', prompt: 'How tested are AI incident response plans?' },
          ],
        },
        {
          id: 'compliance',
          name: 'Compliance Readiness',
          description: 'Regulatory policies and auditability.',
          weight: 1,
          labels: defaultLabels,
          questions: [
            { id: 'comp-1', prompt: 'How prepared are you for AI regulations?' },
            { id: 'comp-2', prompt: 'How audit-ready are AI systems?' },
            { id: 'comp-3', prompt: 'How routinely are compliance gaps reviewed?' },
          ],
        },
      ],
    },
  ],
}

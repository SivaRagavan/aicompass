import type { Benchmark } from '../data/benchmark'
import type { MetricScore, MetricSelection } from '../state/assessmentStore'

export type PillarScore = {
  pillarId: string
  pillarName: string
  score: number
}

export type ScoreSummary = {
  compositeScore: number
  pillarScores: PillarScore[]
  maturityBand: string
}

const bandForScore = (score: number) => {
  if (score >= 80) return 'Leading'
  if (score >= 60) return 'Scaling'
  if (score >= 40) return 'Developing'
  return 'Emerging'
}

const normalizeWeights = (weights: number[]) => {
  const total = weights.reduce((sum, value) => sum + value, 0)
  return weights.map((value) => (total === 0 ? 0 : value / total))
}

export const calculateScores = (
  benchmark: Benchmark,
  selections: MetricSelection[],
  scores: MetricScore[],
): ScoreSummary => {
  const selectedMetricIds = new Set(
    selections.filter((selection) => selection.selected).map((item) => item.metricId),
  )

  const scoreMap = new Map(
    scores.map((score) => [score.metricId, score.score]),
  )

  const pillarScores: PillarScore[] = benchmark.pillars.map((pillar) => {
    const selectedMetrics = pillar.metrics.filter((metric) =>
      selectedMetricIds.has(metric.id),
    )

    if (selectedMetrics.length === 0) {
      return { pillarId: pillar.id, pillarName: pillar.name, score: 0 }
    }

    const weights = normalizeWeights(selectedMetrics.map((metric) => metric.weight))
    const weightedScore = selectedMetrics.reduce((sum, metric, index) => {
      const score = scoreMap.get(metric.id) ?? 0
      return sum + score * weights[index]
    }, 0)

    return {
      pillarId: pillar.id,
      pillarName: pillar.name,
      score: weightedScore * 20,
    }
  })

  const selectedPillars = pillarScores.filter(
    (pillar) => pillar.score > 0,
  )

  const pillarWeights = normalizeWeights(
    selectedPillars.map((pillar) => {
      const pillarConfig = benchmark.pillars.find(
        (item) => item.id === pillar.pillarId,
      )
      return pillarConfig?.weight ?? 1
    }),
  )

  const compositeScore = selectedPillars.reduce((sum, pillar, index) => {
    return sum + pillar.score * pillarWeights[index]
  }, 0)

  return {
    compositeScore,
    pillarScores: pillarScores.filter((pillar) => pillar.score > 0),
    maturityBand: bandForScore(compositeScore),
  }
}

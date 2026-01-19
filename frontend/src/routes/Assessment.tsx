import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBenchmark } from '../state/benchmarkStore'
import { useAssessment } from '../state/assessmentStore'
import type { MetricScore } from '../state/assessmentStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { apiClient } from '@/lib/api'

const Assessment = () => {
  const navigate = useNavigate()
  const { pillarId, metricId } = useParams()
  const { benchmark } = useBenchmark()
  const { assessment, setScores, resetAssessment } = useAssessment()
  const [scores, updateScores] = useState<MetricScore[]>(assessment.scores)
  const [autosaveError, setAutosaveError] = useState<string | null>(null)

  const selectedPillars = useMemo(() => {
    return benchmark.pillars.filter((pillar) =>
      assessment.selections.some(
        (selection) => selection.pillarId === pillar.id && selection.selected,
      ),
    )
  }, [assessment.selections, benchmark.pillars])

  const selectedMetrics = useMemo(() => {
    return selectedPillars.flatMap((pillar) =>
      pillar.metrics.map((metric) => ({ pillar, metric })),
    )
  }, [selectedPillars])

  const metricIndex = selectedMetrics.findIndex(
    (entry) => entry.pillar.id === pillarId && entry.metric.id === metricId,
  )
  const currentEntry =
    metricIndex >= 0 ? selectedMetrics[metricIndex] : selectedMetrics[0]
  const normalizedIndex = metricIndex >= 0 ? metricIndex : 0

  useEffect(() => {
    if (metricIndex < 0 && currentEntry) {
      navigate(`/assessment/${currentEntry.pillar.id}/${currentEntry.metric.id}`)
    }
  }, [currentEntry, metricIndex, navigate])

  const persistAndNavigate = (path: string) => {
    setScores(scores)
    navigate(path)
  }

  const autosave = async (nextScores: MetricScore[]) => {
    if (!sessionStorage.getItem('inviteToken')) return
    const inviteToken = sessionStorage.getItem('inviteToken')
    const totalMetrics = selectedMetrics.length
    const answeredMetrics = nextScores.length
    const percent = totalMetrics
      ? Math.min(100, Math.round((answeredMetrics / totalMetrics) * 100))
      : 0

    const response = await apiClient.patch(`/api/invite/${inviteToken}`, {
      companyName: assessment.profile.companyName,
      companyIndustry: assessment.profile.industry,
      companySize: assessment.profile.size,
      execProfile: {
        name: assessment.profile.execName,
        title: assessment.profile.execTitle,
        email: assessment.profile.execEmail,
      },
      selections: assessment.selections,
      scores: nextScores,
      progress: {
        completedMetrics: answeredMetrics,
        totalMetrics,
        percent,
        updatedAt: new Date().toISOString(),
      },
    })

    if (response.error) {
      setAutosaveError(response.error)
    }
  }

  const handleResponseChange = (
    metricIdValue: string,
    pillarIdValue: string,
    questionIndex: number,
    value: number,
    totalQuestions: number,
  ) => {
    setAutosaveError(null)
    let nextScores: MetricScore[] = []
    updateScores((prev) => {
      const existing = prev.find((score) => score.metricId === metricIdValue)
      const responses = Array.from({ length: totalQuestions }, (_, index) => {
        return existing?.responses?.[index] ?? 1
      })

      responses[questionIndex] = value
      const average =
        responses.reduce((sum, response) => sum + response, 0) / responses.length

      if (existing) {
        nextScores = prev.map((score) =>
          score.metricId === metricIdValue
            ? { ...score, responses, score: average }
            : score,
        )
        return nextScores
      }

      nextScores = [
        ...prev,
        {
          metricId: metricIdValue,
          pillarId: pillarIdValue,
          responses,
          score: average,
          completed: false,
        },
      ]
      return nextScores
    })

    void autosave(nextScores)
  }

  if (!currentEntry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Modules Selected</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select at least one module to begin scoring.
          </p>
        </CardHeader>
        <div className="flex flex-wrap gap-3 px-6 pb-6">
          <Button onClick={() => navigate('/modules')}>Back to Modules</Button>
          <Button
            variant="outline"
            onClick={() => {
              resetAssessment()
              navigate('/')
            }}
          >
            Reset Assessment
          </Button>
        </div>
      </Card>
    )
  }

  const isFirst = normalizedIndex <= 0
  const isLast = normalizedIndex === selectedMetrics.length - 1
  const nextEntry = selectedMetrics[normalizedIndex + 1]
  const previousEntry = selectedMetrics[normalizedIndex - 1]

  const totalMetrics = selectedMetrics.length
  const progress = Math.min(
    100,
    Math.round(((normalizedIndex + 1) / totalMetrics) * 100),
  )

  const currentPillar = currentEntry.pillar
  const currentMetric = currentEntry.metric
  const existingScore = scores.find((item) => item.metricId === currentMetric.id)
  const responses = existingScore?.responses ??
    Array.from({ length: currentMetric.questions.length }, () => 1)

  const isMetricComplete = (metricIdValue: string) => {
    const score = scores.find((item) => item.metricId === metricIdValue)
    return Boolean(score?.completed)
  }

  const ensureMetricScore = () => {
    const existing = scores.find((score) => score.metricId === currentMetric.id)
    if (existing) return existing

    const defaultResponses = Array.from(
      { length: currentMetric.questions.length },
      () => 1,
    )
    const average =
      defaultResponses.reduce((sum, response) => sum + response, 0) /
      defaultResponses.length

    const nextScore: MetricScore = {
      metricId: currentMetric.id,
      pillarId: currentPillar.id,
      responses: defaultResponses,
      score: average,
      completed: false,
    }

    updateScores((prev) => [...prev, nextScore])
    return nextScore
  }

  const handleNext = async () => {
    const currentScore = ensureMetricScore()
    let nextScores: MetricScore[] = []
    updateScores((prev) => {
      nextScores = prev.map((score) =>
        score.metricId === currentScore.metricId
          ? { ...score, completed: true }
          : score,
      )
      return nextScores
    })

    await autosave(nextScores)

    persistAndNavigate(
      isLast
        ? '/results'
        : `/assessment/${nextEntry?.pillar.id}/${nextEntry?.metric.id}`,
    )
  }

  const handleBack = () => {
    persistAndNavigate(
      isFirst
        ? '/modules'
        : `/assessment/${previousEntry?.pillar.id}/${previousEntry?.metric.id}`,
    )
  }

  const handleReset = () => {
    resetAssessment()
    navigate('/')
  }

  return (
    <div className="grid grid-cols-[240px_1fr] gap-6">
      <aside className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
          <span>Progress</span>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
        </div>
        <div className="mt-2 text-lg font-semibold">
          {normalizedIndex + 1} / {totalMetrics}
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-6 space-y-4">
          {selectedPillars.map((pillar) => (
            <div key={pillar.id}>
              <div className="font-medium text-foreground">{pillar.name}</div>
              <div className="mt-2 space-y-1">
                {pillar.metrics.map((metric) => {
                  const completed = isMetricComplete(metric.id)
                  const active =
                    pillar.id === currentPillar.id && metric.id === currentMetric.id
                  return (
                    <div
                      key={metric.id}
                      className={`flex items-center justify-between rounded-md px-2 py-1 text-xs ${
                        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <span>{metric.name}</span>
                      <span>{completed ? '✓' : ''}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>{currentPillar.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{currentMetric.name}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground">{currentMetric.description}</p>
            {autosaveError && (
              <p className="mt-2 text-xs text-destructive">{autosaveError}</p>
            )}
          </div>

          {currentMetric.questions.map((question, questionIndex) => {
            const value = responses[questionIndex] ?? 1
            return (
              <div key={question.id} className="space-y-3">
                <Label className="text-sm font-medium">{question.prompt}</Label>
                <Slider
                  className="w-[520px] px-2"
                  min={1}
                  max={5}
                  step={1}
                  value={[value]}
                  onValueChange={(values) =>
                    handleResponseChange(
                      currentMetric.id,
                      currentPillar.id,
                      questionIndex,
                      values[0] ?? 1,
                      currentMetric.questions.length,
                    )
                  }
                />
                <div className="slider-labels w-[520px] px-2">
                  {currentMetric.labels.map((label, index) => (
                    <span
                      key={label}
                      className="slider-label"
                      style={{ left: `${(index / 4) * 100}%` }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </CardContent>
        <div className="flex flex-wrap gap-3 px-6 pb-6">
          <Button onClick={handleNext}>
            {isLast ? 'View Results' : 'Next Metric'}
          </Button>
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Assessment

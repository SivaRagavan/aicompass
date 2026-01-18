import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBenchmark } from '../state/benchmarkStore'
import { useAssessment } from '../state/assessmentStore'
import type { MetricSelection, MetricScore } from '../state/assessmentStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'

const Assessment = () => {
  const navigate = useNavigate()
  const { benchmark } = useBenchmark()
  const { assessment, setSelections, setScores } = useAssessment()
  const [localSelections, setLocalSelections] = useState<MetricSelection[]>(
    assessment.selections,
  )
  const [scores, updateScores] = useState<MetricScore[]>(assessment.scores)

  const selectedMetrics = useMemo(() => {
    const selectedIds = new Set(
      localSelections.filter((item) => item.selected).map((item) => item.metricId),
    )
    return benchmark.pillars.flatMap((pillar) =>
      pillar.metrics
        .filter((metric) => selectedIds.has(metric.id))
        .map((metric) => ({ metric, pillar })),
    )
  }, [benchmark, localSelections])

  const handleToggle = (metricId: string) => {
    setLocalSelections((prev) =>
      prev.map((item) =>
        item.metricId === metricId ? { ...item, selected: !item.selected } : item,
      ),
    )
  }

  const handleScoreChange = (metricId: string, pillarId: string, value: number) => {
    updateScores((prev) => {
      const existing = prev.find((score) => score.metricId === metricId)
      if (existing) {
        return prev.map((score) =>
          score.metricId === metricId ? { ...score, score: value } : score,
        )
      }
      return [...prev, { metricId, pillarId, score: value, notes: '' }]
    })
  }

  const handleNoteChange = (metricId: string, pillarId: string, notes: string) => {
    updateScores((prev) => {
      const existing = prev.find((score) => score.metricId === metricId)
      if (existing) {
        return prev.map((score) =>
          score.metricId === metricId ? { ...score, notes } : score,
        )
      }
      return [...prev, { metricId, pillarId, score: 3, notes }]
    })
  }

  const handleContinue = () => {
    setSelections(localSelections)
    setScores(scores)
    navigate('/results')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Modules & Score</CardTitle>
        <p className="text-sm text-muted-foreground">
          Confirm which metrics apply, then score each on a 1–5 scale.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <Label>Applicable Metrics</Label>
          <div className="grid gap-3 lg:grid-cols-2">
            {benchmark.pillars.flatMap((pillar) =>
              pillar.metrics.map((metric) => {
                const selection = localSelections.find(
                  (item) => item.metricId === metric.id,
                )
                const checked = selection?.selected ?? false
                return (
                  <label
                    key={metric.id}
                    className="flex items-center gap-3 rounded-md border border-border bg-muted/40 p-3 text-sm"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => handleToggle(metric.id)}
                    />
                    <span>
                      {pillar.name}: {metric.name}
                    </span>
                  </label>
                )
              }),
            )}
          </div>
        </div>

        <div className="space-y-6">
          {selectedMetrics.map(({ metric, pillar }) => {
            const existingScore = scores.find((item) => item.metricId === metric.id)
            const value = existingScore?.score ?? 3
            const notes = existingScore?.notes ?? ''

            return (
              <Card key={metric.id} className="border-muted">
                <CardContent className="space-y-4 pt-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base font-semibold">{metric.name}</h4>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                    <Badge variant="secondary">{pillar.name}</Badge>
                  </div>

                  <div className="space-y-3">
                    <Slider
                      className="px-2"
                      min={1}
                      max={5}
                      step={1}
                      value={[value]}
                      onValueChange={(values) =>
                        handleScoreChange(metric.id, pillar.id, values[0] ?? 3)
                      }
                    />
                    <div className="slider-labels px-2">
                      {metric.labels.map((label, index) => (
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

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      rows={3}
                      value={notes}
                      onChange={(event) =>
                        handleNoteChange(metric.id, pillar.id, event.target.value)
                      }
                      placeholder="Add supporting evidence or observations."
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {selectedMetrics.length === 0 && (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            Select at least one metric to score.
          </div>
        )}
      </CardContent>
      <div className="flex flex-wrap gap-3 px-6 pb-6">
        <Button onClick={handleContinue} disabled={!selectedMetrics.length}>
          View Results
        </Button>
        <Button variant="secondary" onClick={() => navigate('/questions')}>
          Back to Questions
        </Button>
      </div>
    </Card>
  )
}

export default Assessment

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBenchmark } from '../state/benchmarkStore'
import { useAssessment } from '../state/assessmentStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { apiClient } from '@/lib/api'

const Modules = () => {
  const navigate = useNavigate()
  const { benchmark } = useBenchmark()
  const { assessment, setSelections, resetAssessment } = useAssessment()
  const [localSelections, setLocalSelections] = useState(assessment.selections)

  const selectedPillars = useMemo(() => {
    const selectedMetricIds = new Set(
      localSelections.filter((item) => item.selected).map((item) => item.metricId),
    )

    return benchmark.pillars.map((pillar) => {
      const selectedCount = pillar.metrics.filter((metric) =>
        selectedMetricIds.has(metric.id),
      ).length
      const checked = selectedCount === pillar.metrics.length
      return { pillar, checked }
    })
  }, [benchmark.pillars, localSelections])

  const handlePillarToggle = (pillarId: string, selected: boolean) => {
    setLocalSelections((prev) =>
      prev.map((item) =>
        item.pillarId === pillarId ? { ...item, selected } : item,
      ),
    )
  }

  const handleContinue = async () => {
    setSelections(localSelections)
    if (sessionStorage.getItem('inviteToken')) {
      const inviteToken = sessionStorage.getItem('inviteToken')
      await apiClient.patch(`/api/invite/${inviteToken}`, {
        selections: localSelections,
      })
    }

    const firstSelected = benchmark.pillars.find((pillar) =>
      localSelections.some(
        (item) => item.pillarId === pillar.id && item.selected,
      ),
    )
    if (firstSelected) {
      const firstMetric = firstSelected.metrics[0]
      if (firstMetric) {
        navigate(`/assessment/${firstSelected.id}/${firstMetric.id}`)
        return
      }
    }
    navigate('/assessment/none/none')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modules</CardTitle>
        <p className="text-sm text-muted-foreground">
          Confirm the modules to include in this assessment.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {selectedPillars.map(({ pillar, checked }) => (
            <label
              key={pillar.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 p-3 text-sm"
            >
              <div>
                <div className="font-medium">{pillar.name}</div>
                <p className="text-xs text-muted-foreground">
                  {pillar.metrics.length} metrics ·{' '}
                  {pillar.metrics.reduce(
                    (sum, metric) => sum + metric.questions.length,
                    0,
                  )}{' '}
                  questions
                </p>
              </div>
              <Checkbox
                checked={checked}
                onCheckedChange={(value) =>
                  handlePillarToggle(pillar.id, Boolean(value))
                }
              />
            </label>
          ))}
        </div>
      </CardContent>
      <div className="flex flex-wrap gap-3 px-6 pb-6">
        <Button onClick={handleContinue}>Start Modules</Button>
        <Button variant="secondary" onClick={() => navigate('/qualify')}>
          Back
        </Button>
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

export default Modules

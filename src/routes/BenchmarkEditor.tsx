import { useState } from 'react'
import { useBenchmark } from '../state/benchmarkStore'
import type { Benchmark } from '../data/benchmark'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const BenchmarkEditor = () => {
  const { benchmark, setBenchmark } = useBenchmark()
  const [draft, setDraft] = useState<Benchmark>(benchmark)

  const updatePillar = (pillarId: string, updates: Partial<Benchmark['pillars'][0]>) => {
    setDraft((prev) => ({
      ...prev,
      pillars: prev.pillars.map((pillar) =>
        pillar.id === pillarId ? { ...pillar, ...updates } : pillar,
      ),
    }))
  }

  const updateMetric = (
    pillarId: string,
    metricId: string,
    updates: Partial<Benchmark['pillars'][0]['metrics'][0]>,
  ) => {
    setDraft((prev) => ({
      ...prev,
      pillars: prev.pillars.map((pillar) =>
        pillar.id === pillarId
          ? {
              ...pillar,
              metrics: pillar.metrics.map((metric) =>
                metric.id === metricId ? { ...metric, ...updates } : metric,
              ),
            }
          : pillar,
      ),
    }))
  }

  const addPillar = () => {
    const id = `pillar-${Date.now()}`
    setDraft((prev) => ({
      ...prev,
      pillars: [
        ...prev.pillars,
        {
          id,
          name: 'New Pillar',
          description: 'Describe the pillar.',
          weight: 1,
          metrics: [
            {
              id: `metric-${Date.now()}`,
              name: 'New Metric',
              description: 'Describe the metric.',
              weight: 1,
              labels: ['Ad-hoc', 'Basic', 'Defined', 'Advanced', 'Leading'],
            },
          ],
        },
      ],
    }))
  }

  const addMetric = (pillarId: string) => {
    setDraft((prev) => ({
      ...prev,
      pillars: prev.pillars.map((pillar) =>
        pillar.id === pillarId
          ? {
              ...pillar,
              metrics: [
                ...pillar.metrics,
                {
                  id: `metric-${Date.now()}`,
                  name: 'New Metric',
                  description: 'Describe the metric.',
                  weight: 1,
                  labels: ['Ad-hoc', 'Basic', 'Defined', 'Advanced', 'Leading'],
                },
              ],
            }
          : pillar,
      ),
    }))
  }

  const removePillar = (pillarId: string) => {
    setDraft((prev) => ({
      ...prev,
      pillars: prev.pillars.filter((pillar) => pillar.id !== pillarId),
    }))
  }

  const removeMetric = (pillarId: string, metricId: string) => {
    setDraft((prev) => ({
      ...prev,
      pillars: prev.pillars.map((pillar) =>
        pillar.id === pillarId
          ? {
              ...pillar,
              metrics: pillar.metrics.filter((metric) => metric.id !== metricId),
            }
          : pillar,
      ),
    }))
  }

  const handleSave = () => {
    setBenchmark(draft)
  }

  const handleReset = () => {
    setDraft(benchmark)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Benchmark Editor</CardTitle>
        <p className="text-sm text-muted-foreground">
          Edit pillars, metrics, weights, and slider labels. Changes apply immediately
          when saved.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={addPillar}>Add Pillar</Button>

        <div className="space-y-6">
          {draft.pillars.map((pillar) => (
            <Card key={pillar.id} className="border-muted">
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{pillar.name}</h3>
                  <Button variant="outline" onClick={() => removePillar(pillar.id)}>
                    Remove Pillar
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={pillar.name}
                      onChange={(event) =>
                        updatePillar(pillar.id, { name: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.1}
                      value={pillar.weight}
                      onChange={(event) =>
                        updatePillar(pillar.id, { weight: Number(event.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={2}
                      value={pillar.description}
                      onChange={(event) =>
                        updatePillar(pillar.id, { description: event.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-base font-semibold">Metrics</h4>
                  <Button variant="secondary" onClick={() => addMetric(pillar.id)}>
                    Add Metric
                  </Button>
                </div>

                <div className="space-y-4">
                  {pillar.metrics.map((metric) => (
                    <Card key={metric.id} className="border-muted">
                      <CardContent className="space-y-4 pt-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h5 className="text-base font-semibold">{metric.name}</h5>
                          <Button
                            variant="outline"
                            onClick={() => removeMetric(pillar.id, metric.id)}
                          >
                            Remove Metric
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                              value={metric.name}
                              onChange={(event) =>
                                updateMetric(pillar.id, metric.id, {
                                  name: event.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Weight</Label>
                            <Input
                              type="number"
                              min={0}
                              step={0.1}
                              value={metric.weight}
                              onChange={(event) =>
                                updateMetric(pillar.id, metric.id, {
                                  weight: Number(event.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Description</Label>
                            <Textarea
                              rows={2}
                              value={metric.description}
                              onChange={(event) =>
                                updateMetric(pillar.id, metric.id, {
                                  description: event.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Slider Labels (1-5)</Label>
                            <div className="grid gap-3 md:grid-cols-2">
                              {metric.labels.map((label, index) => (
                                <Input
                                  key={`${metric.id}-${index}`}
                                  value={label}
                                  onChange={(event) => {
                                    const nextLabels = [...metric.labels]
                                    nextLabels[index] = event.target.value
                                    updateMetric(pillar.id, metric.id, {
                                      labels: nextLabels as typeof metric.labels,
                                    })
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <div className="flex flex-wrap gap-3 px-6 pb-6">
        <Button onClick={handleSave}>Save Benchmark</Button>
        <Button variant="secondary" onClick={handleReset}>
          Reset Changes
        </Button>
      </div>
    </Card>
  )
}

export default BenchmarkEditor

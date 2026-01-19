import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { questions } from '../data/questions'
import { useBenchmark } from '../state/benchmarkStore'
import { useAssessment } from '../state/assessmentStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const Qualify = () => {
  const navigate = useNavigate()
  const { benchmark } = useBenchmark()
  const { setSelections, resetAssessment } = useAssessment()
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const pillarRecommendations = useMemo(() => {
    const recommendations = new Set<string>()
    questions.forEach((question) => {
      const selected = answers[question.id]
      const option = question.options.find((item) => item.value === selected)
      option?.recommendedPillars.forEach((pillarId) => recommendations.add(pillarId))
    })
    return recommendations
  }, [answers])

  const handleNext = () => {
    const selections = benchmark.pillars.flatMap((pillar) =>
      pillar.metrics.map((metric) => ({
        pillarId: pillar.id,
        metricId: metric.id,
        selected: pillarRecommendations.has(pillar.id),
      })),
    )

    setSelections(selections)
    navigate('/modules')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Qualification</CardTitle>
        <p className="text-sm text-muted-foreground">
          Answer a few questions to pre-select the modules that matter most.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <Label>{question.prompt}</Label>
            {question.helper && (
              <p className="text-xs text-muted-foreground">{question.helper}</p>
            )}
            <Select
              value={answers[question.id] ?? ''}
              onValueChange={(value) =>
                setAnswers((prev) => ({ ...prev, [question.id]: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an answer" />
              </SelectTrigger>
              <SelectContent>
                {question.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
      <div className="flex flex-wrap gap-3 px-6 pb-6">
        <Button onClick={handleNext}>Continue</Button>
        <Button variant="secondary" onClick={() => navigate('/company')}>
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

export default Qualify

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { questions } from '../data/questions'
import { useBenchmark } from '../state/benchmarkStore'
import { useAssessment } from '../state/assessmentStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const Questions = () => {
  const navigate = useNavigate()
  const { benchmark } = useBenchmark()
  const { assessment, setProfile, setSelections } = useAssessment()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [profile, updateProfile] = useState(assessment.profile)

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

    setProfile(profile)
    setSelections(selections)
    navigate('/assessment')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guided Questions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Answer a few questions to pre-select the modules that matter most.
        </p>
      </CardHeader>
      <CardContent className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={profile.companyName}
              onChange={(event) =>
                updateProfile((prev) => ({ ...prev, companyName: event.target.value }))
              }
              placeholder="Acme Corp"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={profile.industry}
              onChange={(event) =>
                updateProfile((prev) => ({ ...prev, industry: event.target.value }))
              }
              placeholder="Fintech, Healthcare, SaaS"
            />
          </div>
          <div className="space-y-2">
            <Label>Company Size</Label>
            <Select
              value={profile.size}
              onValueChange={(value) => updateProfile((prev) => ({ ...prev, size: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">Startup (1-100)</SelectItem>
                <SelectItem value="mid">Mid-market (100-1000)</SelectItem>
                <SelectItem value="enterprise">Enterprise (1000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={4}
              value={profile.notes}
              onChange={(event) =>
                updateProfile((prev) => ({ ...prev, notes: event.target.value }))
              }
              placeholder="Add any context for this assessment."
            />
          </div>
        </div>

        <div className="space-y-4">
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
        </div>
      </CardContent>
      <div className="flex flex-wrap gap-3 px-6 pb-6">
        <Button onClick={handleNext}>Continue to Modules</Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    </Card>
  )
}

export default Questions

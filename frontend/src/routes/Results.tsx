import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useBenchmark } from '../state/benchmarkStore'
import { useAssessment } from '../state/assessmentStore'
import { calculateScores } from '../utils/scoring'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/lib/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const Results = () => {
  const navigate = useNavigate()
  const { benchmark } = useBenchmark()
  const { assessment, resetAssessment } = useAssessment()

  const summary = useMemo(
    () => calculateScores(benchmark, assessment.selections, assessment.scores),
    [benchmark, assessment],
  )

  useEffect(() => {
    if (!sessionStorage.getItem('inviteToken')) return
    const inviteToken = sessionStorage.getItem('inviteToken')
    void apiClient.patch(`/api/invite/${inviteToken}`, {
      scores: assessment.scores,
      progress: {
        completedMetrics: assessment.scores.length,
        totalMetrics: assessment.scores.length,
        percent: 100,
        updatedAt: new Date().toISOString(),
      },
      status: 'completed',
    })
  }, [assessment.scores])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Results</CardTitle>
        <p className="text-sm text-muted-foreground">
          Summary for {assessment.profile.companyName || 'your company'}.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-muted/40 p-6">
          <div>
            <div className="text-3xl font-semibold">
              {summary.compositeScore.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Composite Score</div>
          </div>
          <div>
            <Badge variant="secondary" className="text-base">
              {summary.maturityBand}
            </Badge>
            <div className="text-sm text-muted-foreground">Maturity Band</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Pillar Scores</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.pillarScores} layout="vertical">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="pillarName" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="score" fill="#0ea5e9" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Metric Scores</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Question Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessment.scores.map((score) => {
                const pillar = benchmark.pillars.find(
                  (item) => item.id === score.pillarId,
                )
                const metric = pillar?.metrics.find((item) => item.id === score.metricId)
                const average = score.score
                const questionCount = metric?.questions.length ?? score.responses?.length ?? 0
                return (
                  <TableRow key={score.metricId}>
                    <TableCell>{metric?.name ?? score.metricId}</TableCell>
                    <TableCell>{average.toFixed(1)}</TableCell>
                    <TableCell>{questionCount} questions</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <div className="flex flex-wrap gap-3 px-6 pb-6">
        <Button variant="secondary" onClick={() => navigate('/modules')}>
          Back to Modules
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

export default Results

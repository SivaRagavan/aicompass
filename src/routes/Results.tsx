import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useBenchmark } from '../state/benchmarkStore'
import { useAssessment } from '../state/assessmentStore'
import { calculateScores } from '../utils/scoring'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const Results = () => {
  const { benchmark } = useBenchmark()
  const { assessment } = useAssessment()

  const summary = useMemo(
    () => calculateScores(benchmark, assessment.selections, assessment.scores),
    [benchmark, assessment],
  )

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
          <h3 className="text-lg font-semibold">Metric Notes</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessment.scores.map((score) => {
                const pillar = benchmark.pillars.find(
                  (item) => item.id === score.pillarId,
                )
                const metric = pillar?.metrics.find((item) => item.id === score.metricId)
                return (
                  <TableRow key={score.metricId}>
                    <TableCell>{metric?.name ?? score.metricId}</TableCell>
                    <TableCell>{score.score}</TableCell>
                    <TableCell>{score.notes || '-'}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <div className="flex flex-wrap gap-3 px-6 pb-6">
        <Button asChild variant="secondary">
          <Link to="/assessment">Back to Scoring</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Start New Assessment</Link>
        </Button>
      </div>
    </Card>
  )
}

export default Results

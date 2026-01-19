import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/state/authStore'
import { apiClient } from '@/lib/api'

type AssessmentSummary = {
  _id: string
  companyName: string
  inviteToken: string
  inviteExpiresAt: string
  status: string
  progress?: {
    percent: number
  }
}

const Dashboard = () => {
  const { user, refresh } = useAuth()
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([])
  const [companyName, setCompanyName] = useState('')
  const [companyIndustry, setCompanyIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [inviteDays, setInviteDays] = useState('30')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    refresh()
  }, [refresh])

  const loadAssessments = async () => {
    const response = await apiClient.get<{ assessments: AssessmentSummary[] }>(
      '/api/assessments',
    )
    if (response.data) {
      setAssessments(response.data.assessments)
    }
  }

  useEffect(() => {
    if (!user) return
    loadAssessments()
  }, [user])

  const handleCreate = async () => {
    setError(null)
    setIsSubmitting(true)
    const response = await apiClient.post<{ id: string; inviteToken: string }>(
      '/api/assessments',
      {
        companyName,
        companyIndustry,
        companySize,
        inviteDays: Number(inviteDays || 30),
      },
    )
    setIsSubmitting(false)
    if (response.error) {
      setError(response.error)
      return
    }
    setCompanyName('')
    setCompanyIndustry('')
    setCompanySize('')
    setInviteDays('30')
    loadAssessments()
  }

  const baseUrl = useMemo(() => {
    return window.location.origin
  }, [])

  if (!user) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <p className="text-sm text-muted-foreground">
            Log in to create assessments and invite executives.
          </p>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/auth">Go to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Portfolio Assessments</h1>
        <p className="text-sm text-muted-foreground">
          Track AI maturity across portfolio companies and invite executives to respond.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a new assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="Northbridge Manufacturing"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyIndustry">Industry</Label>
              <Input
                id="companyIndustry"
                value={companyIndustry}
                onChange={(event) => setCompanyIndustry(event.target.value)}
                placeholder="Industrial goods"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size</Label>
              <Input
                id="companySize"
                value={companySize}
                onChange={(event) => setCompanySize(event.target.value)}
                placeholder="500-1000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inviteDays">Invite expires in (days)</Label>
            <Input
              id="inviteDays"
              value={inviteDays}
              onChange={(event) => setInviteDays(event.target.value)}
              placeholder="30"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleCreate} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create assessment'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active assessments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assessments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assessments yet.</p>
          ) : (
            assessments.map((assessment) => (
              <div
                key={assessment._id}
                className="space-y-2 rounded-md border border-border p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{assessment.companyName}</div>
                    <p className="text-xs text-muted-foreground">
                      Invite expires {new Date(assessment.inviteExpiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/invite/${assessment.inviteToken}`}>Preview</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        await apiClient.patch(`/api/assessments/${assessment._id}`, {
                          status: 'cancelled',
                        })
                        loadAssessments()
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Progress: {assessment.progress?.percent ?? 0}% · Status: {assessment.status}
                </div>
                <div className="text-xs text-muted-foreground">
                  Invite link:{' '}
                  <span className="font-mono">
                    {baseUrl}/invite/{assessment.inviteToken}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

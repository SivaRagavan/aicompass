import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiClient } from '@/lib/api'
import { useAssessment } from '@/state/assessmentStore'

const Invite = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { assessment, setProfile, setSelections, setScores } = useAssessment()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inviteLoaded, setInviteLoaded] = useState(false)

  const inviteToken = token ?? ''

  const loadInvite = async () => {
    setLoading(true)
    const response = await apiClient.get<{ assessment: any }>(`/api/invite/${inviteToken}`)
    if (response.error || !response.data) {
      setError(response.error ?? 'Invite not found.')
      setLoading(false)
      return
    }

    const invite = response.data.assessment
    sessionStorage.setItem('inviteToken', inviteToken)
    setProfile({
      ...assessment.profile,
      companyName: invite.companyName ?? '',
      industry: invite.companyIndustry ?? '',
      size: invite.companySize ?? '',
      execName: invite.execProfile?.name ?? '',
      execTitle: invite.execProfile?.title ?? '',
      execEmail: invite.execProfile?.email ?? '',
    })
    if (invite.selections) setSelections(invite.selections)
    if (invite.scores) setScores(invite.scores)

    setInviteLoaded(true)
    setLoading(false)
  }

  useEffect(() => {
    if (!inviteToken) return
    loadInvite()
  }, [inviteToken])

  const canStart = useMemo(() => {
    return (
      assessment.profile.execName &&
      assessment.profile.execTitle &&
      assessment.profile.execEmail
    )
  }, [assessment.profile.execEmail, assessment.profile.execName, assessment.profile.execTitle])

  const handleContinue = async () => {
    const response = await apiClient.patch(`/api/invite/${inviteToken}`, {
      companyName: assessment.profile.companyName,
      execProfile: {
        name: assessment.profile.execName,
        title: assessment.profile.execTitle,
        email: assessment.profile.execEmail,
      },
      progress: {
        completedMetrics: 0,
        totalMetrics: 0,
        percent: 0,
        updatedAt: new Date().toISOString(),
      },
    })
    if (response.error) {
      setError(response.error)
      return
    }
    navigate('/company')
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading invite...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invite unavailable</CardTitle>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardHeader>
      </Card>
    )
  }

  if (!inviteLoaded) return null

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Executive profile</CardTitle>
        <p className="text-sm text-muted-foreground">
          Confirm your details before completing the assessment for the PE sponsor.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company name</Label>
          <Input
            id="companyName"
            value={assessment.profile.companyName}
            onChange={(event) =>
              setProfile({ ...assessment.profile, companyName: event.target.value })
            }
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="execName">Your name</Label>
            <Input
              id="execName"
              value={assessment.profile.execName}
              onChange={(event) =>
                setProfile({ ...assessment.profile, execName: event.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="execTitle">Title</Label>
            <Input
              id="execTitle"
              value={assessment.profile.execTitle}
              onChange={(event) =>
                setProfile({ ...assessment.profile, execTitle: event.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="execEmail">Work email</Label>
          <Input
            id="execEmail"
            type="email"
            value={assessment.profile.execEmail}
            onChange={(event) =>
              setProfile({ ...assessment.profile, execEmail: event.target.value })
            }
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={handleContinue} disabled={!canStart}>
          Continue to assessment
        </Button>
      </CardContent>
    </Card>
  )
}

export default Invite

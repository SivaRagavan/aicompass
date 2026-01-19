import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../state/assessmentStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { industries } from '../data/industries'
import { apiClient } from '@/lib/api'

const Company = () => {
  const navigate = useNavigate()
  const { assessment, setProfile, resetAssessment } = useAssessment()
  const profile = assessment.profile

  const handleContinue = async () => {
    if (sessionStorage.getItem('inviteToken')) {
      const inviteToken = sessionStorage.getItem('inviteToken')
      await apiClient.patch(`/api/invite/${inviteToken}`, {
        companyName: profile.companyName,
        companyIndustry: profile.industry,
        companySize: profile.size,
      })
    }
    navigate('/qualify')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Confirm the company information before moving into the assessment.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={profile.companyName}
            onChange={(event) =>
              setProfile({ ...profile, companyName: event.target.value })
            }
            placeholder="Acme Corp"
          />
        </div>
        <div className="space-y-2">
          <Label>Industry</Label>
          <Select
            value={profile.industry}
            onValueChange={(value) => setProfile({ ...profile, industry: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Company Size</Label>
          <Select
            value={profile.size}
            onValueChange={(value) => setProfile({ ...profile, size: value })}
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
      </CardContent>
      <div className="flex flex-wrap gap-3 px-6 pb-6">
        <Button onClick={handleContinue}>Continue</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
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

export default Company

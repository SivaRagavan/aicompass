import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/state/authStore'

const Auth = () => {
  const navigate = useNavigate()
  const { user, login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [navigate, user])

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)
    const action = mode === 'login' ? login : register
    const result = await action(email, password)
    setIsSubmitting(false)
    if (result) {
      setError(result)
      return
    }
    navigate('/dashboard')
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Sign in' : 'Create account'}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {mode === 'login'
            ? 'Access your private equity portfolio assessments.'
            : 'Create a PE firm account to manage assessments.'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="you@firm.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Auth

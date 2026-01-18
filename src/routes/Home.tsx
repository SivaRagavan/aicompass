import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Home = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Adoption Benchmark</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Score a single company’s AI adoption journey with a modular, editable benchmark.
          Start with guided questions to pick the relevant modules, then score each area
          on a five-point scale.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/questions">Start Assessment</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/benchmark">Edit Benchmark</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Home

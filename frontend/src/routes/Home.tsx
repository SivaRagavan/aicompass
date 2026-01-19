import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const Home = () => {
  return (
    <div className="mx-auto mt-10 max-w-5xl px-4">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">
            Private equity AI readiness, portfolio-wide
          </h1>
          <p className="text-muted-foreground">
            Equip deal teams with consistent AI maturity reviews across portfolio companies.
            Create an assessment, invite executives to complete it, and track progress in a
            shared dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/auth">Get started</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          <div className="text-base font-medium text-foreground">Why PE teams use it</div>
          <ul className="mt-3 list-disc space-y-1 pl-4">
            <li>Standardize AI diligence across every portfolio company.</li>
            <li>Surface gaps in talent, data, governance, and tooling quickly.</li>
            <li>Share clear progress with operating partners and deal teams.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/state/authStore'
import { Button } from '@/components/ui/button'

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-lg font-semibold">
            AI Compass
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={logout}>
                  Sign out
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full min-w-[768px] max-w-6xl px-6 py-10">
        {children}
      </main>
    </div>
  )
}

export default Layout

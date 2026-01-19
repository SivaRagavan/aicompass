import { createContext, useContext, useMemo, useState } from 'react'
import { defaultBenchmark, type Benchmark } from '../data/benchmark'

const STORAGE_KEY = 'ai-benchmark-schema'

type BenchmarkContextValue = {
  benchmark: Benchmark
  setBenchmark: (benchmark: Benchmark) => void
}

const BenchmarkContext = createContext<BenchmarkContextValue | undefined>(
  undefined,
)

export const BenchmarkProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [benchmark, setBenchmarkState] = useState<Benchmark>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored) as Benchmark
      } catch {
        return defaultBenchmark
      }
    }
    return defaultBenchmark
  })

  const setBenchmark = (next: Benchmark) => {
    setBenchmarkState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const value = useMemo(() => ({ benchmark, setBenchmark }), [benchmark])

  return (
    <BenchmarkContext.Provider value={value}>
      {children}
    </BenchmarkContext.Provider>
  )
}

export const useBenchmark = () => {
  const context = useContext(BenchmarkContext)
  if (!context) {
    throw new Error('useBenchmark must be used within BenchmarkProvider')
  }
  return context
}

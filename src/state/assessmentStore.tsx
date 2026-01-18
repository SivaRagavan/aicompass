import { createContext, useContext, useMemo, useState } from 'react'

export type AssessmentProfile = {
  companyName: string
  industry: string
  size: string
  notes: string
}

export type MetricSelection = {
  metricId: string
  pillarId: string
  selected: boolean
}

export type MetricScore = {
  metricId: string
  pillarId: string
  score: number
  notes: string
}

export type AssessmentState = {
  profile: AssessmentProfile
  selections: MetricSelection[]
  scores: MetricScore[]
}

const defaultProfile: AssessmentProfile = {
  companyName: '',
  industry: '',
  size: '',
  notes: '',
}

const defaultState: AssessmentState = {
  profile: defaultProfile,
  selections: [],
  scores: [],
}

type AssessmentContextValue = {
  assessment: AssessmentState
  setProfile: (profile: AssessmentProfile) => void
  setSelections: (selections: MetricSelection[]) => void
  setScores: (scores: MetricScore[]) => void
  resetAssessment: () => void
}

const AssessmentContext = createContext<AssessmentContextValue | undefined>(
  undefined,
)

export const AssessmentProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [assessment, setAssessment] = useState<AssessmentState>(defaultState)

  const setProfile = (profile: AssessmentProfile) => {
    setAssessment((prev) => ({ ...prev, profile }))
  }

  const setSelections = (selections: MetricSelection[]) => {
    setAssessment((prev) => ({ ...prev, selections }))
  }

  const setScores = (scores: MetricScore[]) => {
    setAssessment((prev) => ({ ...prev, scores }))
  }

  const resetAssessment = () => {
    setAssessment(defaultState)
  }

  const value = useMemo(
    () => ({ assessment, setProfile, setSelections, setScores, resetAssessment }),
    [assessment],
  )

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  )
}

export const useAssessment = () => {
  const context = useContext(AssessmentContext)
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider')
  }
  return context
}

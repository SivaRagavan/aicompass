export type User = {
  _id?: string
  email: string
  passwordHash: string
  createdAt: Date
}

export type ExecProfile = {
  name: string
  title: string
  email: string
}

export type Assessment = {
  _id?: string
  ownerId: string
  companyName: string
  companyIndustry?: string
  companySize?: string
  inviteToken: string
  inviteExpiresAt: Date
  status: 'active' | 'cancelled' | 'completed'
  execProfile?: ExecProfile
  selections?: unknown
  scores?: unknown
  responses?: unknown
  progress?: {
    completedMetrics: number
    totalMetrics: number
    percent: number
    updatedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

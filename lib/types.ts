export type Status =
  | 'APPLIED'
  | 'PHONE_SCREEN'
  | 'INTERVIEW'
  | 'TECHNICAL'
  | 'FINAL_INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN'

export interface Application {
  id: string
  company: string
  role: string
  location?: string | null
  salary?: string | null
  jobUrl?: string | null
  status: Status
  notes?: string | null
  appliedAt: string
  updatedAt: string
  events?: Event[]
}

export interface Event {
  id: string
  applicationId: string
  status: Status
  note?: string | null
  createdAt: string
}

export interface Stats {
  total: number
  byStatus: Record<Status, number>
  weeklyApplications: { week: string; count: number }[]
  responseRate: number
  interviewRate: number
  offerRate: number
  avgDaysToResponse: number
}

export const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bg: string; border: string; darkBg: string; darkBorder: string; step: number }
> = {
  APPLIED: {
    label: 'Applied',
    color: '#6B7280',
    bg: '#F3F4F6',
    border: '#D1D5DB',
    darkBg: '#27272a',
    darkBorder: '#3f3f46',
    step: 1,
  },
  PHONE_SCREEN: {
    label: 'Phone Screen',
    color: '#3B82F6',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    darkBg: '#172554',
    darkBorder: '#1e40af',
    step: 2,
  },
  INTERVIEW: {
    label: 'Interview',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    darkBg: '#2e1065',
    darkBorder: '#5b21b6',
    step: 3,
  },
  TECHNICAL: {
    label: 'Technical',
    color: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FDE68A',
    darkBg: '#422006',
    darkBorder: '#92400e',
    step: 4,
  },
  FINAL_INTERVIEW: {
    label: 'Final Round',
    color: '#EC4899',
    bg: '#FDF2F8',
    border: '#FBCFE8',
    darkBg: '#500724',
    darkBorder: '#9d174d',
    step: 5,
  },
  OFFER: {
    label: 'Offer',
    color: '#10B981',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    darkBg: '#022c22',
    darkBorder: '#065f46',
    step: 6,
  },
  REJECTED: {
    label: 'Rejected',
    color: '#EF4444',
    bg: '#FEF2F2',
    border: '#FECACA',
    darkBg: '#450a0a',
    darkBorder: '#991b1b',
    step: 0,
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    color: '#9CA3AF',
    bg: '#F9FAFB',
    border: '#E5E7EB',
    darkBg: '#1c1917',
    darkBorder: '#44403c',
    step: 0,
  },
}

export const ACTIVE_STATUSES: Status[] = [
  'APPLIED',
  'PHONE_SCREEN',
  'INTERVIEW',
  'TECHNICAL',
  'FINAL_INTERVIEW',
  'OFFER',
]

export const ALL_STATUSES: Status[] = [
  'APPLIED',
  'PHONE_SCREEN',
  'INTERVIEW',
  'TECHNICAL',
  'FINAL_INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
]

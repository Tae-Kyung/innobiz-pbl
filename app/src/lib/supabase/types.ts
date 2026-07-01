export type CompanyStatus = 'registered' | 'diagnosing' | 'interviewing' | 'reporting' | 'planning' | 'completed'

export type DiagnosisArea = 'strategy' | 'organization' | 'people' | 'culture' | 'data' | 'infrastructure' | 'governance'

export interface Company {
  id: string
  name: string
  business_number: string | null
  industry: string | null
  main_products: string | null
  org_chart_url: string | null
  contact_name: string | null
  contact_dept: string | null
  contact_phone: string | null
  contact_email: string | null
  training_center_name: string | null
  address: string | null
  status: CompanyStatus
  created_at: string
  updated_at: string
}

export interface DiagnosisScore {
  id: string
  company_id: string
  area: DiagnosisArea
  item_index: number
  score: number
  diagnosed_at: string | null
  created_at: string
}

export interface Interview {
  id: string
  company_id: string
  area: string
  question_type: string
  question: string
  answer: string | null
  sort_order: number
  interview_date: string | null
  interview_location: string | null
  attendees: Array<{name: string; position: string; org: string}>
  created_at: string
}

export interface WorkflowRedesign {
  id: string
  company_id: string
  department: string
  job_title: string
  duties: Array<{duty: string; as_is: string; to_be: string; required_training: string}>
  expected_effects: string[]
  sort_order: number
  created_at: string
}

export interface ConsultingLog {
  id: string
  company_id: string
  session_number: number
  meeting_date: string | null
  meeting_method: string
  meeting_location: string | null
  attendees: Record<string, string>
  diagnosis_area: string | null
  content: string | null
  is_generated: boolean
  created_at: string
  updated_at: string
}

export interface ConsultingReport {
  id: string
  company_id: string
  report_date: string | null
  content: Record<string, string>
  is_generated: boolean
  created_at: string
  updated_at: string
}

export interface TrainingPlan {
  id: string
  company_id: string
  course_name: string | null
  ncs_code: string | null
  training_hours: number | null
  trainee_count: number | null
  training_job: string | null
  training_goal: string | null
  training_period_start: string | null
  training_period_end: string | null
  content: Record<string, string>
  learning_group: Array<{role: string; type: string; dept: string; position: string; name: string}>
  facilities: Array<{type: string; name: string; spec: string; location: string}>
  instructors: Array<{name: string; type: string; experience: string; job: string; details: string}>
  is_generated: boolean
  created_at: string
  updated_at: string
}

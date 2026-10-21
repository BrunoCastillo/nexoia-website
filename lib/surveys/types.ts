// Contratos de datos del módulo de encuestas. La persistencia real está en Supabase.

export type SurveyStatus = 'draft' | 'active' | 'closed'

export type QuestionType =
  | 'rating_1_5'
  | 'rating_0_10'
  | 'single_choice'
  | 'multiple_choice'
  | 'open_text'

export type SurveyRecord = {
  id: string
  slug: string
  title: string
  description: string | null
  disclaimer: string | null
  institution: string | null
  organization: string | null
  duration_label: string | null
  modality: string | null
  session_count: number | null
  instructor_name: string | null
  status: SurveyStatus
  estimated_minutes: string | null
  starts_on: string | null
  ends_on: string | null
}

export type QuestionRecord = {
  id: string
  survey_id: string
  section_key: string
  section_title: string
  prompt: string
  help_text: string | null
  question_type: QuestionType
  position: number
  is_required: boolean
  metric_key: string | null
  max_length: number | null
}

export type OptionRecord = {
  id: string
  question_id: string
  label: string
  position: number
  allows_free_text: boolean
}

export type AnswerDraft = {
  numeric_value: number | null
  text_value: string
  option_ids: string[]
}

export type AnswerPayloadItem = {
  question_id: string
  numeric_value?: number
  text_value?: string
  option_ids?: string[]
}

export type SurveyBundle = {
  survey: SurveyRecord
  questions: QuestionRecord[]
  options: OptionRecord[]
}

export type ResponseRecord = {
  id: string
  survey_id: string
  submitted_at: string
}

export type StoredAnswer = {
  id: string
  response_id: string
  question_id: string
  numeric_value: number | null
  text_value: string | null
  option_id: string | null
}

export type SubscriberRecord = {
  id: string
  email: string
  name: string | null
  interests: string | null
  consent_version: string
  consented_at: string
  origin_label: string | null
  unsubscribed_at: string | null
}

export type OptionDraft = {
  id: string
  label: string
  allows_free_text: boolean
}

export type QuestionDraft = {
  id: string
  section_key: string
  section_title: string
  prompt: string
  help_text: string
  question_type: QuestionType
  is_required: boolean
  metric_key: string
  options: OptionDraft[]
}

export type SurveyDraft = {
  id: string | null
  slug: string
  title: string
  description: string
  disclaimer: string
  institution: string
  organization: string
  duration_label: string
  modality: string
  session_count: string
  instructor_name: string
  estimated_minutes: string
  starts_on: string
  ends_on: string
  status: SurveyStatus
  questions: QuestionDraft[]
}

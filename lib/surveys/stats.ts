// Calcula indicadores agregados en el navegador del administrador, sin enviar textos a servicios externos.

import { MIN_RESPONSES_FOR_BREAKDOWN } from '@/lib/surveys/constants'
import type { OptionRecord, QuestionRecord, ResponseRecord, StoredAnswer, SubscriberRecord, SurveyRecord } from '@/lib/surveys/types'

export type MetricCard = {
  key: string
  label: string
  value: string
  hint: string
}

export type ChartPoint = {
  label: string
  full_label: string
  value: number
}

export type ChoiceChart = {
  key: string
  title: string
  points: ChartPoint[]
}

export type OpenAnswerGroup = {
  key: string
  prompt: string
  texts: string[]
}

export type DashboardModel = {
  response_count: number
  is_breakdown_visible: boolean
  cards: MetricCard[]
  rating_chart: ChartPoint[]
  score_distribution: ChartPoint[]
  choice_charts: ChoiceChart[]
  nps_distribution: ChartPoint[]
  open_answers: OpenAnswerGroup[]
}

function average(values: number[]): number | null {
  if (values.length === 0) return null
  const total = values.reduce((sum, value) => sum + value, 0)
  return Math.round((total / values.length) * 10) / 10
}

function format_average(value: number | null): string {
  if (value === null) return 'Sin datos'
  return value.toLocaleString('es-EC', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

function short_label(label: string): string {
  if (label.length <= 42) return label
  return `${label.slice(0, 39)}…`
}

function question_by_key(questions: QuestionRecord[], key: string): QuestionRecord | undefined {
  return questions.find((question) => question.metric_key === key)
}

function values_for(questions: QuestionRecord[], answers: StoredAnswer[], keys: string[]): number[] {
  const ids = new Set(questions.filter((question) => question.metric_key && keys.includes(question.metric_key)).map((question) => question.id))
  return answers
    .filter((answer) => ids.has(answer.question_id) && answer.numeric_value !== null)
    .map((answer) => answer.numeric_value as number)
}

function values_for_prefix(questions: QuestionRecord[], answers: StoredAnswer[], prefix: string): number[] {
  const ids = new Set(
    questions.filter((question) => question.metric_key?.startsWith(prefix)).map((question) => question.id),
  )
  return answers
    .filter((answer) => ids.has(answer.question_id) && answer.numeric_value !== null)
    .map((answer) => answer.numeric_value as number)
}

function nps_score(values: number[]): number | null {
  if (values.length === 0) return null
  const promoters = values.filter((value) => value >= 9).length
  const detractors = values.filter((value) => value <= 6).length
  return Math.round(((promoters - detractors) / values.length) * 100)
}

function top_labels(question: QuestionRecord, options: OptionRecord[], answers: StoredAnswer[]): string | null {
  const counts = new Map<string, number>()
  for (const answer of answers) {
    if (answer.question_id !== question.id || !answer.option_id) continue
    counts.set(answer.option_id, (counts.get(answer.option_id) ?? 0) + 1)
  }
  let highest = 0
  counts.forEach((count) => {
    if (count > highest) highest = count
  })
  if (highest === 0) return null
  return options
    .filter((option) => option.question_id === question.id && counts.get(option.id) === highest)
    .sort((left, right) => left.position - right.position)
    .map((option) => option.label)
    .join(' · ')
}

function choice_chart(question: QuestionRecord, options: OptionRecord[], answers: StoredAnswer[]): ChoiceChart {
  const related = options
    .filter((option) => option.question_id === question.id)
    .sort((left, right) => left.position - right.position)
  return {
    key: question.id,
    title: question.prompt,
    points: related.map((option) => {
      const value = answers.filter((answer) => answer.option_id === option.id).length
      return { label: short_label(option.label), full_label: option.label, value }
    }),
  }
}

export function build_dashboard(input: {
  survey: SurveyRecord
  questions: QuestionRecord[]
  options: OptionRecord[]
  responses: ResponseRecord[]
  answers: StoredAnswer[]
  subscribers: SubscriberRecord[]
}): DashboardModel {
  const questions = [...input.questions].sort((left, right) => left.position - right.position)
  const response_count = input.responses.length
  const is_breakdown_visible = response_count >= MIN_RESPONSES_FOR_BREAKDOWN
  const active_subscribers = input.subscribers.filter((subscriber) => !subscriber.unsubscribed_at)
  const origin_subscribers = active_subscribers.filter((subscriber) => subscriber.origin_label === input.survey.title)

  const has_instructor = questions.some((question) => question.metric_key?.startsWith('instructor_'))
  const instructor_values = has_instructor
    ? values_for_prefix(questions, input.answers, 'instructor_')
    : input.answers
        .filter((answer) => {
          const question = questions.find((item) => item.id === answer.question_id)
          return question?.question_type === 'rating_1_5' && answer.numeric_value !== null
        })
        .map((answer) => answer.numeric_value as number)

  const method_values = values_for(questions, input.answers, ['instructor_method'])
  const satisfaction_values = values_for(questions, input.answers, ['expectations'])
  const content_values = values_for(questions, input.answers, ['content_relevance', 'theory_practice_balance', 'materials'])
  const practice_values = values_for(questions, input.answers, ['instructor_practice'])
  const nps_question = question_by_key(questions, 'nps') ?? questions.find((question) => question.question_type === 'rating_0_10')
  const nps_values = nps_question
    ? input.answers
        .filter((answer) => answer.question_id === nps_question.id && answer.numeric_value !== null)
        .map((answer) => answer.numeric_value as number)
    : []

  const topic_question = question_by_key(questions, 'topic_most_useful')
  const improvement_ids = new Set(
    questions
      .filter((question) => question.metric_key === 'improve_content' || question.metric_key === 'improve_future' || (!question.metric_key && question.question_type === 'open_text'))
      .map((question) => question.id),
  )
  const improvement_count = input.answers.filter((answer) => improvement_ids.has(answer.question_id) && answer.text_value?.trim()).length

  const cards: MetricCard[] = [
    {
      key: 'total',
      label: 'Evaluaciones recibidas',
      value: String(response_count),
      hint: input.survey.title,
    },
    {
      key: 'instructor',
      label: has_instructor ? 'Promedio del instructor' : 'Promedio de calificaciones',
      value: format_average(average(instructor_values)),
      hint: 'Escala de 1 a 5',
    },
  ]

  if (question_by_key(questions, 'expectations')) {
    cards.push({
      key: 'satisfaction',
      label: 'Satisfacción general',
      value: format_average(average(satisfaction_values)),
      hint: 'Cumplimiento de expectativas',
    })
  }
  if (question_by_key(questions, 'instructor_method')) {
    cards.push({
      key: 'method',
      label: 'Metodología',
      value: format_average(average(method_values)),
      hint: 'Calificación de la metodología',
    })
  }
  if (content_values.length > 0 || questions.some((question) => ['content_relevance', 'materials', 'theory_practice_balance'].includes(question.metric_key ?? ''))) {
    cards.push({
      key: 'content',
      label: 'Contenidos',
      value: format_average(average(content_values)),
      hint: 'Relevancia, equilibrio y materiales',
    })
  }
  if (question_by_key(questions, 'instructor_practice')) {
    cards.push({
      key: 'practice',
      label: 'Prácticas',
      value: format_average(average(practice_values)),
      hint: 'Utilidad de las demostraciones',
    })
  }
  if (nps_question) {
    const score = nps_score(nps_values)
    cards.push({
      key: 'nps',
      label: 'Recomendación NPS',
      value: score === null ? 'Sin datos' : String(score),
      hint: 'Promotores (9-10) menos detractores (0-6)',
    })
  }
  cards.push({
    key: 'topic',
    label: 'Tema más valorado',
    value: !topic_question ? 'No aplica' : is_breakdown_visible ? (top_labels(topic_question, input.options, input.answers) ?? 'Sin datos') : 'Oculto por privacidad',
    hint: is_breakdown_visible ? 'Opción más elegida' : `Visible desde ${MIN_RESPONSES_FOR_BREAKDOWN} evaluaciones`,
  })
  cards.push({
    key: 'improvements',
    label: 'Oportunidades de mejora',
    value: String(improvement_count),
    hint: 'Comentarios abiertos recibidos',
  })
  cards.push({
    key: 'subscribers',
    label: 'Suscripciones autorizadas',
    value: String(active_subscribers.length),
    hint: origin_subscribers.length > 0 ? `${origin_subscribers.length} mencionan esta capacitación` : 'Lista comercial independiente',
  })

  const rating_chart: ChartPoint[] = questions
    .filter((question) => question.question_type === 'rating_1_5' || question.question_type === 'rating_0_10')
    .map((question) => {
      const values = input.answers
        .filter((answer) => answer.question_id === question.id && answer.numeric_value !== null)
        .map((answer) => answer.numeric_value as number)
      return {
        label: short_label(question.prompt),
        full_label: question.prompt,
        value: average(values) ?? 0,
      }
    })
    .filter((point) => point.value > 0)

  const score_distribution: ChartPoint[] = [1, 2, 3, 4, 5].map((score) => ({
    label: String(score),
    full_label: `Calificación ${score}`,
    value: input.answers.filter((answer) => {
      const question = questions.find((item) => item.id === answer.question_id)
      return question?.question_type === 'rating_1_5' && answer.numeric_value === score
    }).length,
  }))

  const choice_charts = questions
    .filter((question) => question.question_type === 'single_choice' || question.question_type === 'multiple_choice')
    .map((question) => choice_chart(question, input.options, input.answers))

  const nps_distribution: ChartPoint[] = nps_question
    ? Array.from({ length: 11 }, (_, score) => ({
        label: String(score),
        full_label: `Recomendación ${score}`,
        value: input.answers.filter((answer) => answer.question_id === nps_question.id && answer.numeric_value === score).length,
      }))
    : []

  const open_answers: OpenAnswerGroup[] = questions.flatMap((question) => {
    const texts = input.answers
      .filter((answer) => answer.question_id === question.id && answer.text_value?.trim())
      .map((answer) => answer.text_value?.trim() ?? '')
      .filter((text) => text.length > 0)
    if (texts.length === 0) return []
    if (question.question_type !== 'open_text' && !texts.length) return []
    return [{ key: question.id, prompt: question.prompt, texts }]
  })

  return {
    response_count,
    is_breakdown_visible,
    cards,
    rating_chart,
    score_distribution,
    choice_charts,
    nps_distribution,
    open_answers,
  }
}

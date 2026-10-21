// Genera CSV con separador de punto y coma y marca de orden de bytes para Excel en español.

import { RATING_LABELS, options_for } from '@/lib/surveys/presentation'
import type { OptionRecord, QuestionRecord, ResponseRecord, StoredAnswer, SubscriberRecord } from '@/lib/surveys/types'

function protect_cell(value: string): string {
  const normalized = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const guarded = /^[=+\-@]/.test(normalized) ? `'${normalized}` : normalized
  if (/[;"\n]/.test(guarded)) return `"${guarded.replace(/"/g, '""')}"`
  return guarded
}

function format_when(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Guayaquil',
  }).format(date)
}

function answer_cell(input: {
  question: QuestionRecord
  options: OptionRecord[]
  rows: StoredAnswer[]
}): string {
  const { question, rows } = input
  if (question.question_type === 'rating_1_5') {
    const value = rows.find((row) => row.numeric_value !== null)?.numeric_value
    if (value === null || value === undefined) return ''
    return `${value} - ${RATING_LABELS[value] ?? ''}`.trim()
  }
  if (question.question_type === 'rating_0_10') {
    const value = rows.find((row) => row.numeric_value !== null)?.numeric_value
    return value === null || value === undefined ? '' : String(value)
  }
  if (question.question_type === 'open_text') {
    return rows.find((row) => row.text_value)?.text_value ?? ''
  }
  const selected = options_for(input.options, question.id).filter((option) => rows.some((row) => row.option_id === option.id))
  return selected
    .map((option) => {
      const note = rows.find((row) => row.option_id === option.id)?.text_value
      return note ? `${option.label}: ${note}` : option.label
    })
    .join(' | ')
}

export function build_evaluation_csv(input: {
  questions: QuestionRecord[]
  options: OptionRecord[]
  responses: ResponseRecord[]
  answers: StoredAnswer[]
}): string {
  const questions = [...input.questions].sort((left, right) => left.position - right.position)
  const headers = ['codigo_anonimo', 'fecha', ...questions.map((question) => `${question.position}. ${question.prompt}`)]
  const lines = [headers.map(protect_cell).join(';')]
  const ordered = [...input.responses].sort((left, right) => left.submitted_at.localeCompare(right.submitted_at))

  for (const response of ordered) {
    const rows = input.answers.filter((answer) => answer.response_id === response.id)
    const cells = [
      response.id,
      format_when(response.submitted_at),
      ...questions.map((question) => answer_cell({
        question,
        options: input.options,
        rows: rows.filter((row) => row.question_id === question.id),
      })),
    ]
    lines.push(cells.map(protect_cell).join(';'))
  }

  return `\uFEFF${lines.join('\n')}`
}

export function build_subscribers_csv(subscribers: SubscriberRecord[]): string {
  const headers = ['correo', 'nombre', 'intereses', 'version_consentimiento', 'fecha_consentimiento', 'origen', 'fecha_baja']
  const lines = [headers.map(protect_cell).join(';')]
  for (const subscriber of subscribers) {
    lines.push([
      subscriber.email,
      subscriber.name ?? '',
      subscriber.interests ?? '',
      subscriber.consent_version,
      format_when(subscriber.consented_at),
      subscriber.origin_label ?? '',
      subscriber.unsubscribed_at ? format_when(subscriber.unsubscribed_at) : '',
    ].map(protect_cell).join(';'))
  }
  return `\uFEFF${lines.join('\n')}`
}

export function download_text_file(input: { filename: string; content: string }): void {
  const blob = new Blob([input.content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = input.filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

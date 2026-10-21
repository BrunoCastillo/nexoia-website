// Valida el borrador del participante antes de enviarlo. El servidor vuelve a validar.

import { MAX_OPEN_TEXT, MAX_OTHER_TEXT } from '@/lib/surveys/constants'
import type { AnswerDraft, AnswerPayloadItem, OptionRecord, QuestionRecord } from '@/lib/surveys/types'
import { sanitize_text } from '@/lib/surveys/text'
import { options_for } from '@/lib/surveys/presentation'

export function empty_answer(): AnswerDraft {
  return { numeric_value: null, text_value: '', option_ids: [] }
}

export function with_answer_defaults(
  questions: QuestionRecord[],
  current: Record<string, AnswerDraft>,
): Record<string, AnswerDraft> {
  const next: Record<string, AnswerDraft> = {}
  for (const question of questions) {
    next[question.id] = current[question.id] ?? empty_answer()
  }
  return next
}

function range_for(question: QuestionRecord): { min: number; max: number } | null {
  if (question.question_type === 'rating_1_5') return { min: 1, max: 5 }
  if (question.question_type === 'rating_0_10') return { min: 0, max: 10 }
  return null
}

export function validate_question(input: {
  question: QuestionRecord
  options: OptionRecord[]
  draft: AnswerDraft
}): string | null {
  const { question, draft } = input
  const options = options_for(input.options, question.id)
  const range = range_for(question)

  if (range) {
    if (draft.numeric_value === null) {
      return question.is_required ? 'Selecciona una calificación.' : null
    }
    if (!Number.isInteger(draft.numeric_value) || draft.numeric_value < range.min || draft.numeric_value > range.max) {
      return `Selecciona un valor entero entre ${range.min} y ${range.max}.`
    }
    return null
  }

  if (question.question_type === 'open_text') {
    const text = sanitize_text(draft.text_value, MAX_OPEN_TEXT + 1)
    const limit = question.max_length ?? MAX_OPEN_TEXT
    if (!text) return question.is_required ? 'Escribe una respuesta.' : null
    if (text.length > limit) return `El texto supera el máximo de ${limit} caracteres.`
    return null
  }

  const known_ids = new Set(options.map((option) => option.id))
  const selected = draft.option_ids.filter((id, index) => known_ids.has(id) && draft.option_ids.indexOf(id) === index)
  if (question.question_type === 'single_choice' && selected.length > 1) {
    return 'Selecciona solo una opción.'
  }
  if (question.is_required && selected.length === 0) {
    return question.question_type === 'multiple_choice'
      ? 'Selecciona al menos una opción.'
      : 'Selecciona una opción.'
  }
  if (draft.option_ids.some((id) => !known_ids.has(id))) {
    return 'Hay una opción que no corresponde a esta pregunta.'
  }

  const free_option = options.find((option) => option.allows_free_text && selected.includes(option.id))
  if (free_option) {
    const note = sanitize_text(draft.text_value, MAX_OTHER_TEXT + 1)
    if (note.length < 2) return 'Especifica el tema indicado en Otros.'
    if (note.length > MAX_OTHER_TEXT) return `El texto adicional supera los ${MAX_OTHER_TEXT} caracteres.`
  }
  return null
}

export function validate_questions(input: {
  questions: QuestionRecord[]
  options: OptionRecord[]
  answers: Record<string, AnswerDraft>
}): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const question of input.questions) {
    const message = validate_question({
      question,
      options: input.options,
      draft: input.answers[question.id] ?? empty_answer(),
    })
    if (message) errors[question.id] = message
  }
  return errors
}

export function build_submission(input: {
  questions: QuestionRecord[]
  options: OptionRecord[]
  answers: Record<string, AnswerDraft>
}): { ok: true; answers: AnswerPayloadItem[] } | { ok: false; errors: Record<string, string> } {
  const errors = validate_questions(input)
  if (Object.keys(errors).length > 0) return { ok: false, errors }

  const answers: AnswerPayloadItem[] = []
  for (const question of input.questions) {
    const draft = input.answers[question.id] ?? empty_answer()
    if (question.question_type === 'rating_1_5' || question.question_type === 'rating_0_10') {
      if (draft.numeric_value === null) continue
      answers.push({ question_id: question.id, numeric_value: draft.numeric_value })
      continue
    }
    if (question.question_type === 'open_text') {
      const text = sanitize_text(draft.text_value, question.max_length ?? MAX_OPEN_TEXT)
      if (!text) continue
      answers.push({ question_id: question.id, text_value: text })
      continue
    }

    const options = options_for(input.options, question.id)
    const known_ids = new Set(options.map((option) => option.id))
    const option_ids = draft.option_ids.filter((id, index) => known_ids.has(id) && draft.option_ids.indexOf(id) === index)
    if (option_ids.length === 0) continue
    const needs_note = options.some((option) => option.allows_free_text && option_ids.includes(option.id))
    const item: AnswerPayloadItem = { question_id: question.id, option_ids }
    if (needs_note) item.text_value = sanitize_text(draft.text_value, MAX_OTHER_TEXT)
    answers.push(item)
  }

  return { ok: true, answers }
}

// Presenta respuestas y agrupa las preguntas por sección para el formulario por pasos.

import { MAX_OTHER_TEXT } from '@/lib/surveys/constants'
import type { AnswerDraft, OptionRecord, QuestionRecord } from '@/lib/surveys/types'

export const RATING_LABELS: Record<number, string> = {
  1: 'Muy deficiente',
  2: 'Deficiente',
  3: 'Aceptable',
  4: 'Muy bueno',
  5: 'Excelente',
}

export type SurveySection = {
  key: string
  title: string
  questions: QuestionRecord[]
}

export function options_for(options: OptionRecord[], question_id: string): OptionRecord[] {
  return options
    .filter((option) => option.question_id === question_id)
    .sort((left, right) => left.position - right.position)
}

export function group_sections(questions: QuestionRecord[]): SurveySection[] {
  const groups: SurveySection[] = []
  const ordered = [...questions].sort((left, right) => left.position - right.position)
  for (const question of ordered) {
    const current = groups[groups.length - 1]
    if (!current || current.key !== question.section_key) {
      groups.push({
        key: question.section_key,
        title: question.section_title,
        questions: [question],
      })
      continue
    }
    current.questions.push(question)
  }
  return groups
}

export function describe_answer(input: {
  question: QuestionRecord
  options: OptionRecord[]
  draft: AnswerDraft
}): string {
  const { question, draft } = input
  if (question.question_type === 'rating_1_5' && draft.numeric_value !== null) {
    return `${draft.numeric_value} · ${RATING_LABELS[draft.numeric_value] ?? ''}`.trim()
  }
  if (question.question_type === 'rating_0_10' && draft.numeric_value !== null) {
    return String(draft.numeric_value)
  }
  if (question.question_type === 'open_text') {
    return draft.text_value.trim() || 'Sin respuesta'
  }

  const selected = options_for(input.options, question.id).filter((option) => draft.option_ids.includes(option.id))
  if (selected.length === 0) return 'Sin respuesta'
  return selected
    .map((option) => {
      if (option.allows_free_text && draft.text_value.trim()) {
        return `${option.label} ${draft.text_value.trim().slice(0, MAX_OTHER_TEXT)}`
      }
      return option.label
    })
    .join(' · ')
}

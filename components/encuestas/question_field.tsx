'use client'

// Dibuja una pregunta según su tipo: escala, opción única, opción múltiple o texto.

import { MAX_OPEN_TEXT, MAX_OTHER_TEXT } from '@/lib/surveys/constants'
import { options_for, RATING_LABELS } from '@/lib/surveys/presentation'
import type { AnswerDraft, OptionRecord, QuestionRecord } from '@/lib/surveys/types'
import { field_class } from '@/lib/surveys/ui_classes'
import { RatingScale } from '@/components/encuestas/rating_scale'

export function QuestionField({
  question,
  options,
  draft,
  error,
  on_change,
}: {
  question: QuestionRecord
  options: OptionRecord[]
  draft: AnswerDraft
  error: string | null
  on_change: (draft: AnswerDraft) => void
}) {
  const legend_id = `pregunta-${question.id}`
  const error_id = `error-${question.id}`
  const related = options_for(options, question.id)
  const limit = question.question_type === 'open_text' ? question.max_length ?? MAX_OPEN_TEXT : MAX_OTHER_TEXT
  const selected_label = question.question_type === 'rating_1_5' && draft.numeric_value !== null
    ? RATING_LABELS[draft.numeric_value]
    : null

  const toggle_option = (option_id: string, is_single: boolean) => {
    const option_ids = is_single
      ? [option_id]
      : draft.option_ids.includes(option_id)
        ? draft.option_ids.filter((id) => id !== option_id)
        : [...draft.option_ids, option_id]
    const still_needs_note = related.some((option) => option.allows_free_text && option_ids.includes(option.id))
    on_change({ ...draft, option_ids, text_value: still_needs_note ? draft.text_value : '' })
  }

  return (
    <fieldset aria-invalid={error ? true : undefined} aria-describedby={error ? error_id : undefined} className="min-w-0 space-y-3">
      <legend id={legend_id} className="mb-1 text-base font-medium text-white">
        {question.position}. {question.prompt}{' '}
        {!question.is_required && <span className="text-sm font-normal text-gray-400">(opcional)</span>}
      </legend>
      {question.help_text && <p className="text-sm text-gray-400">{question.help_text}</p>}

      {(question.question_type === 'rating_1_5' || question.question_type === 'rating_0_10') && (
        <RatingScale
          name={question.id}
          min={question.question_type === 'rating_1_5' ? 1 : 0}
          max={question.question_type === 'rating_1_5' ? 5 : 10}
          value={draft.numeric_value}
          labelled_by={legend_id}
          on_change={(numeric_value) => on_change({ ...draft, numeric_value })}
        />
      )}
      {selected_label && <p className="text-sm text-primary-300">{selected_label}</p>}

      {question.question_type === 'single_choice' && related.map((option) => (
        <label key={option.id} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-gray-100">
          <input
            type="radio"
            className="mt-1"
            name={question.id}
            checked={draft.option_ids.includes(option.id)}
            onChange={() => toggle_option(option.id, true)}
          />
          <span className="min-w-0 break-words">{option.label}</span>
        </label>
      ))}

      {question.question_type === 'multiple_choice' && related.map((option) => (
        <label key={option.id} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-gray-100">
          <input
            type="checkbox"
            className="mt-1"
            checked={draft.option_ids.includes(option.id)}
            onChange={() => toggle_option(option.id, false)}
          />
          <span className="min-w-0 break-words">{option.label}</span>
        </label>
      ))}

      {related.some((option) => option.allows_free_text && draft.option_ids.includes(option.id)) && (
        <input
          className={field_class}
          value={draft.text_value}
          maxLength={MAX_OTHER_TEXT}
          aria-label="Especifica el otro tema"
          placeholder="Escribe el tema"
          onChange={(event) => on_change({ ...draft, text_value: event.target.value })}
        />
      )}

      {question.question_type === 'open_text' && (
        <div>
          <textarea
            className={`${field_class} min-h-28 resize-y`}
            value={draft.text_value}
            maxLength={limit}
            aria-label={question.prompt}
            onChange={(event) => on_change({ ...draft, text_value: event.target.value })}
          />
          <p className="mt-1 text-right text-xs text-gray-500">{draft.text_value.length}/{limit}</p>
        </div>
      )}

      {error && <p id={error_id} role="alert" className="text-sm text-red-300">{error}</p>}
    </fieldset>
  )
}

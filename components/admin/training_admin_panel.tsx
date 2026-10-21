'use client'

// Crea y publica encuestas. El enlace genérico funciona sin un despliegue nuevo.

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { delete_survey, duplicate_survey, fetch_admin_surveys, fetch_editor_bundle, save_survey } from '@/lib/admin/api'
import { QUESTION_TYPE_LABELS, SECTION_PRESETS } from '@/lib/surveys/constants'
import { build_generic_survey_url, build_public_survey_url } from '@/lib/surveys/links'
import { create_id, to_slug } from '@/lib/surveys/text'
import type { OptionRecord, QuestionDraft, QuestionRecord, QuestionType, SurveyDraft, SurveyRecord, SurveyStatus } from '@/lib/surveys/types'
import { field_class, primary_button_class, secondary_button_class } from '@/lib/surveys/ui_classes'
import { AdminNav } from '@/components/admin/admin_nav'
import { PublicShell } from '@/components/encuestas/public_shell'

function empty_draft(): SurveyDraft {
  return {
    id: null,
    slug: '',
    title: '',
    description: '',
    disclaimer: 'Este formulario es un instrumento de retroalimentación de NexoIA. Las respuestas de evaluación son anónimas y no se vinculan con el correo de suscripción. Los comentarios abiertos son opcionales.',
    institution: '',
    organization: '',
    duration_label: '',
    modality: '',
    session_count: '',
    instructor_name: 'NexoIA',
    estimated_minutes: '4 a 6 minutos',
    starts_on: '',
    ends_on: '',
    status: 'draft',
    questions: [],
  }
}

function blank_option(): QuestionDraft['options'][number] {
  return { id: create_id(), label: '', allows_free_text: false }
}

function to_draft(survey: SurveyRecord, questions: QuestionRecord[], options: OptionRecord[]): SurveyDraft {
  return {
    id: survey.id,
    slug: survey.slug,
    title: survey.title,
    description: survey.description ?? '',
    disclaimer: survey.disclaimer ?? '',
    institution: survey.institution ?? '',
    organization: survey.organization ?? '',
    duration_label: survey.duration_label ?? '',
    modality: survey.modality ?? '',
    session_count: survey.session_count === null ? '' : String(survey.session_count),
    instructor_name: survey.instructor_name ?? '',
    estimated_minutes: survey.estimated_minutes ?? '',
    starts_on: survey.starts_on ?? '',
    ends_on: survey.ends_on ?? '',
    status: survey.status,
    questions: questions.map((question) => ({
      id: question.id,
      section_key: question.section_key,
      section_title: question.section_title,
      prompt: question.prompt,
      help_text: question.help_text ?? '',
      question_type: question.question_type,
      is_required: question.is_required,
      metric_key: question.metric_key ?? '',
      options: options
        .filter((option) => option.question_id === question.id)
        .sort((left, right) => left.position - right.position)
        .map((option) => ({ id: option.id, label: option.label, allows_free_text: option.allows_free_text })),
    })),
  }
}

const STATUS_LABELS: Record<SurveyStatus, string> = {
  draft: 'Borrador',
  active: 'Activa',
  closed: 'Cerrada',
}

export function TrainingAdminPanel() {
  const [surveys, setSurveys] = useState<Array<SurveyRecord & { response_count: number | null }>>([])
  const [draft, setDraft] = useState<SurveyDraft>(empty_draft())
  const [response_count, setResponseCount] = useState<number | null>(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [is_saving, setIsSaving] = useState(false)
  const [duplicate_title, setDuplicateTitle] = useState('')
  const [duplicate_slug, setDuplicateSlug] = useState('')
  const [confirm_delete, setConfirmDelete] = useState(false)
  const canvas_ref = useRef<HTMLCanvasElement>(null)
  const is_locked = Boolean(draft.id) && (response_count === null || response_count > 0)
  const public_url = draft.slug ? build_public_survey_url(to_slug(draft.slug)) : ''
  const generic_url = draft.slug ? build_generic_survey_url(to_slug(draft.slug)) : ''

  const reload = async (survey_id?: string | null) => {
    const result = await fetch_admin_surveys()
    if (!result.ok) {
      setError(result.message)
      return
    }
    setSurveys(result.surveys)
    if (!survey_id) return
    const bundle = await fetch_editor_bundle(survey_id)
    if (!bundle.ok) {
      setError(bundle.message)
      return
    }
    setDraft(to_draft(bundle.survey, bundle.questions, bundle.options))
    setResponseCount(bundle.response_count)
  }

  useEffect(() => {
    reload()
  }, [])

  useEffect(() => {
    let is_active = true
    if (!public_url || !canvas_ref.current) return
    import('qrcode').then((module) => {
      if (!is_active || !canvas_ref.current) return
      return module.toCanvas(canvas_ref.current, public_url, { width: 220, margin: 2 })
    }).catch(() => undefined)
    return () => {
      is_active = false
    }
  }, [draft.id, public_url])

  const update_question = (id: string, patch: Partial<QuestionDraft>) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== id) return question
        const next = { ...question, ...patch }
        if (patch.question_type && patch.question_type !== question.question_type) {
          const is_choice = patch.question_type === 'single_choice' || patch.question_type === 'multiple_choice'
          next.options = is_choice ? (question.options.length >= 2 ? question.options : [blank_option(), blank_option()]) : []
          if (patch.question_type === 'open_text') next.is_required = false
        }
        return next
      }),
    }))
  }

  const persist = async (status: SurveyStatus) => {
    setIsSaving(true)
    setError('')
    setMessage('')
    const result = await save_survey({ draft, status })
    setIsSaving(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setMessage(status === 'active' ? 'Encuesta publicada.' : status === 'closed' ? 'Encuesta cerrada.' : 'Cambios guardados.')
    await reload(result.survey_id)
  }

  const open_survey = async (survey_id: string) => {
    setError('')
    setMessage('')
    setConfirmDelete(false)
    const bundle = await fetch_editor_bundle(survey_id)
    if (!bundle.ok) {
      setError(bundle.message)
      return
    }
    setDraft(to_draft(bundle.survey, bundle.questions, bundle.options))
    setResponseCount(bundle.response_count)
    setDuplicateTitle(`${bundle.survey.title} copia`)
    setDuplicateSlug(`${bundle.survey.slug}-copia`)
  }

  return (
    <PublicShell width="wide">
      <AdminNav />
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Capacitaciones</h1>
          <p className="mt-2 text-gray-300">Las encuestas nuevas usan el enlace /encuestas?curso=identificador y no requieren otro despliegue.</p>
        </header>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={secondary_button_class} onClick={() => { setDraft(empty_draft()); setResponseCount(0); setMessage(''); setError('') }}>Nueva capacitación</button>
          {surveys.map((survey) => (
            <button key={survey.id} type="button" className={secondary_button_class} onClick={() => open_survey(survey.id)}>
              {survey.title} · {STATUS_LABELS[survey.status]}
            </button>
          ))}
        </div>
        {error && <p role="alert" className="text-red-300">{error}</p>}
        {message && <p role="status" className="text-teal-300">{message}</p>}
        <form
          className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5"
          onSubmit={(event) => {
            event.preventDefault()
            persist(draft.id ? draft.status : 'draft')
          }}
        >
          <p className="text-sm text-primary-300">Estado: {STATUS_LABELS[draft.status]}{is_locked ? ' · cuestionario bloqueado porque ya hay respuestas' : ''}</p>
          <label className="block space-y-2 text-sm text-gray-300">Nombre
            <input className={field_class} value={draft.title} maxLength={180} onChange={(event) => setDraft((current) => {
              const next_title = event.target.value
              const previous_auto = to_slug(current.title)
              const should_sync = !current.slug || current.slug === previous_auto
              return { ...current, title: next_title, slug: should_sync ? to_slug(next_title) : current.slug }
            })} />
          </label>
          <label className="block space-y-2 text-sm text-gray-300">Identificador público
            <input className={field_class} value={draft.slug} maxLength={80} disabled={is_locked} onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} />
          </label>
          <label className="block space-y-2 text-sm text-gray-300">Descripción
            <textarea className={`${field_class} min-h-24`} value={draft.description} maxLength={2000} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
          </label>
          <label className="block space-y-2 text-sm text-gray-300">Aviso de la evaluación
            <textarea className={`${field_class} min-h-24`} value={draft.disclaimer} maxLength={2000} onChange={(event) => setDraft((current) => ({ ...current, disclaimer: event.target.value }))} />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-gray-300">Institución<input className={field_class} value={draft.institution} onChange={(event) => setDraft((current) => ({ ...current, institution: event.target.value }))} /></label>
            <label className="space-y-2 text-sm text-gray-300">Organización<input className={field_class} value={draft.organization} onChange={(event) => setDraft((current) => ({ ...current, organization: event.target.value }))} /></label>
            <label className="space-y-2 text-sm text-gray-300">Duración<input className={field_class} value={draft.duration_label} onChange={(event) => setDraft((current) => ({ ...current, duration_label: event.target.value }))} /></label>
            <label className="space-y-2 text-sm text-gray-300">Modalidad<input className={field_class} value={draft.modality} onChange={(event) => setDraft((current) => ({ ...current, modality: event.target.value }))} /></label>
            <label className="space-y-2 text-sm text-gray-300">Sesiones<input className={field_class} inputMode="numeric" value={draft.session_count} onChange={(event) => setDraft((current) => ({ ...current, session_count: event.target.value }))} /></label>
            <label className="space-y-2 text-sm text-gray-300">Instructor<input className={field_class} value={draft.instructor_name} onChange={(event) => setDraft((current) => ({ ...current, instructor_name: event.target.value }))} /></label>
            <label className="space-y-2 text-sm text-gray-300">Inicio<input className={field_class} type="date" value={draft.starts_on} onChange={(event) => setDraft((current) => ({ ...current, starts_on: event.target.value }))} /></label>
            <label className="space-y-2 text-sm text-gray-300">Cierre<input className={field_class} type="date" value={draft.ends_on} onChange={(event) => setDraft((current) => ({ ...current, ends_on: event.target.value }))} /></label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Preguntas</h2>
              {!is_locked && (
                <button type="button" className={secondary_button_class} onClick={() => setDraft((current) => ({ ...current, questions: [...current.questions, { id: create_id(), section_key: 'general', section_title: 'Evaluación general', prompt: '', help_text: '', question_type: 'rating_1_5', is_required: true, metric_key: '', options: [] }] }))}>
                  Agregar pregunta
                </button>
              )}
            </div>
            {is_locked && <p className="text-sm text-amber-100">Ya hay respuestas. Puedes corregir enunciados, pero no el tipo ni las opciones. Duplica la encuesta para una versión nueva.</p>}
            {draft.questions.map((question, index) => (
              <article key={question.id} className="space-y-3 rounded-xl border border-white/10 p-4">
                <div className="flex flex-wrap gap-2">
                  {!is_locked && <button type="button" className={secondary_button_class} onClick={() => {
                    setDraft((current) => {
                      const next = [...current.questions]
                      if (index === 0) return current
                      const [item] = next.splice(index, 1)
                      next.splice(index - 1, 0, item)
                      return { ...current, questions: next }
                    })
                  }}>Subir</button>}
                  {!is_locked && <button type="button" className={secondary_button_class} onClick={() => {
                    setDraft((current) => {
                      const next = [...current.questions]
                      if (index === next.length - 1) return current
                      const [item] = next.splice(index, 1)
                      next.splice(index + 1, 0, item)
                      return { ...current, questions: next }
                    })
                  }}>Bajar</button>}
                  {!is_locked && <button type="button" className={secondary_button_class} onClick={() => setDraft((current) => ({ ...current, questions: current.questions.filter((item) => item.id !== question.id) }))}>Quitar</button>}
                </div>
                <label className="block space-y-2 text-sm text-gray-300">Sección
                  <select className={field_class} value={question.section_key} disabled={is_locked} onChange={(event) => {
                    const preset = SECTION_PRESETS.find((item) => item.key === event.target.value)
                    update_question(question.id, { section_key: event.target.value, section_title: preset?.title ?? question.section_title })
                  }}>
                    {!SECTION_PRESETS.some((item) => item.key === question.section_key) && <option value={question.section_key}>{question.section_title}</option>}
                    {SECTION_PRESETS.map((preset) => <option key={preset.key} value={preset.key}>{preset.title}</option>)}
                  </select>
                </label>
                <label className="block space-y-2 text-sm text-gray-300">Título de la sección
                  <input className={field_class} value={question.section_title} onChange={(event) => update_question(question.id, { section_title: event.target.value })} />
                </label>
                <label className="block space-y-2 text-sm text-gray-300">Enunciado
                  <textarea className={`${field_class} min-h-20`} value={question.prompt} maxLength={500} onChange={(event) => update_question(question.id, { prompt: event.target.value })} />
                </label>
                <label className="block space-y-2 text-sm text-gray-300">Ayuda
                  <input className={field_class} value={question.help_text} maxLength={400} onChange={(event) => update_question(question.id, { help_text: event.target.value })} />
                </label>
                <label className="block space-y-2 text-sm text-gray-300">Tipo
                  <select className={field_class} value={question.question_type} disabled={is_locked} onChange={(event) => update_question(question.id, { question_type: event.target.value as QuestionType })}>
                    {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-200">
                  <input type="checkbox" checked={question.is_required} disabled={is_locked} onChange={(event) => update_question(question.id, { is_required: event.target.checked })} />
                  Obligatoria
                </label>
                <label className="block space-y-2 text-sm text-gray-300">Identificador de indicador (opcional)
                  <input className={field_class} value={question.metric_key} disabled={is_locked} placeholder="expectations" onChange={(event) => update_question(question.id, { metric_key: event.target.value })} />
                </label>
                {(question.question_type === 'single_choice' || question.question_type === 'multiple_choice') && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div key={option.id} className="flex flex-col gap-2 sm:flex-row">
                        <input className={field_class} value={option.label} disabled={is_locked} placeholder="Opción" onChange={(event) => update_question(question.id, { options: question.options.map((item) => item.id === option.id ? { ...item, label: event.target.value } : item) })} />
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <input type="checkbox" checked={option.allows_free_text} disabled={is_locked} onChange={(event) => update_question(question.id, { options: question.options.map((item) => item.id === option.id ? { ...item, allows_free_text: event.target.checked } : item) })} />
                          Otros
                        </label>
                        {!is_locked && <button type="button" className={secondary_button_class} onClick={() => update_question(question.id, { options: question.options.filter((item) => item.id !== option.id) })}>Quitar</button>}
                      </div>
                    ))}
                    {!is_locked && <button type="button" className={secondary_button_class} onClick={() => update_question(question.id, { options: [...question.options, blank_option()] })}>Agregar opción</button>}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className={primary_button_class} disabled={is_saving}>{is_saving ? 'Guardando…' : 'Guardar'}</button>
            <button type="button" className={secondary_button_class} disabled={is_saving} onClick={() => persist('active')}>Activar</button>
            <button type="button" className={secondary_button_class} disabled={is_saving || !draft.id} onClick={() => persist('closed')}>Cerrar encuesta</button>
          </div>
        </form>

        {draft.id && (
          <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-white">Enlace público</h2>
            <p className="break-all text-primary-200">{public_url}</p>
            <p className="break-all text-sm text-gray-400">{generic_url}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={secondary_button_class} onClick={() => navigator.clipboard.writeText(public_url).then(() => setMessage('Enlace copiado.')).catch(() => setError('No se pudo copiar el enlace.'))}>Copiar enlace</button>
              <Link href={`/admin/encuestas?curso=${encodeURIComponent(draft.slug)}`} className={secondary_button_class}>Ver estadísticas</Link>
            </div>
            <canvas ref={canvas_ref} role="img" aria-label="Código QR del enlace público de la encuesta" className="rounded-xl bg-white p-2" />
            <button type="button" className={secondary_button_class} onClick={() => {
              const canvas = canvas_ref.current
              if (!canvas) return
              const anchor = document.createElement('a')
              anchor.href = canvas.toDataURL('image/png')
              anchor.download = `encuesta-${to_slug(draft.slug)}.png`
              anchor.click()
            }}>Descargar QR</button>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input className={field_class} value={duplicate_title} placeholder="Título de la copia" onChange={(event) => setDuplicateTitle(event.target.value)} />
              <input className={field_class} value={duplicate_slug} placeholder="identificador-copia" onChange={(event) => setDuplicateSlug(event.target.value)} />
            </div>
            <button type="button" className={secondary_button_class} onClick={() => {
              if (!draft.id) return
              duplicate_survey({ source_id: draft.id, slug: duplicate_slug, title: duplicate_title }).then(async (result) => {
                if (!result.ok) {
                  setError(result.message)
                  return
                }
                setMessage('Se creó una copia en borrador.')
                await reload(result.survey_id)
              })
            }}>Duplicar encuesta</button>
            {!is_locked && (
              confirm_delete ? (
                <button type="button" className={secondary_button_class} onClick={() => {
                  if (!draft.id) return
                  delete_survey(draft.id).then(async (result) => {
                    if (!result.ok) {
                      setError(result.message)
                      return
                    }
                    setDraft(empty_draft())
                    setConfirmDelete(false)
                    setMessage(result.message)
                    await reload()
                  })
                }}>Confirmar eliminación</button>
              ) : (
                <button type="button" className={secondary_button_class} onClick={() => setConfirmDelete(true)}>Eliminar capacitación</button>
              )
            )}
          </section>
        )}
      </div>
    </PublicShell>
  )
}

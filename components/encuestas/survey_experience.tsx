'use client'

// Formulario público por pasos. Las respuestas se envían a Supabase y no se guardan como resultado final en el navegador.

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CONTACT_EMAIL } from '@/lib/surveys/constants'
import { fetch_public_survey, submit_survey } from '@/lib/surveys/api'
import { availability_message } from '@/lib/surveys/links'
import { describe_answer, group_sections } from '@/lib/surveys/presentation'
import type { AnswerDraft, SurveyBundle } from '@/lib/surveys/types'
import { create_id } from '@/lib/surveys/text'
import { build_submission, empty_answer, validate_questions, with_answer_defaults } from '@/lib/surveys/validation'
import { card_class, primary_button_class, secondary_button_class } from '@/lib/surveys/ui_classes'
import { get_public_config } from '@/lib/supabase/client'
import { NewsletterPanel } from '@/components/encuestas/newsletter_panel'
import { ProgressBar } from '@/components/encuestas/progress_bar'
import { PublicShell } from '@/components/encuestas/public_shell'
import { QuestionField } from '@/components/encuestas/question_field'
import { TurnstileWidget } from '@/components/encuestas/turnstile_widget'

type Phase = 'form' | 'newsletter' | 'done'

type DraftCache = {
  token: string
  answers: Record<string, AnswerDraft>
  phase: Phase
  done_message: string
}

function cache_key(slug: string): string {
  return `nexoia-encuesta-borrador:${slug}`
}

function read_cache(slug: string): DraftCache | null {
  try {
    const raw = sessionStorage.getItem(cache_key(slug))
    if (!raw) return null
    const parsed = JSON.parse(raw) as DraftCache
    if (!parsed?.token || !parsed.answers || !parsed.phase) return null
    return parsed
  } catch {
    return null
  }
}

export function SurveyExperience({ slug }: { slug: string }) {
  const should_reduce_motion = useReducedMotion()
  const site_key = get_public_config()?.turnstile_site_key ?? ''
  const [bundle, setBundle] = useState<SurveyBundle | null>(null)
  const [load_state, setLoadState] = useState<'loading' | 'ready' | 'missing_config' | 'not_found' | 'error'>('loading')
  const [answers, setAnswers] = useState<Record<string, AnswerDraft>>({})
  const [step_index, setStepIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<Phase>('form')
  const [token, setToken] = useState('')
  const [is_hydrated, setIsHydrated] = useState(false)
  const [is_submitting, setIsSubmitting] = useState(false)
  const [submit_error, setSubmitError] = useState('')
  const [done_message, setDoneMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [turnstile_token, setTurnstileToken] = useState('')
  const [reset_key, setResetKey] = useState(0)
  const is_submitting_ref = useRef(false)
  const did_move = useRef(false)
  const heading_ref = useRef<HTMLHeadingElement>(null)
  const error_ref = useRef<HTMLDivElement>(null)
  const on_token = useCallback((value: string) => setTurnstileToken(value), [])

  useEffect(() => {
    const cached = read_cache(slug)
    if (cached) {
      setToken(cached.token)
      setAnswers(cached.answers)
      setPhase(cached.phase)
      setDoneMessage(cached.done_message ?? '')
    } else {
      setToken(create_id())
    }
    setIsHydrated(true)
  }, [slug])

  useEffect(() => {
    let is_active = true
    setLoadState('loading')
    fetch_public_survey(slug).then((result) => {
      if (!is_active) return
      if (!result.ok) {
        setLoadState(result.code === 'missing_config' ? 'missing_config' : result.code === 'not_found' ? 'not_found' : 'error')
        return
      }
      setBundle(result.bundle)
      setAnswers((current) => with_answer_defaults(result.bundle.questions, current))
      setLoadState('ready')
    })
    return () => {
      is_active = false
    }
  }, [slug])

  useEffect(() => {
    if (!is_hydrated || !token) return
    if (phase === 'form' && Object.keys(answers).length === 0) return
    const payload: DraftCache = { token, answers, phase, done_message }
    sessionStorage.setItem(cache_key(slug), JSON.stringify(payload))
  }, [answers, done_message, is_hydrated, phase, slug, token])

  useEffect(() => {
    if (!did_move.current) return
    heading_ref.current?.focus()
  }, [step_index])

  const sections = bundle ? group_sections(bundle.questions) : []
  const steps = [...sections.map((section) => section.title), 'Revisión']
  const is_review = step_index === sections.length
  const current_questions = is_review ? [] : sections[step_index]?.questions ?? []
  const blocked_message = bundle ? availability_message(bundle.survey) : null

  const show_errors = (next_errors: Record<string, string>) => {
    setErrors(next_errors)
    window.setTimeout(() => error_ref.current?.focus(), 0)
  }

  const go_next = () => {
    if (!bundle) return
    const next_errors = validate_questions({
      questions: current_questions,
      options: bundle.options,
      answers,
    })
    if (Object.keys(next_errors).length > 0) {
      show_errors(next_errors)
      return
    }
    did_move.current = true
    setErrors({})
    setStepIndex((current) => Math.min(current + 1, steps.length - 1))
  }

  const go_back = () => {
    did_move.current = true
    setErrors({})
    setStepIndex((current) => Math.max(current - 1, 0))
  }

  const handle_submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!bundle || is_submitting_ref.current) return
    if (!is_review) {
      go_next()
      return
    }
    const submission = build_submission({
      questions: bundle.questions,
      options: bundle.options,
      answers,
    })
    if (!submission.ok) {
      show_errors(submission.errors)
      const first_question = bundle.questions.find((question) => submission.errors[question.id])
      const section_index = sections.findIndex((section) => section.questions.some((question) => question.id === first_question?.id))
      if (section_index >= 0) {
        did_move.current = true
        setStepIndex(section_index)
      }
      return
    }
    if (site_key && !turnstile_token) {
      setSubmitError('Confirma que no eres un sistema automatizado.')
      return
    }
    is_submitting_ref.current = true
    setIsSubmitting(true)
    setSubmitError('')
    const result = await submit_survey({
      slug,
      client_token: token,
      answers: submission.answers,
      honeypot,
      turnstile_token,
    })
    is_submitting_ref.current = false
    setIsSubmitting(false)
    setResetKey((current) => current + 1)
    setTurnstileToken('')
    if (!result.ok) {
      setSubmitError(result.message)
      return
    }
    setPhase('newsletter')
  }

  const reset_for_another = () => {
    sessionStorage.removeItem(cache_key(slug))
    setToken(create_id())
    setAnswers(bundle ? with_answer_defaults(bundle.questions, {}) : {})
    setPhase('form')
    setStepIndex(0)
    setDoneMessage('')
    setErrors({})
  }

  const facts = bundle ? [
    bundle.survey.institution && { label: 'Institución académica', value: bundle.survey.institution },
    bundle.survey.organization && { label: 'Organización participante', value: bundle.survey.organization },
    bundle.survey.duration_label && { label: 'Duración', value: bundle.survey.duration_label },
    bundle.survey.modality && { label: 'Modalidad', value: bundle.survey.modality },
    bundle.survey.session_count !== null && { label: 'Sesiones', value: String(bundle.survey.session_count) },
    bundle.survey.instructor_name && { label: 'Instructor', value: bundle.survey.instructor_name },
  ].filter((item): item is { label: string; value: string } => Boolean(item)) : []

  return (
    <PublicShell>
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-300">NexoIA · Evaluación anónima</p>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            {bundle?.survey.title ?? 'Evaluación de capacitación'}
          </h1>
          {bundle?.survey.description && <p className="text-gray-300">{bundle.survey.description}</p>}
          {facts.length > 0 && (
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-400">{fact.label}</dt>
                  <dd className="text-white">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {bundle?.survey.disclaimer && <p className="rounded-xl border border-primary-500/30 bg-primary-500/10 p-4 text-sm text-gray-200">{bundle.survey.disclaimer}</p>}
        </div>

        {load_state === 'loading' && <p className="text-gray-300">Cargando evaluación…</p>}
        {load_state === 'missing_config' && (
          <div className={card_class}>
            <p className="text-gray-200">Esta evaluación todavía no puede guardarse porque faltan las variables públicas de Supabase. Cuando estén configuradas, las respuestas se almacenarán en la base de datos.</p>
          </div>
        )}
        {load_state === 'not_found' && <p className="text-gray-200">No encontramos una evaluación abierta con este enlace. Si llegaste desde un código QR, pide el enlace actualizado a NexoIA.</p>}
        {load_state === 'error' && <p className="text-red-300">No se pudo cargar la evaluación. Inténtalo más tarde o escribe a {CONTACT_EMAIL}.</p>}

        {load_state === 'ready' && bundle && blocked_message && <div className={card_class}><p className="text-gray-100">{blocked_message}</p></div>}

        {load_state === 'ready' && bundle && !blocked_message && phase === 'form' && (
          <form onSubmit={handle_submit} className={card_class} noValidate>
            <ProgressBar current={step_index + 1} total={steps.length} />
            <motion.div
              key={step_index}
              initial={should_reduce_motion ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: should_reduce_motion ? 0 : 0.25 }}
              className="space-y-6"
            >
              <h2 ref={heading_ref} tabIndex={-1} className="text-2xl font-semibold text-white focus:outline-none">
                {steps[step_index]}
              </h2>
              <p className="text-sm text-gray-400">Tiempo estimado: {bundle.survey.estimated_minutes ?? '4 a 6 minutos'}. Los comentarios abiertos son opcionales.</p>
              {Object.keys(errors).length > 0 && (
                <div ref={error_ref} tabIndex={-1} role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 focus:outline-none">
                  Revisa las preguntas marcadas antes de continuar.
                </div>
              )}
              {is_review ? (
                <dl className="space-y-4">
                  {bundle.questions.map((question) => (
                    <div key={question.id} className="border-b border-white/10 pb-3">
                      <dt className="text-sm text-gray-400">{question.position}. {question.prompt}</dt>
                      <dd className="mt-1 break-words text-white">{describe_answer({ question, options: bundle.options, draft: answers[question.id] ?? empty_answer() })}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                current_questions.map((question) => (
                  <QuestionField
                    key={question.id}
                    question={question}
                    options={bundle.options}
                    draft={answers[question.id] ?? empty_answer()}
                    error={errors[question.id] ?? null}
                    on_change={(draft) => setAnswers((current) => ({ ...current, [question.id]: draft }))}
                  />
                ))
              )}
              {is_review && site_key && <TurnstileWidget site_key={site_key} reset_key={reset_key} on_token={on_token} />}
              <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="survey-hp">No completar</label>
                <input id="survey-hp" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
              </div>
              {submit_error && <p role="alert" className="text-sm text-red-300">{submit_error}</p>}
            </motion.div>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className={secondary_button_class} onClick={go_back} disabled={step_index === 0 || is_submitting}>
                Anterior
              </button>
              {is_review ? (
                <button type="submit" className={primary_button_class} disabled={is_submitting} aria-busy={is_submitting}>
                  {is_submitting ? 'Enviando…' : 'Enviar evaluación'}
                </button>
              ) : (
                <button type="button" className={primary_button_class} onClick={go_next}>Siguiente</button>
              )}
            </div>
          </form>
        )}

        {phase === 'newsletter' && bundle && (
          <div className={card_class}>
            <p className="mb-6 text-teal-300">Tu evaluación ya fue registrada. El siguiente paso es independiente y puedes omitirlo.</p>
            <NewsletterPanel
              origin_label={bundle.survey.title}
              on_skip={() => {
                setDoneMessage('¡Gracias por participar! Tu opinión nos ayudará a mejorar nuestras próximas capacitaciones.')
                setPhase('done')
              }}
              on_done={(message) => {
                setDoneMessage(message)
                setPhase('done')
              }}
            />
          </div>
        )}

        {phase === 'done' && (
          <div className={`${card_class} space-y-4`} role="status">
            <h2 className="text-2xl font-bold text-white">¡Gracias por participar! Tu opinión nos ayudará a mejorar nuestras próximas capacitaciones.</h2>
            {done_message && <p className="text-gray-300">{done_message}</p>}
            <button type="button" className={secondary_button_class} onClick={reset_for_another}>Registrar otra evaluación</button>
          </div>
        )}
      </div>
    </PublicShell>
  )
}

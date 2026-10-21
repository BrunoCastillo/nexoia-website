'use client'

// Panel privado. Los indicadores salen de Supabase y los correos se exportan en un archivo distinto.

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { delete_subscriber, fetch_admin_surveys, fetch_dashboard_data, mark_subscriber_unsubscribed } from '@/lib/admin/api'
import { build_subscribers_csv, build_evaluation_csv, download_text_file } from '@/lib/surveys/export_csv'
import { MIN_RESPONSES_FOR_BREAKDOWN } from '@/lib/surveys/constants'
import { build_dashboard } from '@/lib/surveys/stats'
import type { QuestionRecord, OptionRecord, ResponseRecord, StoredAnswer, SubscriberRecord, SurveyRecord } from '@/lib/surveys/types'
import { card_class, field_class, primary_button_class, secondary_button_class } from '@/lib/surveys/ui_classes'
import { AdminNav } from '@/components/admin/admin_nav'
import { PublicShell } from '@/components/encuestas/public_shell'

const ResultCharts = dynamic(
  () => import('@/components/admin/result_charts').then((module) => module.ResultCharts),
  { ssr: false, loading: () => <p className="text-gray-300">Cargando gráficos…</p> },
)

type DashboardData = {
  survey: SurveyRecord
  questions: QuestionRecord[]
  options: OptionRecord[]
  responses: ResponseRecord[]
  answers: StoredAnswer[]
  subscribers: SubscriberRecord[]
}

export function DashboardPanel({ initial_slug }: { initial_slug: string }) {
  const [surveys, setSurveys] = useState<SurveyRecord[]>([])
  const [selected_id, setSelectedId] = useState('')
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [is_loading, setIsLoading] = useState(true)
  const [confirm_evaluation, setConfirmEvaluation] = useState(false)
  const [confirm_subscribers, setConfirmSubscribers] = useState(false)

  useEffect(() => {
    fetch_admin_surveys().then((result) => {
      if (!result.ok) {
        setError(result.message)
        setIsLoading(false)
        return
      }
      setSurveys(result.surveys)
      const match = result.surveys.find((survey) => survey.slug === initial_slug)
      setSelectedId(match?.id ?? result.surveys[0]?.id ?? '')
      setIsLoading(false)
    })
  }, [initial_slug])

  useEffect(() => {
    if (!selected_id) return
    let is_active = true
    setIsLoading(true)
    fetch_dashboard_data(selected_id).then((result) => {
      if (!is_active) return
      if (!result.ok) {
        setError(result.message)
        setData(null)
      } else {
        setError('')
        setData(result)
      }
      setIsLoading(false)
    })
    return () => {
      is_active = false
    }
  }, [selected_id])

  const model = data ? build_dashboard(data) : null
  const needs_evaluation_warning = Boolean(model && (model.response_count < MIN_RESPONSES_FOR_BREAKDOWN || model.open_answers.length > 0))

  const export_evaluation = () => {
    if (!data) return
    if (needs_evaluation_warning && !confirm_evaluation) {
      setError('Confirma que exportarás comentarios que pueden identificar a participantes de grupos pequeños.')
      return
    }
    download_text_file({
      filename: `evaluacion-${data.survey.slug}.csv`,
      content: build_evaluation_csv(data),
    })
    setNotice('Se descargó el archivo de evaluaciones. No incluye correos.')
    setError('')
  }

  const export_subscribers = () => {
    if (!data) return
    if (!confirm_subscribers) {
      setError('Confirma la exportación de correos antes de descargar la lista comercial.')
      return
    }
    download_text_file({
      filename: 'suscripciones-nexoia.csv',
      content: build_subscribers_csv(data.subscribers),
    })
    setNotice('Se descargó la lista de suscripciones, separada de las evaluaciones.')
    setError('')
  }

  const refresh = () => {
    if (!selected_id) return
    setSelectedId((current) => current)
    fetch_dashboard_data(selected_id).then((result) => {
      if (!result.ok) setError(result.message)
      else setData(result)
    })
  }

  return (
    <PublicShell width="wide">
      <AdminNav />
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Resultados de evaluaciones</h1>
          <p className="text-gray-300">Los promedios salen de la base de datos. Las respuestas abiertas permanecen en este panel.</p>
        </header>
        <label className="block max-w-xl space-y-2 text-sm text-gray-300">
          Capacitación
          <select className={field_class} value={selected_id} onChange={(event) => setSelectedId(event.target.value)}>
            {surveys.map((survey) => (
              <option key={survey.id} value={survey.id}>{survey.title}</option>
            ))}
          </select>
        </label>
        {is_loading && <p className="text-gray-300">Cargando resultados…</p>}
        {error && <p role="alert" className="text-red-300">{error}</p>}
        {notice && <p role="status" className="text-teal-300">{notice}</p>}
        {model && data && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {model.cards.map((card) => (
                <article key={card.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-gray-400">{card.label}</p>
                  <p className="mt-2 break-words text-2xl font-bold text-white">{card.value}</p>
                  <p className="mt-1 text-xs text-gray-400">{card.hint}</p>
                </article>
              ))}
            </div>
            {!model.is_breakdown_visible && (
              <p className="rounded-xl border border-amber-300/30 bg-amber-400/10 p-4 text-sm text-amber-100">
                Hay menos de {MIN_RESPONSES_FOR_BREAKDOWN} evaluaciones. No se muestran distribuciones ni comparaciones por opción para reducir el riesgo de identificación indirecta.
              </p>
            )}
            {model.is_breakdown_visible && (
              <ResultCharts
                rating_chart={model.rating_chart}
                score_distribution={model.score_distribution}
                choice_charts={model.choice_charts}
                nps_distribution={model.nps_distribution}
              />
            )}
            <section className={card_class}>
              <h2 className="text-xl font-semibold text-white">Comentarios abiertos</h2>
              <p className="mt-2 text-sm text-gray-400">Sección privada. Estos textos no se envían a servicios externos.</p>
              {model.response_count < MIN_RESPONSES_FOR_BREAKDOWN && (
                <p className="mt-3 text-sm text-amber-100">Con pocas respuestas, un comentario puede identificar a una persona. Úsalo solo para mejorar la capacitación.</p>
              )}
              {model.open_answers.length === 0 && <p className="mt-4 text-gray-300">Todavía no hay comentarios.</p>}
              <div className="mt-4 space-y-4">
                {model.open_answers.map((group) => (
                  <div key={group.key}>
                    <h3 className="font-medium text-white">{group.prompt}</h3>
                    <ul className="mt-2 space-y-2">
                      {group.texts.map((text, index) => (
                        <li key={`${group.key}-${index}`} className="break-words rounded-xl bg-dark-900/60 px-3 py-2 text-gray-200">{text}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
            <section className={`${card_class} space-y-4`}>
              <h2 className="text-xl font-semibold text-white">Exportar evaluaciones</h2>
              {needs_evaluation_warning && (
                <label className="flex items-start gap-3 text-sm text-gray-200">
                  <input type="checkbox" className="mt-1" checked={confirm_evaluation} onChange={(event) => setConfirmEvaluation(event.target.checked)} />
                  <span>Confirmo que el archivo puede contener comentarios identificables y que lo usaré solo para mejorar la capacitación.</span>
                </label>
              )}
              <button type="button" className={primary_button_class} onClick={export_evaluation}>Descargar evaluaciones (CSV)</button>
            </section>
            <section className={`${card_class} space-y-4`}>
              <h2 className="text-xl font-semibold text-white">Suscripciones comerciales</h2>
              <p className="text-sm text-gray-400">Esta lista no está vinculada a una evaluación individual. No incluye el token de baja.</p>
              <label className="flex items-start gap-3 text-sm text-gray-200">
                <input type="checkbox" className="mt-1" checked={confirm_subscribers} onChange={(event) => setConfirmSubscribers(event.target.checked)} />
                <span>Confirmo que exportaré correos de personas que autorizaron el contacto y que no los compartiré fuera de NexoIA.</span>
              </label>
              <button type="button" className={secondary_button_class} onClick={export_subscribers}>Descargar suscripciones (CSV)</button>
              <ul className="space-y-3">
                {data.subscribers.map((subscriber) => (
                  <li key={subscriber.id} className="rounded-xl border border-white/10 p-3">
                    <p className="break-all font-medium text-white">{subscriber.email}</p>
                    <p className="text-sm text-gray-400">{subscriber.name || 'Sin nombre'} · {subscriber.unsubscribed_at ? 'Dada de baja' : 'Activa'}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {!subscriber.unsubscribed_at && (
                        <button type="button" className={secondary_button_class} onClick={() => mark_subscriber_unsubscribed(subscriber.id).then(refresh)}>Dar de baja</button>
                      )}
                      <button type="button" className={secondary_button_class} onClick={() => delete_subscriber(subscriber.id).then(refresh)}>Eliminar registro</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </PublicShell>
  )
}

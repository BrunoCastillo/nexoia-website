// Evaluación de la capacitación publicada como formulario de Google, dentro del sitio.

import { ExternalLink } from 'lucide-react'
import { CONTACT_EMAIL } from '@/lib/surveys/constants'
import { GOOGLE_FORM_VIEW_URL, to_google_form_embed_url } from '@/lib/surveys/google_form'
import { card_class, primary_button_class } from '@/lib/surveys/ui_classes'
import { PublicShell } from '@/components/encuestas/public_shell'

const embed_url = to_google_form_embed_url(GOOGLE_FORM_VIEW_URL)

export function GoogleFormPanel() {
  return (
    <PublicShell width="wide">
      <div className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-300">Evaluación anónima</p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Inteligencia Artificial Aplicada a las Finanzas</h1>
          <p className="text-gray-300">
            Universidad de Cuenca · ETAPA EP · 32 horas · Presencial · 11 sesiones · Instructor NexoIA
          </p>
          <p className="text-gray-400">
            Esta encuesta es una retroalimentación de NexoIA. No es una evaluación académica oficial de la Universidad de Cuenca ni de ETAPA EP. No pedimos tu nombre ni tu correo.
          </p>
        </header>

        {embed_url ? (
          <div className="space-y-4">
            <a className={primary_button_class} href={GOOGLE_FORM_VIEW_URL} target="_blank" rel="noreferrer">
              Abrir en Google Forms
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
            <iframe
              title="Evaluación: Inteligencia Artificial Aplicada a las Finanzas"
              src={embed_url}
              className="h-[80vh] min-h-[640px] w-full rounded-2xl border border-white/10 bg-white"
            >
              El formulario se abre en Google Forms.
            </iframe>
          </div>
        ) : (
          <div className={`${card_class} space-y-3`}>
            <p className="text-white">La evaluación se responde en Google Forms. El enlace público todavía no está configurado en el sitio.</p>
            <p className="text-gray-300">
              Cuando el formulario esté publicado, aparecerá aquí. Si necesitas el enlace antes, escribe a {CONTACT_EMAIL}.
            </p>
          </div>
        )}
      </div>
    </PublicShell>
  )
}

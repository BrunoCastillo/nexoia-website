import type { Metadata } from 'next'
import { GoogleFormPanel } from '@/components/encuestas/google_form_panel'

export const metadata: Metadata = {
  title: 'Evaluación: IA aplicada a las finanzas | NEXOIA',
  description: 'Retroalimentación de la capacitación Inteligencia Artificial Aplicada a las Finanzas. Instrumento de NexoIA.',
}

export default function IaFinanzasSurveyPage() {
  return <GoogleFormPanel />
}

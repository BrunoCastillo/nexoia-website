import type { Metadata } from 'next'
import { GoogleFormPanel } from '@/components/encuestas/google_form_panel'

export const metadata: Metadata = {
  title: 'Evaluación: IA aplicada a las finanzas | NEXOIA',
  description: 'Evaluación anónima de la capacitación Inteligencia Artificial Aplicada a las Finanzas. Instrumento de retroalimentación de NexoIA.',
}

export default function IaFinanzasSurveyPage() {
  return <GoogleFormPanel />
}

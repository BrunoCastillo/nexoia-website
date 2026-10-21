import type { Metadata } from 'next'
import { SurveyExperience } from '@/components/encuestas/survey_experience'

export const metadata: Metadata = {
  title: 'Evaluación: IA aplicada a las finanzas | NEXOIA',
  description: 'Evaluación anónima de la capacitación Inteligencia Artificial Aplicada a las Finanzas. Instrumento de retroalimentación de NexoIA.',
}

export default function IaFinanzasSurveyPage() {
  return <SurveyExperience slug="ia-finanzas-2026" />
}

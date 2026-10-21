import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evaluación de capacitación | NEXOIA',
  description: 'Evaluación anónima de las capacitaciones de NexoIA. No solicita datos personales para responder.',
}

export default function EncuestasLayout({ children }: { children: React.ReactNode }) {
  return children
}

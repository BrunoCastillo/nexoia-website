// Textos y límites compartidos por el formulario público y el panel administrativo.

export const CONSENT_VERSION = '2026-10-20'

export const CONSENT_TEXT =
  'Autorizo a NexoIA a utilizar mi correo electrónico para enviarme información sobre futuras capacitaciones, talleres y servicios de formación independientes. Entiendo que puedo cancelar mi suscripción en cualquier momento.'

export const CONTACT_EMAIL = 'nexoiaec@gmail.com'

export const MAX_OPEN_TEXT = 1000
export const MAX_OTHER_TEXT = 300
export const MAX_NAME = 120
export const MAX_INTERESTS = 500
export const MIN_RESPONSES_FOR_BREAKDOWN = 5
export const FIRST_SURVEY_SLUG = 'ia-finanzas-2026'

export const QUESTION_TYPE_LABELS = {
  rating_1_5: 'Calificación de 1 a 5',
  rating_0_10: 'Recomendación de 0 a 10',
  single_choice: 'Selección única',
  multiple_choice: 'Selección múltiple',
  open_text: 'Respuesta abierta',
} as const

export const SECTION_PRESETS = [
  { key: 'instructor', title: 'Evaluación del instructor' },
  { key: 'general', title: 'Evaluación general' },
  { key: 'temario', title: 'Evaluación del temario' },
  { key: 'aplicacion', title: 'Aplicación y recomendaciones' },
  { key: 'futuras', title: 'Interés en futuras capacitaciones' },
  { key: 'personalizada', title: 'Preguntas adicionales' },
] as const

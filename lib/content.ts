// Contenido real del sitio. Nada de cifras, clientes ni testimonios inventados.

export const TRAINING = {
  title: 'Inteligencia Artificial Aplicada a las Finanzas',
  institutions: 'Universidad de Cuenca y ETAPA EP',
  hours: '32 horas',
  sessions: '11 sesiones',
  modality: 'Presencial',
  topics: [
    'Comprensión de la IA y su importancia en el sector financiero.',
    'La IA en la transformación financiera.',
    'Desafíos y oportunidades de la IA en finanzas.',
    'Análisis prácticos en la aplicación de la IA en finanzas.',
    'El futuro de las finanzas con IA.',
    'El papel de la IA en finanzas mediante el pensamiento crítico.',
  ],
  practices: [
    'Mapa de oportunidades de IA en Finanzas',
    'Laboratorio de prompts financieros',
    'Calidad de datos con Google Colab',
    'Dashboard de presupuestos',
    'Análisis y proyección de ingresos',
    'Detección de anomalías financieras',
    'Elaboración de informes gerenciales',
    'Asistentes documentales con evidencia',
    'Diseño del Agente Analista Financiero',
    'Analista Gerencial de Proformas',
    'Pensamiento crítico y validación de resultados',
  ],
} as const

export const PROCESS_STEPS = [
  {
    title: 'Diagnóstico',
    text: 'Una llamada de 30 minutos para entender el proceso, el equipo y las herramientas que ya usas, y ver si la IA tiene sentido ahí.',
  },
  {
    title: 'Propuesta',
    text: 'Te enviamos por escrito el alcance, los entregables, el plazo y el costo. Sin paquetes cerrados: se cotiza lo que necesitas.',
  },
  {
    title: 'Implementación',
    text: 'Construimos sobre lo que tu equipo ya conoce: WhatsApp, Google Workspace, Excel. Revisamos avances contigo antes de entregar.',
  },
  {
    title: 'Capacitación y acompañamiento',
    text: 'Formamos a las personas que van a usar la solución y acompañamos los ajustes después de la entrega.',
  },
] as const

export type ServiceItem = { title: string; text: string; project?: string }

export const AUTOMATION_SERVICES: ServiceItem[] = [
  {
    title: 'Agentes de WhatsApp',
    text: 'Asistentes que responden consultas frecuentes, recogen datos y derivan a una persona cuando hace falta.',
    project: 'citas-medicas',
  },
  {
    title: 'Agendamiento con Google Calendar y Gmail',
    text: 'Reservas que consultan la disponibilidad real, registran la cita en el calendario y envían la confirmación por correo.',
    project: 'citas-medicas',
  },
  {
    title: 'Publicación automatizada en redes',
    text: 'Flujos que preparan y publican contenido en un horario fijo, con el enlace a la fuente en cada publicación.',
    project: 'noticias-instagram',
  },
  {
    title: 'Reportes y dashboards',
    text: 'Tableros en Excel con indicadores, comparativos entre periodos y filtros, pensados para quien toma decisiones.',
    project: 'dashboard-presupuesto',
  },
  {
    title: 'Agentes de análisis de Excel',
    text: 'Agentes que revisan un archivo, validan sus columnas, calculan indicadores y redactan un informe con alertas.',
    project: 'agente-presupuestario',
  },
]

export type Project = {
  id: string
  title: string
  problem: string
  built: string
  tools: string[]
  status_label: 'Estado' | 'Uso'
  status: string
}

export const PROJECTS: Project[] = [
  {
    id: 'citas-medicas',
    title: 'Agendamiento de citas médicas por WhatsApp',
    problem: 'Coordinar citas a mano por WhatsApp ocupa el tiempo de recepción y se presta a cruces de horario.',
    built:
      'Un chatbot de WhatsApp que consulta la disponibilidad en Google Calendar, registra la cita y envía la confirmación por Gmail.',
    tools: ['n8n', 'WhatsApp', 'Google Calendar', 'Gmail'],
    status_label: 'Estado',
    status: 'En desarrollo.',
  },
  {
    id: 'noticias-instagram',
    title: 'Noticias de IA publicadas cada día en Instagram',
    problem: 'Mantener una cuenta activa con noticias del día exige buscar, resumir, diseñar y publicar todos los días.',
    built:
      'Un flujo que reúne noticias de inteligencia artificial, prepara la publicación en formato carrusel con el titular y el enlace a la noticia, y la publica en un horario fijo.',
    tools: ['n8n', 'Instagram'],
    status_label: 'Uso',
    status: 'Cuenta de Instagram de NexoIA (@nexoiaec).',
  },
  {
    id: 'agente-presupuestario',
    title: 'Agente de control presupuestario',
    problem: 'Revisar la ejecución del presupuesto partida por partida es lento, y las desviaciones se detectan tarde.',
    built:
      'Un agente que recibe el Excel del presupuesto, valida sus columnas, calcula ejecución, desviación, variación interanual y proyección de cierre, marca las partidas con un semáforo y redacta un informe breve con alertas y acciones. Si falta un dato, pregunta antes de asumir.',
    tools: ['Excel', 'Agente de IA'],
    status_label: 'Uso',
    status: 'Taller del programa Inteligencia Artificial Aplicada a las Finanzas, con un Excel de prueba.',
  },
  {
    id: 'dashboard-presupuesto',
    title: 'Dashboard interactivo de presupuesto',
    problem: 'Comparar el presupuesto de un año con el anterior en hojas sueltas no deja ver a tiempo qué cambió.',
    built:
      'Un dashboard en Excel con los KPIs del presupuesto anual y comparativos año contra año, construido paso a paso a partir de un prompt maestro.',
    tools: ['Excel', 'IA generativa'],
    status_label: 'Uso',
    status: 'Taller práctico del programa Inteligencia Artificial Aplicada a las Finanzas.',
  },
]

export const FOUNDER = {
  name: 'Bruno Castillo',
  full_name: 'Bruno Alexei Castillo Roldán',
  role: 'Instructor y fundador de NexoIA',
  initials: 'BC',
  credentials: [
    'Ingeniero de Sistemas',
    'Máster en Inteligencia Artificial',
    'Máster en Gerencia de Proyectos',
    'Más de 15 años en tecnología, proyectos y transformación digital',
  ],
  experience: [
    { org: 'Palisade Corporation', text: 'Modelos estadísticos, simulación Monte Carlo y redes neuronales.' },
    { org: 'Banco del Austro', text: 'Desarrollo, banca digital y gestión de proyectos tecnológicos.' },
    { org: 'Cooperativa JEP', text: 'Proyectos tecnológicos de medios de pago.' },
    { org: 'Universidad de Cuenca', text: 'Docente entre 2014 y 2015.' },
  ],
} as const

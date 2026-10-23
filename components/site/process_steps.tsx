// Cómo trabajamos: cuatro pasos en orden, por eso van numerados.

import { PROCESS_STEPS } from '@/lib/content'

export function ProcessSteps() {
  return (
    <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {PROCESS_STEPS.map((step, index) => (
        <li key={step.title} className="border-t-2 border-ink pt-5">
          <span className="font-display text-4xl font-extrabold text-brand-indigo" aria-hidden="true">
            {index + 1}
          </span>
          <h3 className="mt-3 text-xl font-bold">
            <span className="sr-only">Paso {index + 1}: </span>
            {step.title}
          </h3>
          <p className="mt-2 text-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}

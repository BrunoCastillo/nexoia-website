// Muestra el avance del formulario para que la persona sepa cuánto falta.

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = Math.round((current / total) * 100)
  return (
    <div className="mb-6">
      <div className="mb-2 flex justify-between text-sm text-gray-300">
        <span>Paso {current} de {total}</span>
        <span>{percent}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso de la evaluación"
      >
        <div className="h-full bg-gradient-to-r from-purple-500 via-primary-500 to-teal-400" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

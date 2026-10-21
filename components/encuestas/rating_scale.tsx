// Escala visual accesible. Los controles nativos permiten usarla con teclado.

export function RatingScale({
  name,
  min,
  max,
  value,
  labelled_by,
  on_change,
}: {
  name: string
  min: number
  max: number
  value: number | null
  labelled_by: string
  on_change: (value: number) => void
}) {
  const values = Array.from({ length: max - min + 1 }, (_, index) => min + index)
  const columns = max - min > 5 ? 'grid-cols-6 sm:grid-cols-11' : 'grid-cols-5'
  return (
    <div role="radiogroup" aria-labelledby={labelled_by} className={`grid gap-2 ${columns}`}>
      {values.map((item) => (
        <label key={item} className="min-w-0 cursor-pointer">
          <input
            className="peer sr-only"
            type="radio"
            name={name}
            value={item}
            checked={value === item}
            onChange={() => on_change(item)}
          />
          <span className="flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-sm font-semibold text-gray-100 peer-checked:border-transparent peer-checked:bg-gradient-to-br peer-checked:from-purple-600 peer-checked:to-primary-600 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-300">
            {item}
          </span>
        </label>
      ))}
    </div>
  )
}

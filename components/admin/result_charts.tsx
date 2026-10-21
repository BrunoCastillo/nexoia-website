'use client'

// Gráficos locales. No envían respuestas abiertas a servicios de analítica.

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ChartPoint, ChoiceChart } from '@/lib/surveys/stats'

function ChartCard({ title, children, summary }: { title: string; children: React.ReactNode; summary: ChartPoint[] }) {
  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
      <div className="min-w-0" style={{ height: Math.max(288, summary.length * 32) }}>{children}</div>
      <ul className="mt-3 space-y-1 text-sm text-gray-300">
        {summary.map((point) => (
          <li key={point.full_label}>{point.full_label}: {point.value}</li>
        ))}
      </ul>
    </section>
  )
}

function tooltip_style() {
  return { background: '#0a2540', border: '1px solid #334155', borderRadius: 12, color: '#fff' }
}

export function ResultCharts({
  rating_chart,
  score_distribution,
  choice_charts,
  nps_distribution,
}: {
  rating_chart: ChartPoint[]
  score_distribution: ChartPoint[]
  choice_charts: ChoiceChart[]
  nps_distribution: ChartPoint[]
}) {
  const reduce_motion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {rating_chart.length > 0 && (
        <ChartCard title="Calificaciones por dimensión" summary={rating_chart}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rating_chart} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" domain={[0, 'auto']} />
              <YAxis type="category" dataKey="label" width={120} stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <Tooltip contentStyle={tooltip_style()} labelFormatter={(_, payload) => String(payload?.[0]?.payload?.full_label ?? '')} />
              <Bar dataKey="value" fill="#38bdf8" radius={[0, 6, 6, 0]} isAnimationActive={!reduce_motion} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
      <ChartCard title="Distribución de puntuaciones de 1 a 5" summary={score_distribution}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={score_distribution}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" allowDecimals={false} />
            <Tooltip contentStyle={tooltip_style()} />
            <Bar dataKey="value" fill="#818cf8" radius={[6, 6, 0, 0]} isAnimationActive={!reduce_motion} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      {nps_distribution.length > 0 && (
        <ChartCard title="Distribución de la recomendación" summary={nps_distribution}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nps_distribution}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip contentStyle={tooltip_style()} />
              <Bar dataKey="value" fill="#2dd4bf" radius={[6, 6, 0, 0]} isAnimationActive={!reduce_motion} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
      {choice_charts.map((chart) => (
        <ChartCard key={chart.key} title={chart.title} summary={chart.points}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.points} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" allowDecimals={false} />
              <YAxis type="category" dataKey="label" width={130} stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <Tooltip contentStyle={tooltip_style()} labelFormatter={(_, payload) => String(payload?.[0]?.payload?.full_label ?? '')} />
              <Bar dataKey="value" fill="#14b8a6" radius={[0, 6, 6, 0]} isAnimationActive={!reduce_motion} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ))}
    </div>
  )
}

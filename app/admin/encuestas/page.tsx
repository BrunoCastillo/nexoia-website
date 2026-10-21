'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AdminGate } from '@/components/admin/admin_gate'
import { DashboardPanel } from '@/components/admin/dashboard_panel'

function ResultadosRoute() {
  const slug = useSearchParams().get('curso')?.trim() ?? ''
  return (
    <AdminGate>
      <DashboardPanel initial_slug={slug} />
    </AdminGate>
  )
}

export default function AdminEncuestasPage() {
  return (
    <Suspense fallback={<p className="min-h-screen bg-dark-900 pt-32 text-center text-white">Cargando panel…</p>}>
      <ResultadosRoute />
    </Suspense>
  )
}

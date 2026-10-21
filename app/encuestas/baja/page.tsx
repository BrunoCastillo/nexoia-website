'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { UnsubscribePanel } from '@/components/encuestas/unsubscribe_panel'

function BajaRoute() {
  const token = useSearchParams().get('token')?.trim() ?? ''
  return <UnsubscribePanel token={token} />
}

export default function BajaPage() {
  return (
    <Suspense fallback={<p className="min-h-screen bg-dark-900 pt-32 text-center text-white">Cargando…</p>}>
      <BajaRoute />
    </Suspense>
  )
}

'use client'

import { AdminGate } from '@/components/admin/admin_gate'
import { TrainingAdminPanel } from '@/components/admin/training_admin_panel'

export default function CapacitacionesPage() {
  return (
    <AdminGate>
      <TrainingAdminPanel />
    </AdminGate>
  )
}

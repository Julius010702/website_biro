// app/admin/ppid/permohonan/[id]/page.tsx
import { use } from 'react'
import PermohonanDetailPage from './_PermohonanDetailPage'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <PermohonanDetailPage id={id} />
}
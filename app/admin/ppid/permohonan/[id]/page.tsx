'use client'
// app/(admin)/admin/ppid/permohonan/[id]/page.tsx
import PermohonanDetailPage from './_PermohonanDetailPage'

export default function Page({ params }: { params: { id: string } }) {
  return <PermohonanDetailPage id={params.id} />
}
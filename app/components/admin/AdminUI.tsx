'use client'
// components/admin/AdminUI.tsx  — shared UI primitives for admin pages

import { useState, useTransition } from 'react'
import { Trash2, Pencil, Plus, Loader2, AlertTriangle, X, Check } from 'lucide-react'

// ─── Card wrapper ─────────────────────────────────────────────────────────────
export function AdminCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{ background: 'white', border: '1px solid #E2EAF6', boxShadow: '0 2px 12px rgba(13,71,161,0.06)' }}
    >
      {children}
    </div>
  )
}

// ─── Card header ─────────────────────────────────────────────────────────────
export function AdminCardHeader({
  title,
  action,
}: {
  title: string
  action?: React.ReactNode
}) {
  return (
    <div
      className="flex items-center justify-between px-5 py-3"
      style={{ borderBottom: '1px solid #EEF3FC', background: '#F8FAFF' }}
    >
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#0D47A1' }} />
        <h3 className="text-sm font-bold" style={{ color: '#0A2342' }}>{title}</h3>
      </div>
      {action}
    </div>
  )
}

// ─── Primary button ───────────────────────────────────────────────────────────
export function BtnPrimary({
  children,
  onClick,
  type = 'button',
  loading = false,
  disabled = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
      style={{ background: '#0D47A1', color: 'white', boxShadow: '0 2px 10px rgba(13,71,161,0.25)' }}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : children}
    </button>
  )
}

// ─── Secondary button ─────────────────────────────────────────────────────────
export function BtnSecondary({
  children,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
      style={{ background: '#F0F4FA', color: '#374151', border: '1px solid #E2EAF6' }}
    >
      {children}
    </button>
  )
}

// ─── Add button ───────────────────────────────────────────────────────────────
export function BtnAdd({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
      style={{ background: '#0D47A1', color: 'white' }}
    >
      <Plus className="w-3.5 h-3.5" /> {label}
    </button>
  )
}

// ─── Edit button ──────────────────────────────────────────────────────────────
export function BtnEdit({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105"
      style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1565C0' }}
      title="Edit"
    >
      <Pencil className="w-3.5 h-3.5" />
    </button>
  )
}

// ─── Delete button with confirm ───────────────────────────────────────────────
export function BtnDelete({
  onConfirm,
  label = 'item ini',
}: {
  onConfirm: () => Promise<void>
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      await onConfirm()
      setOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105"
        style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
        title="Hapus"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(6,15,30,0.6)', backdropFilter: 'blur(4px)' }}>
          <div
            className="rounded-2xl p-6 max-w-sm w-full"
            style={{ background: 'white', border: '1px solid #E2EAF6', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEF2F2' }}>
                <AlertTriangle className="w-5 h-5" style={{ color: '#DC2626' }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#0A2342' }}>Konfirmasi Hapus</p>
                <p className="text-xs" style={{ color: '#64748B' }}>Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <p className="text-xs mb-5" style={{ color: '#374151' }}>
              Apakah Anda yakin ingin menghapus <strong>{label}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <BtnSecondary onClick={() => setOpen(false)}>
                <X className="w-3.5 h-3.5" /> Batal
              </BtnSecondary>
              <button
                onClick={handleConfirm}
                disabled={pending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: '#DC2626', color: 'white' }}
              >
                {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Status toggle badge ──────────────────────────────────────────────────────
export function StatusBadge({ active, onClick }: { active: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all hover:scale-105"
      style={{
        background: active ? '#DCFCE7' : '#F1F5F9',
        color: active ? '#16A34A' : '#94A3B8',
        border: `1px solid ${active ? '#86EFAC' : '#E2E8F0'}`,
      }}
    >
      {active
        ? <><Check className="w-3 h-3" /> Aktif</>
        : <><X     className="w-3 h-3" /> Nonaktif</>
      }
    </button>
  )
}

// ─── Form field wrapper ───────────────────────────────────────────────────────
export function FormField({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold" style={{ color: '#374151' }}>
        {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px]" style={{ color: '#94A3B8' }}>{hint}</p>}
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 rounded-xl text-xs outline-none transition-all"
      style={{
        background: '#F8FAFF',
        border: '1px solid #DBEAFE',
        color: '#0A2342',
        ...(props.style ?? {}),
      }}
    />
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full px-3 py-2 rounded-xl text-xs outline-none resize-y transition-all"
      style={{
        background: '#F8FAFF',
        border: '1px solid #DBEAFE',
        color: '#0A2342',
        minHeight: '80px',
        ...(props.style ?? {}),
      }}
    />
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 rounded-xl text-xs outline-none"
      style={{
        background: '#F8FAFF',
        border: '1px solid #DBEAFE',
        color: '#0A2342',
        ...(props.style ?? {}),
      }}
    />
  )
}

// ─── Toast notification ───────────────────────────────────────────────────────
export function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  function show(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function ToastEl() {
    if (!toast) return null
    return (
      <div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold shadow-xl"
        style={{
          background: toast.type === 'success' ? '#DCFCE7' : '#FEF2F2',
          border: `1px solid ${toast.type === 'success' ? '#86EFAC' : '#FECACA'}`,
          color: toast.type === 'success' ? '#16A34A' : '#DC2626',
        }}
      >
        {toast.type === 'success'
          ? <Check className="w-3.5 h-3.5" />
          : <AlertTriangle className="w-3.5 h-3.5" />
        }
        {toast.msg}
      </div>
    )
  }

  return { show, ToastEl }
}

// ─── Empty state ─────────────────────────────────────────────────────────────
export function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-10 text-center">
      <p className="text-xs" style={{ color: '#94A3B8' }}>{label}</p>
    </div>
  )
}

// ─── Table wrapper ────────────────────────────────────────────────────────────
export function AdminTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: '#F8FAFF', borderBottom: '1px solid #EEF3FC' }}>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left font-black tracking-wide uppercase" style={{ color: '#64748B', fontSize: '10px' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function AdminTr({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <tr
      className={className}
      style={{ borderBottom: '1px solid #F0F4FF' }}
    >
      {children}
    </tr>
  )
}

export function AdminTd({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 ${className}`} style={{ color: '#374151' }}>
      {children}
    </td>
  )
}
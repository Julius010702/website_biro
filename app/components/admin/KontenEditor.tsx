'use client'
// components/admin/KontenEditor.tsx
// Rich text editor wrapper — uses a simple textarea in production.
// Swap <textarea> for a proper rich-text editor (e.g. TipTap, Quill) as needed.

import { useState } from 'react'
import { Bold, Italic, List, Link as LinkIcon,  AlignLeft, AlignCenter, Code } from 'lucide-react'

interface Props {
  name: string
  defaultValue?: string
  placeholder?: string
}

export default function KontenEditor({ name, defaultValue = '', placeholder }: Props) {
  const [value, setValue] = useState(defaultValue)

  const toolbar = [
    { icon: <Bold className="w-3.5 h-3.5" />,        label: 'Bold',         action: () => wrap('**', '**') },
    { icon: <Italic className="w-3.5 h-3.5" />,      label: 'Italic',       action: () => wrap('_', '_') },
    { icon: <List className="w-3.5 h-3.5" />,         label: 'List',         action: () => prefix('- ') },
    { icon: <LinkIcon className="w-3.5 h-3.5" />,     label: 'Link',         action: () => wrap('[', '](url)') },
    { icon: <Code className="w-3.5 h-3.5" />,         label: 'Code',         action: () => wrap('`', '`') },
    { icon: <AlignLeft className="w-3.5 h-3.5" />,    label: 'H2',           action: () => prefix('## ') },
    { icon: <AlignCenter className="w-3.5 h-3.5" />,  label: 'H3',           action: () => prefix('### ') },
  ]

  function wrap(before: string, after: string) {
    const ta = document.querySelector<HTMLTextAreaElement>(`textarea[name="${name}"]`)
    if (!ta) return
    const { selectionStart: s, selectionEnd: e } = ta
    const selected = value.slice(s, e) || 'teks'
    const newVal = value.slice(0, s) + before + selected + after + value.slice(e)
    setValue(newVal)
  }

  function prefix(pre: string) {
    const ta = document.querySelector<HTMLTextAreaElement>(`textarea[name="${name}"]`)
    if (!ta) return
    const { selectionStart: s } = ta
    const lineStart = value.lastIndexOf('\n', s - 1) + 1
    const newVal = value.slice(0, lineStart) + pre + value.slice(lineStart)
    setValue(newVal)
  }

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:border-transparent transition-all"
      style={{ '--tw-ring-color': 'var(--color-ntt-red-700)' } as React.CSSProperties}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50 flex-wrap">
        {toolbar.map((t) => (
          <button key={t.label} type="button" title={t.label} onClick={t.action}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
            {t.icon}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 hidden sm:block">Markdown didukung</span>
      </div>

      {/* Textarea */}
      <textarea
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? 'Tulis konten di sini...'}
        rows={18}
        required
        className="w-full px-4 py-3 text-sm text-gray-800 bg-white resize-y focus:outline-none leading-relaxed"
        style={{ minHeight: '320px' }}
      />

      {/* Footer */}
      <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <span className="text-xs text-gray-400">{value.length} karakter</span>
        <span className="text-xs text-gray-400">{value.split(/\s+/).filter(Boolean).length} kata</span>
      </div>
    </div>
  )
}
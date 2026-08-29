"use client"

import { useRef } from "react"

export default function KeberatanTandaTangan() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const drawing = useRef(false)

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY }
  }

  function start(e: React.MouseEvent | React.TouchEvent) {
    drawing.current = true
    const ctx = canvasRef.current!.getContext("2d")!
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = "#0A2342"
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function move(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing.current) return
    e.preventDefault()
    const ctx = canvasRef.current!.getContext("2d")!
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function end() {
    if (!drawing.current) return
    drawing.current = false
    const canvas = canvasRef.current
    if (canvas && hiddenInputRef.current) {
      hiddenInputRef.current.value = canvas.toDataURL("image/png")
    }
  }

  function clear() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (hiddenInputRef.current) hiddenInputRef.current.value = ""
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        Tanda Tangan <span className="text-red-500">*</span>
      </label>
      <canvas
        ref={canvasRef}
        width={600}
        height={180}
        className="w-full rounded-xl border border-slate-200 bg-white"
        style={{ maxWidth: "100%", touchAction: "none" }}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <input ref={hiddenInputRef} type="hidden" name="tandaTangan" />
      <div className="flex items-center justify-between mt-2">
        <p className="text-[10px] text-slate-400">
          Gunakan mouse atau jari untuk menandatangani di area di atas.
        </p>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors"
        >
          Ulangi
        </button>
      </div>
    </div>
  )
}
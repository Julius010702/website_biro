"use client"

export default function KeberatanSubmitButton() {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form
    if (!form) return

    const tandaTangan = form.elements.namedItem("tandaTangan") as HTMLInputElement | null
    if (!tandaTangan || !tandaTangan.value) {
      e.preventDefault()
      alert("Mohon bubuhkan tanda tangan terlebih dahulu sebelum mengirim.")
      return
    }

    const alasanChecked = Array.from(form.querySelectorAll('input[name^="alasan"]')).some(
      (el) => (el as HTMLInputElement).checked
    )
    if (!alasanChecked) {
      e.preventDefault()
      alert("Pilih minimal satu alasan pengajuan keberatan.")
    }
  }

  return (
    <button
      type="submit"
      onClick={handleClick}
      className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
      style={{ background: "#0D47A1", color: "white", boxShadow: "0 4px 16px rgba(13,71,161,0.25)" }}
    >
      Submit Permohonan
    </button>
  )
}
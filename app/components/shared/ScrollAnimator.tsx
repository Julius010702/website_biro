'use client'
// components/shared/ScrollAnimator.tsx
// Pasang sekali di layout utama. Akan mengobservasi semua elemen
// dengan class "reveal" dan menambah "in-view" saat masuk viewport.

import { useEffect } from 'react'

export default function ScrollAnimator() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            // Setelah animasi selesai, stop observing (tidak perlu ulang)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,      // 12% elemen terlihat → trigger
        rootMargin: '0px 0px -40px 0px', // sedikit offset dari bawah viewport
      }
    )

    // Observe semua elemen .reveal yang ada
    const observe = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        // Kalau belum in-view, observe
        if (!el.classList.contains('in-view')) {
          observer.observe(el)
        }
      })
    }

    observe()

    // MutationObserver untuk elemen yang dimount belakangan (dynamic content)
    const mutObs = new MutationObserver(() => observe())
    mutObs.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutObs.disconnect()
    }
  }, [])

  return null
}
// Deklarasi untuk file CSS agar TypeScript tidak error saat import
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

// Deklarasi untuk file gambar
declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}

declare module '*.webp' {
  const value: string
  export default value
}
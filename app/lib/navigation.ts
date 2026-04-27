// src/lib/navigation.ts

export type NavItem = {
  label: string
  href?: string
  external?: boolean
  children?: NavItem[]
}

export type SitusTerkaitItem = {
  label: string
  href: string
  external?: boolean
  /** Satu gambar atau array screenshot untuk auto-slide */
  thumbnail?: string | string[]
}

export const mainNav: NavItem[] = [
  {
    label: 'Beranda',
    href: '/',
  },
  {
    label: 'Profil',
    children: [
      { label: 'Tentang Kami',           href: '/profil/sekapur-sirih' },
      { label: 'Struktur Organisasi',      href: '/profil/struktur-organisasi' },
      { label: 'Tugas Pokok dan Fungsi',   href: '/profil/tugas-pokok-fungsi' },
      {
        label: 'Bagian',
        children: [
          { label: 'Kelembagaan & Analisis Jabatan',       href: '/profil/bagian/kelembagaan-analisis-jabatan' },
          { label: 'Reformasi Birokrasi & Akuntabilitas',  href: '/profil/bagian/reformasi-birokrasi-akuntabilitas' },
          { label: 'Tata Laksana',                         href: '/profil/bagian/tata-laksana' },
        ],
      },
    ],
  },
  {
    label: 'Unit Kerja',
    children: [
      {
        label: 'Kelembagaan & Analisis Jabatan',
        href: '/unit-kerja/kelembagaan-analisis-jabatan',
      },
      {
        label: 'Reformasi Birokrasi & Akuntabilitas',
        href: '/unit-kerja/reformasi-birokrasi-akuntabilitas',
      },
      {
        label: 'Tatalaksana',
        href: '/unit-kerja/tata-laksana',
      },
    ],
  },
  {
    label: 'PPID',
    children: [
      { label: 'Seputar PPID',                       href: '/ppid' },
      { label: 'Tugas dan Fungsi',                   href: '/ppid/tugas-fungsi' },
      { label: 'Struktur Organisasi PPID',           href: '/ppid/struktur-organisasi' },
      { label: 'Maklumat Pelayanan',                 href: '/ppid/maklumat' },
      { label: 'Pelayanan Informasi Publik',         href: '/ppid/informasi-publik' },
      { label: 'Permohonan Informasi Online',        href: '/ppid/permohonan' },
    ],
  },
  {
    label: 'Berita',
    href: '/berita',
  },
  {
    label: 'Daftar Informasi',
    children: [
      {
        label: 'Informasi Setiap Saat',
        href: 'https://drive.google.com/drive/folders/1eCYfgChjlq-AyjPt1-KXx3-BWlxLVZo5?usp=sharing',
        external: true,
      },
      {
        label: 'Informasi Berkala',
        href: 'https://drive.google.com/drive/folders/1P7xUX6WNE7KjJw2Ju3ELcdJk2y2ejR2Y?usp=sharing',
        external: true,
      },
      {
        label: 'Daftar Informasi Dikecualikan',
        href: 'https://drive.google.com/drive/folders/1P7xUX6WNE7KjJw2Ju3ELcdJk2y2ejR2Y?usp=sharing',
        external: true,
      },
    ],
  },
]

export const footerLinks = {
  profil: [
    { label: 'Tentang Kami',             href: '/profil/sekapur-sirih' },
    { label: 'Struktur Organisasi',        href: '/profil/struktur-organisasi' },
    { label: 'Bagian Kelembagaan',         href: '/profil/bagian/kelembagaan-analisis-jabatan' },
    { label: 'Bagian Reformasi Birokrasi', href: '/profil/bagian/reformasi-birokrasi-akuntabilitas' },
    { label: 'Bagian Tatalaksana',        href: '/profil/bagian/tata-laksana' },
  ],
  unitKerja: [
    { label: 'Kelembagaan & Analisis Jabatan',      href: '/unit-kerja/kelembagaan-analisis-jabatan' },
    { label: 'Reformasi Birokrasi & Akuntabilitas', href: '/unit-kerja/reformasi-birokrasi-akuntabilitas' },
    { label: 'Tatalaksana',                        href: '/unit-kerja/tata-laksana' },
  ],
  /**
   * Setiap item boleh punya:
   *   thumbnail: '/images/apps/gsinjab.jpeg'          ← satu gambar
   *   thumbnail: ['/images/apps/gsinjab.jpeg', ...]   ← multi-slide (auto-play)
   */
  situsTerkait: [
    {
      label: 'G-SINJAB',
      href: 'https://gsinjab.nttprov.go.id',
      external: true,
      thumbnail: [
        '/images/apps/gsinjab.jpeg',
        // '/images/apps/gsinjab-2.jpeg',
        // '/images/apps/gsinjab-3.jpeg',
      ],
    },
    {
      label: 'SiMBAGA NTT',
      href: 'https://simbagabiroorganisasi.nttprov.go.id/login',
      external: true,
      thumbnail: '/images/apps/simbaga.jpeg',
    },
  ] satisfies SitusTerkaitItem[],
}

export const ppidMenu = [
  { label: 'Seputar PPID',                       href: '/ppid' },
  { label: 'Tugas dan Fungsi',                   href: '/ppid/tugas-fungsi' },
  { label: 'Struktur Organisasi PPID',           href: '/ppid/struktur-organisasi' },
  { label: 'Maklumat Pelayanan',                 href: '/ppid/maklumat' },
  { label: 'Pelayanan Informasi Publik',         href: '/ppid/informasi-publik' },
  { label: 'Permohonan Informasi Online',        href: '/ppid/permohonan' },
 
]

// ─── Helper: slug Bagian → URL ────────────────────────────────────────────────
export const bagianSlugToPath: Record<string, string> = {
  KELEMBAGAAN_ANALISIS_JABATAN:       '/unit-kerja/kelembagaan-analisis-jabatan',
  REFORMASI_BIROKRASI_AKUNTABILITAS:  '/unit-kerja/reformasi-birokrasi-akuntabilitas',
  TATA_LAKSANA:                       '/unit-kerja/tata-laksana',
}

export const pathToBagianSlug: Record<string, string> = {
  'kelembagaan-analisis-jabatan':      'KELEMBAGAAN_ANALISIS_JABATAN',
  'reformasi-birokrasi-akuntabilitas': 'REFORMASI_BIROKRASI_AKUNTABILITAS',
  'tata-laksana':                      'TATA_LAKSANA',
}
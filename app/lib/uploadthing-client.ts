// lib/uploadthing-client.ts
// ← File ini KHUSUS client, tidak boleh import next/headers atau lib/auth
import { generateReactHelpers } from '@uploadthing/react'
import type { OurFileRouter } from '@/lib/uploadthing'

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()
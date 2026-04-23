import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { getSession } from '@/lib/auth'

const f = createUploadthing()

const authMiddleware = async () => {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  return {}
}

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),

  profileUploader: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),

  // ← tambah ini untuk dokumen PDF
  pdfUploader: f({
    pdf: { maxFileSize: '16MB', maxFileCount: 1 },
  })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
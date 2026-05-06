import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const updated = await prisma.strukturOrganisasi.updateMany({
    where: { tipe: 'BIRO' },
    data: { tipe: 'BIRO' }
  })
  console.log('Updated:', updated.count)
  const all = await prisma.strukturOrganisasi.findMany({ select: { id: true, tipe: true, deskripsi: true } })
  console.log('All records:', JSON.stringify(all, null, 2))
}
main().catch(console.error).finally(() => prisma.disconnect())
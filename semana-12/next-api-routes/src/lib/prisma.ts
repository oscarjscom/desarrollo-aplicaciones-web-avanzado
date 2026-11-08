import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// El pooler de Supabase admite pocas conexiones a la vez: cada instancia usa solo una
function databaseUrl() {
  const url = process.env.DATABASE_URL
  if (!url || url.includes('connection_limit')) return url
  return `${url}${url.includes('?') ? '&' : '?'}connection_limit=1`
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ datasources: { db: { url: databaseUrl() } } })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

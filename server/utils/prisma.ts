import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
// dev 模式中從 global 取得 db 資料庫 或 建立一個 db 連線池
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
// 只在開發模式儲存到 global
// production 模式 sercer 不會 hot reload
if (import.meta.dev) {
  globalForPrisma.prisma = prisma
}

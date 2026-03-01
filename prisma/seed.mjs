import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const DEFAULT_PASSWORD = '1111111111'

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10)
  const count = await prisma.user.count()

  if (count > 0) {
    await prisma.user.updateMany({
      data: { passwordHash }
    })
    return
  }

  await prisma.user.createMany({
    data: [
      { name: 'Ava Lin', email: 'ava@example.com', role: 'ADMIN', status: 'ACTIVE', passwordHash },
      { name: 'Noah Chen', email: 'noah@example.com', role: 'EDITOR', status: 'ACTIVE', passwordHash },
      { name: 'Mia Tsai', email: 'mia@example.com', role: 'VIEWER', status: 'INVITED', passwordHash },
      { name: 'Ethan Wu', email: 'ethan@example.com', role: 'VIEWER', status: 'ACTIVE', passwordHash },
      { name: 'Lucas Ho', email: 'lucas@example.com', role: 'VIEWER', status: 'DISABLED', passwordHash },
      { name: 'Emma Kao', email: 'emma@example.com', role: 'EDITOR', status: 'ACTIVE', passwordHash },
      { name: 'Leo Hsu', email: 'leo@example.com', role: 'VIEWER', status: 'INVITED', passwordHash },
      { name: 'Ivy Lin', email: 'ivy@example.com', role: 'VIEWER', status: 'ACTIVE', passwordHash }
    ]
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

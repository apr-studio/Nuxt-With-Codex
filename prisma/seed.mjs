import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.user.count()
  if (count > 0) {
    return
  }

  await prisma.user.createMany({
    data: [
      { name: 'Ava Lin', email: 'ava@example.com', role: 'ADMIN', status: 'ACTIVE' },
      { name: 'Noah Chen', email: 'noah@example.com', role: 'EDITOR', status: 'ACTIVE' },
      { name: 'Mia Tsai', email: 'mia@example.com', role: 'VIEWER', status: 'INVITED' },
      { name: 'Ethan Wu', email: 'ethan@example.com', role: 'VIEWER', status: 'ACTIVE' },
      { name: 'Lucas Ho', email: 'lucas@example.com', role: 'VIEWER', status: 'DISABLED' },
      { name: 'Emma Kao', email: 'emma@example.com', role: 'EDITOR', status: 'ACTIVE' },
      { name: 'Leo Hsu', email: 'leo@example.com', role: 'VIEWER', status: 'INVITED' },
      { name: 'Ivy Lin', email: 'ivy@example.com', role: 'VIEWER', status: 'ACTIVE' }
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

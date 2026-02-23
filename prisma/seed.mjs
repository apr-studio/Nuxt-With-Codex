import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
// 這是一個資料庫初始化腳本
// 如果 user 為空, 建立 8 筆資料
async function main() {
  // 檢查是否已有資料
  const count = await prisma.user.count()
  if (count > 0) {
    return
  }

  await prisma.user.createMany({
    data: [
      {
        name: 'Ava Lin',
        email: 'ava@example.com',
        role: 'ADMIN',
        status: 'ACTIVE'
      },
      {
        name: 'Noah Chen',
        email: 'noah@example.com',
        role: 'EDITOR',
        status: 'ACTIVE'
      },
      {
        name: 'Mia Tsai',
        email: 'mia@example.com',
        role: 'VIEWER',
        status: 'INVITED'
      },
      {
        name: 'Ethan Wu',
        email: 'ethan@example.com',
        role: 'VIEWER',
        status: 'ACTIVE'
      },
      {
        name: 'Lucas Ho',
        email: 'lucas@example.com',
        role: 'VIEWER',
        status: 'DISABLED'
      },
      {
        name: 'Emma Kao',
        email: 'emma@example.com',
        role: 'EDITOR',
        status: 'ACTIVE'
      },
      {
        name: 'Leo Hsu',
        email: 'leo@example.com',
        role: 'VIEWER',
        status: 'INVITED'
      },
      {
        name: 'Ivy Lin',
        email: 'ivy@example.com',
        role: 'VIEWER',
        status: 'ACTIVE'
      }
    ]
  })
}

main()
  .catch((error) => {
    console.error(error)
    // 用錯誤碼結束程式
    process.exit(1)
  })
  .finally(async () => {
    // 無論成功或失敗
    // 關閉資料庫連線 避免 node process 卡住
    await prisma.$disconnect()
  })

import prisma from "@/lib/db"

async function main() {
  // You will assign this
  const userID = 'user_38kOmbUyAdVk1hYCQ3s0gLzZGEW'

  // --- APIs ---
  const api1 = await prisma.api.create({
    data: {
      userId: userID,
      data: JSON.stringify({ name: 'Weather API', version: 'v1' }),
    },
  })

  const api2 = await prisma.api.create({
    data: {
      userId: userID,
      data: JSON.stringify({ name: 'Payments API', version: 'v2' }),
    },
  })

  // --- BINS ---
  const bin1 = await prisma.bin.create({
    data: {
      userId: userID,
    },
  })

  const bin2 = await prisma.bin.create({
    data: {
      userId: userID,
    },
  })

  // --- REQUEST LOGS ---
  await prisma.requestLog.createMany({
    data: [
      {
        binId: bin1.binId,
        method: 'GET',
        headers: JSON.stringify({
          'content-type': 'application/json',
          'user-agent': 'PostmanRuntime/7.36.0',
        }),
        body: '',
        query: 'page=1&limit=10',
      },
      {
        binId: bin1.binId,
        method: 'POST',
        headers: JSON.stringify({
          'content-type': 'application/json',
        }),
        body: JSON.stringify({ email: 'test@example.com' }),
        query: '',
      },
      {
        binId: bin2.binId,
        method: 'PUT',
        headers: JSON.stringify({
          authorization: 'Bearer token123',
        }),
        body: JSON.stringify({ status: 'active' }),
        query: 'id=42',
      },
    ],
  })

  console.log('🌱 Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

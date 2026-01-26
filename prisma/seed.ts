import prisma from "@/lib/db";

async function main() {
  console.warn("\nThis seed file will clear the entire database.");
  console.warn("Clearing process will start in 3 seconds.\n")
  
  await (new Promise(res => setTimeout(res, 3000)))
  
  await prisma.requestLog.deleteMany()
  await prisma.api.deleteMany()
  await prisma.bin.deleteMany()
  await prisma.user.deleteMany()
  
  console.log("\nDatabase cleared.")
}

main()
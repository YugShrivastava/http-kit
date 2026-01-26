import { Api } from "@/generated/prisma/client";
import prisma from "@/lib/db";

async function main () {
  console.warn("no seed data");
  
  const api = {
    data: "{\n  working: \"yes\",\n  virgin: \"yes\",\n  gay: \"no\",\n  curr_fav_pornstar: \"ashley anderson\"\n}",
    userId: "user_38kOmbUyAdVk1hYCQ3s0gLzZGEW"
  }
  
  await prisma.api.create({
    data: api
  })
  
}

main()
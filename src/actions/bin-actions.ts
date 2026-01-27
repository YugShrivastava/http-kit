"use server";

import prisma from "@/lib/db";

export async function createRequestBin(userId: string) {
  if (!userId) {
    return { error: "invalid user" };
  }

  await prisma.bin.create({
    data: {
      userId,
    },
  });

  return { error: false };
}

export async function deleteRequestBin(userId: string, formData: FormData) {
  const binId = formData.get("binId");

  if (typeof binId !== "string") {
    return { error: "invalid bin id" };
  }
  
  console.log({ userId });

  const bin = await prisma.bin.findUnique({
    where: {
      binId,
      userId,
    },
  });

  if (!bin) {
    return { error: "bin not found or unauthorized" };
  }

  await prisma.requestLog.deleteMany({
    where: {
      binId,
    },
  });

  await prisma.bin.delete({
    where: {
      id: bin.id,
    },
  });

  return { error: false };
}

export async function deleteRequestLog(userId: string, formData: FormData) {
  const id = formData.get("id") as string;
  const binId = formData.get("binId") as string;
  
  if (!id) return { error: "log id not found" };
  
  const exists = await prisma.bin.findUnique({
    where: {
      binId,
      userId,
    },
    include: { logs: true }
  });
    
  if (!exists) return { error: "not authorized or bin not found" };
  console.log(exists.logs.map(val => val.id));
  console.log(exists.logs.find(log => log.id === id));
  if (!exists.logs.find(log => log.id === id)) return { error: "log not found" };

  try {
    await prisma.requestLog.delete({
      where: { id }
    });
    
    return { error: false };
  } catch (e) {
    console.log({ e });
    return { error: "server error" };
  }
}
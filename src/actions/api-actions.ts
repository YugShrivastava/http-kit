"use server";

import prisma from "@/lib/db";

export async function createMockApi(userId: string, formData: FormData) {
  const api = {
    data: JSON.stringify(formData.get("returnData")),
    userId: userId,
  };

  if (!api.data) return { error: "data not found" };

  const exists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!exists) return { error: "user not found" };

  await prisma.api.create({
    data: api,
  });

  return { error: false };
}

export async function updateMockApi(userId: string, formData: FormData) {
  const api = {
    apiId: formData.get("apiId") as string,
    data: JSON.stringify(formData.get("data")),
  };

  if (!api.apiId) return { error: "api id required" };

  const exists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!exists) return { error: "user not found" };

  try {
    await prisma.api.update({
      where: { apiId: api.apiId },
      data: {
        data: api.data,
      },
    });
    
  } catch (e) {
    console.log(e);
    return { error: "server error" };
  }

  return { error: false };
}

export async function deleteMockApi(userId: string, formData: FormData) {
  const apiId = formData.get("apiId") as string;

  if (!apiId) return { error: "api id required" };

  const exists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!exists) return { error: "user not found" };

  try {
    await prisma.api.delete({
      where: { apiId },
    });
  } catch (e) {
    console.log(e);
    return { error: "server error" };
  }
  return { error: false };
}

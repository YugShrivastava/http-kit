import prisma from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

async function getApiFromRequest(req: NextRequest) {
  const token = req.headers.get("token")
  if (!token) {
    return {
      error: NextResponse.json(
        { error: "token not found" },
        { status: 401 }
      ),
    }
  }

  const user = await prisma.user.findUnique({
    where: { token },
    include: { apis: true },
  })

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "invalid token" },
        { status: 401 }
      ),
    }
  }

  const url = new URL(req.url)
  const apiId = url.pathname.split("/").at(-1)

  if (!apiId) {
    return {
      error: NextResponse.json(
        { error: "invalid api id" },
        { status: 400 }
      ),
    }
  }

  const api = user.apis.find((api) => api.apiId === apiId)

  if (!api) {
    return {
      error: NextResponse.json(
        { error: "invalid api id" },
        { status: 400 }
      ),
    }
  }

  return { api }
}

async function handler(req: NextRequest) {
  const result = await getApiFromRequest(req)

  if ("error" in result) {
    return result.error
  }

  return new NextResponse(result.api.data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler

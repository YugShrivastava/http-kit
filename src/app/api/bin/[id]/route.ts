import prisma from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function ALL(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const binId = url.pathname.split("/").at(-1)

    if (!binId) {
      return NextResponse.json(
        { error: "Invalid bin id" },
        { status: 400 }
      )
    }

    const bin = await prisma.bin.findUnique({
      where: { binId }
    })

    if (!bin) {
      return NextResponse.json(
        { error: "Bin not found" },
        { status: 404 }
      )
    }

    const method = req.method
    const headers = Object.fromEntries(req.headers)
    const query = Object.fromEntries(url.searchParams)

    const body = await req.text()

    await prisma.requestLog.create({
      data: {
        binId,
        method,
        headers: JSON.stringify(headers),
        query: JSON.stringify(query),
        body,
      }
    })

    return new NextResponse(null, { status: 200 })
  } catch (err) {
    console.error("Request bin error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export {ALL as GET, ALL as POST, ALL as PATCH, ALL as PUT, ALL as DELETE}
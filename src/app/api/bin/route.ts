import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("userid");
  
  if (!userId) return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: {
      "Content-Type": "application/json"
    }
  });
  
  try {
    const bins = await prisma.bin.findMany({
      where: {
        userId
      },
      include: { logs: true }
    });
    
    console.log({userId, bins});
    
    if (bins?.length < 1) return new NextResponse(JSON.stringify({ message: "unauthorized or no mock bins found" }), { status: 400, headers: { "Cntent-Type": "application/json" } });
    
    return new NextResponse(JSON.stringify({ message: "success", bins }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (e) {
    console.log({e}, "server sending response");
    return new NextResponse(JSON.stringify({ error: "server error" }), { status: 500, headers: { "Cntent-Type": "application/json" } });
  }
}
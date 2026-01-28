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
    const apis = await prisma.api.findMany({
      where: {
        userId
      }
    });
    
    console.log({userId, apis});
    
    if (apis?.length < 1) return new NextResponse(JSON.stringify({ message: "unauthorized or no mock apis found" }), { status: 400, headers: { "Cntent-Type": "application/json" } });
    
    return new NextResponse(JSON.stringify({ message: "success", apis }), {
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
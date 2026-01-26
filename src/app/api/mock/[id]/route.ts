import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("token");
  if (!token)
    return new NextResponse(
      JSON.stringify({
        error: "token not found",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

  const user = await prisma.user.findUnique({
    where: {
      token,
    },
    include: {
      api: true,
    },
  });

  if (!user)
    return new NextResponse(
      JSON.stringify({
        error: "invalid token",
      }),
    );

  const apiId = req.url.split("/").at(-1);

  const api = user.api.find((api) => api.apiId === apiId);

  if (!api)
    return new NextResponse(
      JSON.stringify({
        error: "invalid api id",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

  return new NextResponse(api.data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("token");
  if (!token)
    return new NextResponse(
      JSON.stringify({
        error: "token not found",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

  const user = await prisma.user.findUnique({
    where: {
      token,
    },
    include: {
      api: true,
    },
  });

  if (!user)
    return new NextResponse(
      JSON.stringify({
        error: "invalid token",
      }),
    );

  const apiId = req.url.split("/").at(-1);

  const api = user.api.find((api) => api.apiId === apiId);

  if (!api)
    return new NextResponse(
      JSON.stringify({
        error: "invalid api id",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

  return new NextResponse(api.data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get("token");
  if (!token)
    return new NextResponse(
      JSON.stringify({
        error: "token not found",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

  const user = await prisma.user.findUnique({
    where: {
      token,
    },
    include: {
      api: true,
    },
  });

  if (!user)
    return new NextResponse(
      JSON.stringify({
        error: "invalid token",
      }),
    );

  const apiId = req.url.split("/").at(-1);

  const api = user.api.find((api) => api.apiId === apiId);

  if (!api)
    return new NextResponse(
      JSON.stringify({
        error: "invalid api id",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

  return new NextResponse(api.data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get("token");
  if (!token)
    return new NextResponse(
      JSON.stringify({
        error: "token not found",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

  const user = await prisma.user.findUnique({
    where: {
      token,
    },
    include: {
      api: true,
    },
  });

  if (!user)
    return new NextResponse(
      JSON.stringify({
        error: "invalid token",
      }),
    );

  const apiId = req.url.split("/").at(-1);

  const api = user.api.find((api) => api.apiId === apiId);

  if (!api)
    return new NextResponse(
      JSON.stringify({
        error: "invalid api id",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

  return new NextResponse(api.data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("token");
  if (!token)
    return new NextResponse(
      JSON.stringify({
        error: "token not found",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

  const user = await prisma.user.findUnique({
    where: {
      token,
    },
    include: {
      api: true,
    },
  });

  if (!user)
    return new NextResponse(
      JSON.stringify({
        error: "invalid token",
      }),
    );

  const apiId = req.url.split("/").at(-1);

  const api = user.api.find((api) => api.apiId === apiId);

  if (!api)
    return new NextResponse(
      JSON.stringify({
        error: "invalid api id",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

  return new NextResponse(api.data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

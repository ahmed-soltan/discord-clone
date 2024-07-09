import { currentProfile } from "@/lib/current-profile";
import { prisma } from "../../../lib/prismadb";
import { NextResponse } from "next/server";
import { Message } from "@prisma/client";

const MESSAGES_BATCH = 10;

export const GET = async (req: Request) => {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams?.get("cursor");
    const channelId = searchParams?.get("channelId");

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("channel Id", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await prisma.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId: channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await prisma.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId: channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[messages.length - 1].id;
    }

    return NextResponse.json({ items:messages, nextCursor });
  } catch (error) {
    console.log("MESSAGES:GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

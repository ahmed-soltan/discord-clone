import { currentProfile } from "@/lib/current-profile";
import { prisma } from "../../../lib/prismadb";
import { NextResponse } from "next/server";
import { DirectMessage, Message } from "@prisma/client";

const DIRECT_MESSAGES_BATCH = 10;

export const GET = async (req: Request) => {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("conversation Id", { status: 400 });
    }

    let directMessage: DirectMessage[] = [];

    if (cursor) {
      directMessage = await prisma.directMessage.findMany({
        take: DIRECT_MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId: conversationId,
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
      directMessage = await prisma.directMessage.findMany({
        take: DIRECT_MESSAGES_BATCH,
        where: {
          conversationId: conversationId,
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

    if (directMessage.length === DIRECT_MESSAGES_BATCH) {
      nextCursor = directMessage[directMessage.length - 1].id;
    }

    return NextResponse.json({ items:directMessage, nextCursor });
  } catch (error) {
    console.log("DIRECT_MESSAGES:GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

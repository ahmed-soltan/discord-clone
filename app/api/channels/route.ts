import { currentProfile } from "@/lib/current-profile";
import { prisma } from "../../../lib/prismadb";
import { NextResponse } from "next/server";
import { v4 as uuid4 } from "uuid";
import { MemberRole } from "@prisma/client";
export const POST = async (req: Request) => {
  try {
    const profile = await currentProfile();
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams?.get("serverId");
    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("missing Server Id", { status: 401 });
    }

    if (body.name === "general") {
      return new NextResponse("Cannot create a general channel", {
        status: 400,
      });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            name: body.name,
            type: body.type,
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("CHANNEL:POST", error);
  }
};

import { currentProfile } from "@/lib/current-profile";
import { prisma } from "../../../../../lib/prismadb";
import { NextResponse } from "next/server";
import { v4 as uuid4 } from "uuid";

export const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string } }
) => {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }

    if (!params?.serverId) {
      return new NextResponse("Missing server Id ", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: params?.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("LEAVE:PATCH", error);
    return NextResponse.json(error);
  }
};

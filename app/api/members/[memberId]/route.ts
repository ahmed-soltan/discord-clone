import { currentProfile } from "@/lib/current-profile";
import { prisma } from "../../../../lib/prismadb";
import { NextResponse } from "next/server";
import { v4 as uuid4 } from "uuid";

export const DELETE = async (
  req: Request,
  { params }: { params: { memberId: string } }
) => {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Missing server Id ", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Missing Member Id ", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("MEMBER:DELETE", error);
    return NextResponse.json(error);
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { memberId: string } }
) => {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Missing server Id ", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Missing Member Id ", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("MEMBER:PATCH", error);
    return NextResponse.json(error);
  }
};

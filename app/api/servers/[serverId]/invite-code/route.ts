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

    const server = await prisma.server.update({
      where: {
        id: params?.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuid4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER:POST", error);
  }
};

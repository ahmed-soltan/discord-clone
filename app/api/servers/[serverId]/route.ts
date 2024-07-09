import { currentProfile } from "@/lib/current-profile";
import { prisma } from "../../../../lib/prismadb";
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

    const body = await req.json()

    const server = await prisma.server.update({
      where: {
        id: params?.serverId,
        profileId: profile.id,
      },
      data: {
        ...body
      },
    });

    return NextResponse.json(server);
} catch (error) {
    console.log("SERVER:POST", error);
    return NextResponse.json(error);
  }
};

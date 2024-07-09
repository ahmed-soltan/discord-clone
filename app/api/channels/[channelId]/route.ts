import { currentProfile } from "@/lib/current-profile";
import { prisma } from "../../../../lib/prismadb";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export const DELETE = async (
  req: Request,
  { params }: { params: { channelId: string } }
) => {
  try {
    const profile = await currentProfile();
    const {searchParams} = new URL(req.url)
    const serverId = searchParams.get('serverId')
    
    if (!profile) {
        return new NextResponse("unAuthorized", { status: 401 });
    }
    
    if (!params.channelId) {
        return new NextResponse("Missing channel Id ", { status: 400 });
    }
    
    if (!serverId) {
      return new NextResponse("Missing server Id ", { status: 400 });
    }
    const server = await prisma.server.update({
      where: {
        id: serverId,
        members:{
            some:{
                profileId: profile.id,
                role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
            }
        }
      },
      data:{
        channels:{
            delete:{
                id: params.channelId,
                name:{
                    not: "general"
                }
            }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("DELETE_CHANNEL:DELETE", error);
    return NextResponse.json(error);
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { channelId: string } }
) => {
  try {
    const profile = await currentProfile();
    const {searchParams} = new URL(req.url)
    const serverId = searchParams.get('serverId')
    const body = await req.json()
    
    if (!profile) {
        return new NextResponse("unAuthorized", { status: 401 });
    }
    
    if (!params.channelId) {
        return new NextResponse("Missing channel Id ", { status: 400 });
    }
    
    if (!serverId) {
      return new NextResponse("Missing server Id ", { status: 400 });
    }

    if(body.name==="general") {
      return new NextResponse("Cannot rename a 'general' ", {
        status: 400,
      });
    }


    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
      channels:{
        update:{
          where:{
            id: params.channelId,
            NOT:{
              name:"general"
            }
          },
          data:{
            ...body
          }
        }
      }
      },
    });

    return NextResponse.json(server);
} catch (error) {
    console.log("CHANNEL:PATCH", error);
    return NextResponse.json(error);
  }
};

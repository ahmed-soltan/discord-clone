import { currentProfile } from "@/lib/current-profile";
import { prisma } from "../../../lib/prismadb";
import { NextResponse } from "next/server";
import {v4 as uuid4} from "uuid"
import { MemberRole } from "@prisma/client";
export const POST = async (req: Request) => {
  try {
    const profile = await currentProfile()
    const body = await req.json();

    if(!profile){
        return new NextResponse("unAuthorized" , {status: 401})
    }

    const server = await prisma.server.create({
        data: {
          name: body.name,
          imageUrl:body.image,
          //@ts-ignore
          profileId: profile.id,
          inviteCode:uuid4(),
          channels:{
            create:{
              name: "general",
              profileId: profile.id,
            }
          },
          members:{
            create:{
              profileId: profile.id,
              role:MemberRole.ADMIN
            }
          }
        },
      });


      return NextResponse.json(server)
  } catch (error) {
    console.log("SERVER:POST" , error)
  }
};

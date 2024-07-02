import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {prisma} from '@/lib/prismadb'
import { Server } from "@prisma/client";
interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async({ params }: InviteCodePageProps) => {
  const profile = await currentProfile()
  
  if(!profile){
    return auth().redirectToSignIn();
  }

  if(!params.inviteCode){
    return redirect('/')
  }

  const existingServer = await prisma.server.findFirst({
    where:{
      inviteCode: params.inviteCode,
      members:{
        some:{
          profileId: profile.id
        }
      }

    }
  })

  if(existingServer){
    //@ts-ignore
    return redirect(`/servers/${existingServer?.id}`)
  }

  const server = await prisma.server.update({
    where:{
      inviteCode: params.inviteCode
    },
    data:{
      members:{
        create:[{
          profileId: profile.id,
        }]
      }
    }
  })

  if(server){
    return redirect(`/servers/${server.id}`)
  }
  
  return null;
};

export default InviteCodePage;

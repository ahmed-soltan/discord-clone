import { currentProfile } from "@/lib/current-profile"
import {prisma} from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const ServerPage = async ({params}:{params:{serverId:string}}) => {

  const profile = await currentProfile()
  if(!profile){
    return auth().redirectToSignIn()
  }

  const server = await prisma.server.findUnique({
    where:{
      id: params?.serverId,
      members:{
        some:{
          profileId: profile.id,
        },
      },
    },
    include:{
      channels:{
        where:{
          name:"general"
        },
        orderBy:{
          createdAt:"asc"
        },
      },
    },
  })

  const initialChannel = server?.channels[0]

  if(initialChannel?.name!=="general"){
    return null
  }
  return redirect(`/servers/${params?.serverId}/channels/${initialChannel?.id}`)
}

export default ServerPage
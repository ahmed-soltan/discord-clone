import { initialProfile } from "@/lib/initial-profile"
import {prisma} from '../../lib/prismadb'
import { redirect } from "next/navigation"
import InitialMode from "@/components/models/InitialMode"
const page = async() => {

  const profile = await initialProfile()
  const server = await prisma.server.findFirst({
    where: {
      members:{
        some: {
          //@ts-ignore
          profileId: profile.id
        }
      }
    }
  })

  if(server){
    return redirect(`/servers/${server.id}`)
  }

  return (
    <InitialMode/>
  )
}

export default page
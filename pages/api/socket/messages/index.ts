import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";
import { prisma } from "@/lib/prismadb";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ message: "Server id Missing" });
    }
    if (!channelId) {
      return res.status(400).json({ message: "channel id Missing" });
    }
    if (!content) {
      return res.status(400).json({ message: "content Missing" });
    }

    const server = await prisma.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
      include: {
        messages: true,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if(!member){
        return res.status(404).json({message: "member not found"})
    }

    const message = await prisma.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        serverId: serverId as string,
        memberId:member.id
      },
      include:{
        member:{
            include:{

                profile:true
            }
        }
      }
    });

    const channelKey = `chat:${channel.id}:messages`

    res?.socket?.server?.io.emit(channelKey, message)

    return res.status(200).json(message)
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

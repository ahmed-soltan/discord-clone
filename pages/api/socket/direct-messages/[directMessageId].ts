import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";
import { prisma } from "@/lib/prismadb";
import { MemberRole } from "@prisma/client";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const profile = await currentProfilePages(req);

    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!directMessageId) {
      return res.status(400).json({ message: "directMessage id missing" });
    }
    if (!conversationId) {
      return res.status(400).json({ message: "directMessage id missing" });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: "conversation not found" });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ message: "member not found" });
    }

    let directMessage = await prisma.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });


    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isMessageOwner = (directMessage.member.id = member.id);
    const isAdmin = (member.role = MemberRole.ADMIN);
    const isModerator = (member.role = MemberRole.MODERATOR);
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ message: "unauthorized" });
    }

    if (req.method === "DELETE") {
      directMessage = await prisma.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string,
        },
        data: {
          fileUrl: null,
          content: "This messages has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ message: "unauthorized" });
      }

     directMessage= await prisma.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`;

    res.socket.server.io.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
}

import { prisma } from "./prismadb";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

    if(!conversation){
        conversation= await createNewConversation(memberOneId, memberTwoId);
    }
    return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await prisma.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
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
  } catch (error) {
    console.log("ERROR_FINDING_CONVERSATION : ",error)

    return null;
  }
};


const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    const conversation =  await prisma.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
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
    console.log(conversation)
    return conversation
  } catch (error) {
    console.log("ERROR_CREATING_CONVERSATION : ",error)
    return null;
  }
};

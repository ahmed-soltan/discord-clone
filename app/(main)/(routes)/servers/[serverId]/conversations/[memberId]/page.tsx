import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prismadb";
import { getOrCreateConversation } from "@/lib/conversation";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { MediaChatRoom } from "@/components/media-room";
interface MemberPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
  searchParams: {
    video: string;
  };
}
const MemberPage = async ({ params, searchParams }: MemberPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const currentMember = await prisma.member.findFirst({
    where: {
      serverId: params?.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params?.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params?.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = profile.id === memberOne.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={otherMember.profile.name}
        serverId={params?.serverId}
        type={"conversation"}
        imageUrl={otherMember.profile.imageUrl}
      />
      {searchParams?.video && (
        <MediaChatRoom chatId={conversation.id} audio={true} video={true} />
      )}
      {!searchParams?.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberPage;

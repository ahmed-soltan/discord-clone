import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { MediaChatRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

const ChannelPage = async ({
  params,
}: {
  params: { serverId: string; channelId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const channel = await prisma.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await prisma.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
  });

  if (!member || !channel) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel?.name!}
        serverId={params.serverId}
        type={"channel"}
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            name={channel.name}
            member={member}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type===ChannelType.AUDIO && (
        <MediaChatRoom
          chatId={channel.id}
          audio={true}
          video={false}
        />
      )}
      {channel.type===ChannelType.VIDEO && (
        <MediaChatRoom
          chatId={channel.id}
          audio={true}
          video={true}
        />
      )}
    </div>
  );
};

export default ChannelPage;

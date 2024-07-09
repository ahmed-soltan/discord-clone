"use client";

import { useUser } from "@clerk/nextjs";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaChatRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaChatRoom = ({ chatId, video, audio }: MediaChatRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) {
      return;
    }

    const name = `${user.firstName} ${user.lastName}` as string;

    (async () => {
      try {
        const response = await fetch(
          `/api/get-participant-token?room=${chatId}&username=${name}`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (!token) {
    return (
      <div className="flex items-center justify-center flex-1 flex-col">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme={"default"}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      audio={audio}
      video={video}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

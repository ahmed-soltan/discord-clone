"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "../action-tooltip";
import { ModalType, useModal } from "@/hooks/use-model-store";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}
const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};
const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();

  const I = iconMap[channel.type];

  const onClick = ()=>{
    router.push(`/servers/${server.id}/channels/${channel.id}`)
  }

  const onAction = (e:React.MouseEvent , action:ModalType)=>{
    e.stopPropagation();
    onOpen(action, { server, channel });
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2",
        "w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId == channel.id && "bg-zinc-700/20 dark:bg-zinc-500/20"
      )}
    >
      <I className="flex-shrink-0 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-xs text-zinc-500",
          "dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          params?.channelId == channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
            onClick={(e)=>onAction(e, "editChannel")}
              className="hidden group-hover:block text-zinc-500 dark:text-zinc-400
                 hover:text-zinc-600 dark:hover:text-zinc-300 transition w-4 h-4"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className="hidden group-hover:block text-zinc-500 dark:text-zinc-400
                 hover:text-zinc-600 dark:hover:text-zinc-300 transition w-4 h-4"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && role !== MemberRole.GUEST && (
        <Lock
          className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400
                 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
        />
      )}
    </button>
  );
};

export default ServerChannel;

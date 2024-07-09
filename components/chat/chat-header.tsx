import { Hash, Menu } from "lucide-react";
import React from "react";
import MobileToggle from "../mobile-toggle";
import UserAvatar from "../UserAvatar";
import { SocketIndicator } from "../socket-indicator";
import ChatVideoButton from "./chat-video-button";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}
const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return <div className="text-md font-semibold px-3 flex items-center h-12
   border-neutral-200 dark:border-neutral-800 border-b-2">
    <MobileToggle serverId={serverId}/>
    {type === "channel" && (
        <Hash className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2"/>
    )}
    {type === "conversation" && (
        <UserAvatar src={imageUrl} className="w-8 h-8 md:w-8 md:h-8 mr-2"/>
    )}
    <p className="font-semibold text-md text-black dark:text-white">{name}</p>
    <div className="ml-auto flex items-center">
      <SocketIndicator/>
      {type==="conversation" && (
        <ChatVideoButton/>
      )}
    </div>
   </div>;
};

export default ChatHeader;

"use client";

import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";
import ChatItem from "./chat-item";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

const DATE_FORMAT = "d MMM yyyy HH:mm";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, any>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

type MessagesWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:message`;
  const updatekey = `chat:${chatId}:messages:update`;
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  useChatSocket({ queryKey, addKey, updatekey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.length ?? 0,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center flex-1 justify-center">
        <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading Messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center flex-1 justify-center">
        <ServerCrash className="w-7 h-7 text-zinc-500 my-4" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Something went wrong
        </p>
      </div>
    );
  }

  console.log(data?.pages)


  return (
    <div className="flex-1 flex flex-col overflow-y-auto py-4" ref={chatRef}>
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome name={name} type={type} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 italic text-sm
               dark:hover:text-zinc-300 transition"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              Load Previous Messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages && data?.pages?.map((group, i) => {
          return (
            <Fragment key={i}>
              {group?.items?.map((message: MessagesWithMemberWithProfile) => (
                <ChatItem
                  key={message.id}
                  id={message.id}
                  member={message.member}
                  currentMember={member}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  deleted={message.deleted}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                  isUpdated={message.updatedAt !== message.createdAt}
                  socketQuery={socketQuery}
                  socketUrl={socketUrl}
                />
              ))}
            </Fragment>
          );
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;

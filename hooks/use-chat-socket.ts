import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updatekey: string;
  queryKey: string;
};

type MessageWithMemberWithProfileType = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  addKey,
  updatekey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleAddMessage = (message: MessageWithMemberWithProfileType) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [[message]],
            pageParams: [undefined],
          };
        }

        const newData = [...oldData.pages];
        newData[0] = [message, ...newData[0]];
        return {
          ...oldData,
          pages: newData,
        };
      });
    };

    const handleUpdateMessage = (message: MessageWithMemberWithProfileType) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return page.items.map((item: MessageWithMemberWithProfileType) => {
            return item.id === message.id ? message : item;
          });
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    };

    socket.on(addKey, handleAddMessage);
    socket.on(updatekey, handleUpdateMessage);

    return () => {
      socket.off(addKey, handleAddMessage);
      socket.off(updatekey, handleUpdateMessage);
    };
  }, [queryClient, addKey, queryKey, socket, updatekey]);
};

"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-model-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckIcon, Copy, RefreshCcw } from "lucide-react";
import useOrigin from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";

const InviteServerModel = () => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  if(!isModalOpen) {
    return null;
  }
  const inviteUrl = `${origin}/invite/${data.server?.inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const res = await axios.patch(
        `/api/servers/${data.server?.id}/invite-code`
      );
      onClose();
      onOpen("invite" , {server:res.data})
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Label
            className="uppercase text-xs fond-bold 
          text-zinc-500 dark:text-secondary/70"
          >
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/30 border-0 focus-visible:ring-0
               text-black focus-visible:ring-offset-0"
              disabled={isLoading}
              value={inviteUrl}
            />
            <Button size={"icon"} onClick={handleCopy} disabled={isLoading}>
              {copied ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            variant={"link"}
            size={"sm"}
            className="text-xs text-zinc-500 mt-4"
            disabled={isLoading}
            onClick={onNew}
          >
            Generate a New Link
            <RefreshCcw className={cn("w-4 h-4 ml-2" , isLoading && "animate-spin")} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteServerModel;

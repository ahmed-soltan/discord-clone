"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-model-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";

const DeleteMessageModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "deleteMessage";
  if (!isModalOpen) {
    return null;
  }
  const { apiUrl , query } = data;

  const handleLeaveServer = async () => {
    setIsLoading(true);
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query: query
      });
      await axios.delete(url);
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to Delete this Message? <br /> <span className="font-bold">This action
            cannot be undone.</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button onClick={onClose} variant={"ghost"} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant={"primary"}
              onClick={handleLeaveServer}
              disabled={isLoading}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModel;

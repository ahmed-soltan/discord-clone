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

const DeleteServerModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const { onOpen, isOpen, onClose, type, data } = useModal();
  
  const isModalOpen = isOpen && type === "deleteServer";
  if (!isModalOpen) {
    return null;
  }
  const { server } = data;

  const handleLeaveServer = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/servers/${server?.id}/delete`);
      onClose();
      router.refresh();
      router.push("/");
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
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to Delete the server{" "}
            <span className="text-semibold text-indigo-500">
              {server?.name}
            </span>
            ? This action cannot be undone.
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

export default DeleteServerModel;

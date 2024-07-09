"use client";

import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import React from "react";
import ActionTooltip from "../action-tooltip";

const ChatVideoButton = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isVideo = searchParams?.get("video");
  const router = useRouter();

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? null : "true",
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "Edit Video Call" : "Start Video Call";

  return (
    <ActionTooltip label={tooltipLabel} side="bottom">
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;

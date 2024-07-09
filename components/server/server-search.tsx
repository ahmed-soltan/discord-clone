"use client";

import { Search } from "lucide-react";
import { KeyboardEvent, useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}
const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const onClick = (id: string, type: string) => {
    setOpen(false);
    if (type === "member") {
      return router.push(`/server/${params.serverId}/conversations/${id}`);
    }

    if (type === "channel") {
      return router.push(`/server/${params.serverId}/channels/${id}`);
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down as any);
    return () => document.removeEventListener("keydown", down as any);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 
        w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="mr-2 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p
          className="font-semibold text-sm text-zinc-500 dark:text-zinc-400
         group-hover:text-zinc-600 dark:group-hover:text-zinc-300 
         transition"
        >
          Search
        </p>
        <kbd
          className="pointer-events-none inline-flex h-5 select-none
          items-center gap-1 rounded border bg-muted px-1 font-mono 
          text-[10px] font-medium text-muted-foreground ml-auto"
        >
          <span className="text-xs">CTRL</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search All Channels and Members" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;
            return (
              <CommandGroup heading={label} key={label}>
                {data.map(({ id, name, icon }) => (
                  <CommandItem key={id} onSelect={() => onClick(id, type)}>
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;

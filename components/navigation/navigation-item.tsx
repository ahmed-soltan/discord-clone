"use client";

import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "../action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}
const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const router = useRouter();
  const params = useParams();

  const onClick = ()=>{
    router.push(`/servers/${id}`)
  }

  return (
    <ActionTooltip side={"right"} align="center" label={name}>
      <button className="group relative flex items-center" onClick={onClick}>
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px] ",
            params?.serverId == id ? "h-[36px] " : "h-[8px]"
          )}
        />
        <div className={cn(
            "relative group rounded-[24px] mx-3 flex w-[48px] h-[48px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId == id && "text-primary bg-primary/70 rounded-[16px]"
          )}>
            <Image src={imageUrl} alt={name} fill/>
          </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;

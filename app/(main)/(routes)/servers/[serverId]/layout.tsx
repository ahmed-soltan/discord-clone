import { currentProfile } from "@/lib/current-profile";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "../../../../../lib/prismadb";
import ServerSidebar from "@/components/server/server-sidebar";
export const metadata: Metadata = {
  title: "Discord Clone App",
  description: "Generated by create next app",
};

export default async function ServerIdLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { serverId: string };
}>) {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const server = await prisma.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="md:pl-60 h-full">{children}</main>
    </div>
  );
}

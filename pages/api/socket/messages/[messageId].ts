import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";
import {prisma} from '@/lib/prismadb'
import { MemberRole } from "@prisma/client";
export default async function handler(
    req:NextApiRequest,
    res:NextApiResponseServerIO
){
    if(req.method !== "DELETE" && req.method !== "PATCH"){
        return res.status(405).json({message: "Method Not Allowed"});
    }

    try {
        const profile = await currentProfilePages(req);

        const {messageId , serverId , channelId} = req.query;
        const {content} = req.body

        if(!profile){
            return res.status(401).json({message: "Unauthorized"});
        }

        if(!messageId){
            return res.status(400).json({message: "Message id missing"});
        }

        if(!serverId){
            return res.status(400).json({message: "Server id missing"});
        }

        if(!channelId){
            return res.status(400).json({message: "Channel id missing"});
        }

        const server = await prisma.server.findFirst({
            where: {
                id: serverId as string,
                members:{
                    some: {
                        profileId: profile.id,
                    }
                }
            },
            include: {
                members: true
            }
        });

        if(!server){
            return res.status(404).json({message: "Server not found"});
        }

        const channel = await prisma.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        });

        if(!channel){
            return res.status(404).json({message: "Channel not found"});
        }

        const member = server.members.find(member => member.profileId === profile.id)

        if(!member){
            return res.status(404).json({message: "member not found"});
        }

        let message = await prisma.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        if(!message || message.deleted){
            return res.status(404).json({message: "Message not found"});
        }

        const isMessageOwner = message.member.id = member.id
        const isAdmin = member.role = MemberRole.ADMIN
        const isModerator = member.role = MemberRole.MODERATOR
        const canModify = isMessageOwner || isAdmin || isModerator

        if(!canModify){
            return res.status(401).json({message: "unauthorized"});
        }

        if(req.method === "DELETE"){
            await prisma.message.update({
                where: {
                    id: messageId as string,
                    channelId: channelId as string,
                },
                data: {
                    fileUrl:null,
                    content: "This messages has been deleted",
                    deleted: true
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }
        if(req.method === "PATCH"){
            if(!isMessageOwner){
                return res.status(401).json({message: "unauthorized"});
            }

            await prisma.message.update({
                where: {
                    id: messageId as string,
                    channelId: channelId as string,
                },
                data: {
                    content
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }

        const updateKey=`chat:${channelId}:messages:update`

         res.socket.server.io.emit(updateKey, message)

         return res.status(200).json(message)

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Error"});
    }
}
import { auth, getAuth } from "@clerk/nextjs/server"
import {prisma} from './prismadb'
import { NextApiRequest } from "next";

export const currentProfilePages = async(req:NextApiRequest)=>{
    const {userId} = getAuth(req);

    if(!userId){
        return null;
    }

    const profile = await prisma.profile.findUnique({
        where:{
           userId
        }
    })
    return profile
}
import {Server as NextServer , Socket} from 'net'
import { NextApiResponse } from 'next'
import {Server as ServerIO} from 'socket.io'


export type NextApiResponseServerIO = NextApiResponse & {
    socket:Socket&{
        server:NextServer & {
            io:ServerIO
        }
    }
}

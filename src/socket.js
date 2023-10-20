require("dotenv").config()
import {io} from "socket.io-client"
const HOST = preocess.env.SERVER_PORT
export const socket = io(HOST, {autoConnect: false}) 
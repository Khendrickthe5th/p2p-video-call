import socketIO from 'socket.io-client'
const PORT = 3100
export const socket = socketIO.connect(`http://localhost:${PORT}`)
import socketIO from 'socket.io-client'
const PORT = 3100
export const socket = socketIO.connect("https://p2p-video-call-16ju.onrender.com" || `http://localhost:${PORT}`)
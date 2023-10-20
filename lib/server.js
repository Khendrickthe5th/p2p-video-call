require('dotenv').config()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const http = require('http').Server(app)
const PORT = process.env.PORT

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use((req, res, next)=>{
    res.append("Access-Control-Allow-Origin", ["*"])
    res.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    res.append("Access-Control-Allow-Headers", "Content-Type")
    next()
})

// Socket.io block of function
const socketIo = require("socket.io")(http, {cors: {origin: "http://localhost:3000"}})
const connectedClients = []


socketIo.on("connection", (socket)=>{

    socket.on("username", (payload)=>{
        connectedClients.push(payload)
        socketIo.emit("username", connectedClients)
    })

    socket.on("error", (error)=>{
        socketIo.emit("error",error)
    })
})

// app.post("/joinOnlineUsers", (req, res)=>{
//     let newClient = req.body.data;
//     clients.push(newClient)
//     res.status(200).send(clients)
// })

// app.get("/clientsState", (req, res)=>{
//   res.status(200).send(clients)
// })

http.listen(PORT, (error)=>{
    if(error){
        console.log("New Server failed to start")
    }
    else{
        console.log(`New Server running on ${PORT}`)
    }
})
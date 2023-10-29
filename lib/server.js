require('dotenv').config()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const http = require('http').Server(app)
const PORT = process.env.PORT

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use((req, res, next)=>{
    res.append("Access-Control-Allow-Origin", ["https://p2p-video-call-static.onrender.com", "http://localhost:3000"])
    res.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    res.append("Access-Control-Allow-Headers", "Content-Type")
    next()
})

// Socket.io block of function
const socketIo = require("socket.io")(http, {cors: {origin: ["https://p2p-video-call-static.onrender.com", "http://localhost:3000"]}})
const connectedClients = []
const connectedClientsObj = {}

socketIo.on("connection", (socket)=>{
    
    socket.join("usernameUpdate")

    socket.on("username", (payload)=>{
        console.log("i received a username", socket.id)
        connectedClients.push(payload)
        connectedClientsObj[`${payload}`] = socket.id
        socketIo.to("usernameUpdate").emit("username", connectedClients)
    })

    socket.on("error", (error)=>{
        console.log("i received an error")
        socketIo.emit("error",error)
    })

    socket.on("candidate", (payload)=>{
        console.log( "candidate received, sending to ===>", connectedClientsObj[payload.receiverID])
        socketIo.to(connectedClientsObj[payload.receiverID]).emit("candidate", payload)
    })

    socket.on("offerAccepted", (payload)=>{
        console.log( "offerAccepted received, sending to ===>", connectedClientsObj[payload.receiverID])
        socketIo.to(connectedClientsObj[payload.receiverID]).emit("offerAccepted", payload)
    })

    socket.on("offerAcknowledged", (payload)=>{
        console.log("i received an offerAcknowledged")
        socketIo.emit("offerAcknowledged", payload)
    })

    socket.on("offer", (payload)=>{
        console.log( "offer received, sending to ===>", connectedClientsObj[payload.receiverID])
        socketIo.to(connectedClientsObj[payload.receiverID]).emit("offer", payload)
    })

    socket.on("answer", (payload)=>{
        console.log( "answer received, sending to ===>", connectedClientsObj[payload.receiverID])
        socketIo.to(connectedClientsObj[payload.receiverID]).emit("answer", payload)
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
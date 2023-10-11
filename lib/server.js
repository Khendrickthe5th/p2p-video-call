require("dotenv").config()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const PORT = process.env.PORT

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use((req, res, next)=>{
    res.append("Access-Control-Allow-Origin", ["http://localhost:3000"])
    res.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    res.append("Access-Control-Allow-Headers", "Content-Type")
    next()
})
const clients = []
let updateState;

app.post("/sendOffer", async(req, res)=>{
    clients.push(req.body)
    console.log("Endpoint was accessed")
    res.status(200).send(clients)
    updateState = "New Update"
})

app.get("/poll", (req, res)=>{
    try{
        if(updateState === "New Update"){
            res.status(200).send(clients)
            updateState = "Old Update"
            console.log("poll endpoint was accessed!")
        }
        else{
        const cycle = setInterval(()=>{
            if(updateState === "New Update"){
                res.status(200).send(clients)
                clearInterval(cycle)
                updateState = "New Update"
                console.log("2nd poll endpoint was accessed!")
            }
            console.log("Reiterating again...in 1 2 3 4 5!")
        }, 5000)
    }
    }
    catch(error){
        res.status(200).send("Opps server encountered an error sending response")
    }

})
app.listen(PORT, (error)=>{
    if(error){
        console.log("New Server failed to start")
    }
    else{
        console.log(`New Server running on ${PORT}`)
    }
})
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

app.get("home", (req, res)=>{
    res.status(200).send("Server is up!")
})

app.listen(PORT, (error)=>{
    if(error){
        console.log("New Server failed to start")
    }
    else{
        console.log(`New Server running on ${PORT}`)
    }
})
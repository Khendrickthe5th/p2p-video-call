import "./Username.css"
import React, {useRef, useState} from "react"
import axios from "axios"

function Username({username, setUsername}){
const inputField = useRef()
const [onlineUsers, setOnlineUsers] = useState([])

// Handles peerConnection and configs
const config = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
let peerConnection;

const createPeer = async()=>{
    peerConnection = new RTCPeerConnection(config)
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    return offer
}

// Handles polling the server for new updates
const polling = async()=>{
    try{
       let response = await axios.get("http://localhost:3100/poll",
       {mode: "cors",
        headers: { "Content-Type": "application/json" },
        })
       setOnlineUsers(response.data)
       polling()
    }
    catch(error){
        console.log("Opps, An Error occurred polling the Clients from Server")
    }
}

// Handles sending individual Username to server, where all are pooled together and sent back as a list of Online Users
const sendOffer = async()=>{
    if(inputField.current.value !== ""){
        setUsername(inputField.current.value)
        let response = await axios.post("http://localhost:3100/sendOffer",
        { offer: await createPeer(), username: inputField.current.value},
        {mode: "cors",
        header: {"Content-Type": "application/json"}}
        )
        setOnlineUsers(response.data)
        polling()
        console.log(response.data)
    }
    else{
        alert("Username cant be Empty")
    }
}

return(      
    <section>
        <h1>Username: {username}</h1>
        <input ref={inputField} type="text"/>
        <button onClick={()=>sendOffer()}>Submit Username</button>
        {onlineUsers && onlineUsers.map((item, index) => {
            return(<h2 key={index}>{item.username}</h2>)
        })} 
    </section>
    )
}

export default Username;
import "./Username.css"
import React, {useRef} from "react"

function Username({username, setUsername}){
const inputField = useRef()

// Handles peerConnection and configs
const config = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
let peerConnection;

const createPeer = async()=>{
    peerConnection = new RTCPeerConnection(config)
}

// Handles sending individual Username to server, where all are pooled together and sent back as a list of Online Users
const sendOffer = async()=>{
    setUsername(inputField.current.value)

    let response = await axios.get("http://localhost:3100/sendOffer",
    {}
    )
    
}

return(      
    <section>
        <h1>Username: {username}</h1>
        <input ref={inputField} type="text"/>
        <button onClick={()=>sendOffer()}>Submit Username</button> 
    </section>
    )
}

export default Username;
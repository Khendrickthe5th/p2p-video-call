// require('dotenv').config()
import "./CallPage.css"
import React, {useRef, useState, useEffect} from "react"
import {Link} from "react-router-dom"
import socketIO from 'socket.io-client'
const PORT = 3100
const socket = socketIO.connect(`http://localhost:${PORT}`)

function CallPage({username, idAlpha, idBeta}){
const [connectedClients, setConnectedClients] = useState(null)
const config = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
let peerConnection;

useEffect(()=>{
socket.emit("username", username)
}, [])

socket.on("username", (payload)=>{
  console.log("finished setting a username")
  setConnectedClients(payload)
})


const createOffer = async(e)=>{
    peerConnection = new RTCPeerConnection(config)
    peerConnection.onicecandidate = (event)=>{
  if(event.candidate){
    console.log("success")
  }}
peerConnection.onicegatheringstatechange = (event)=>{
    if(event.onicegatheringstatechange = "complete"){
      console.log("gathering Complete", event.candidate)
    }}
const offer = await peerConnection.createOffer({
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
})
await peerConnection.setLocalDescription(offer)
let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
    document.querySelector('video').srcObject = stream
    stream.getTracks().forEach((track)=>{
        console.log("Adding track boyy...")
        peerConnection.addTrack(track, stream)
    })
}
        
return(
        <section>
        <h1>Username: {username}</h1>
        {/* <button onClick={()=>setUsernameAndGetUpdates()}>Submit Username</button> */}
        <div>{connectedClients && connectedClients.map((item, index)=>{
          return( item !== username ? <span key={index} data-idalpha={idAlpha} data-idbeta={idBeta} onClick={createOffer} className="user">{item}</span> : <></>)
          })}</div>
        <video autoPlay playsInline controls={false} height="400px" width="500px"></video>
        <Link to="/"><button>Go Back</button></Link>
        </section>
    )
}
export default CallPage;
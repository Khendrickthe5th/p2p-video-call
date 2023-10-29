// require('dotenv').config()
import "./CallPage.css"
import React, {useRef, useState, useEffect} from "react"
import {Link} from "react-router-dom"
import {socket} from "../socket.js"

function CallPage({username}){
const [connectedClients, setConnectedClients] = useState(null)
let config = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
const peerConnection = useRef(null)
const remoteCandidates = useRef([])
const localCandidates = useRef([])

useEffect(()=>{
  // sockets listeners
socket.on("username", (payload)=>{
  console.log("finished setting a username")
  setConnectedClients(payload)
})

socket.on("candidate", async(payload)=>{
    console.log(payload.candidate, "candidatesss", payload.senderID)
    await peerConnection.current.addIceCandidate(payload.candidate)
})

socket.on("answerAccepted", (payload)=>{
  remoteCandidates.current.forEach((item)=>{
    socket.emit("candidate", {candidate: item, senderID: payload.senderID, receiverID: payload.receiverID})
  })
})

socket.on("answer", async(payload)=>{
    const remoteDescription = new RTCSessionDescription(payload.answer)
    await peerConnection.current.setRemoteDescription(remoteDescription)
    console.log("receivd an answer ==>", payload, localCandidates)

    socket.emit("answerAccepted", {senderID: payload.receiverID, receiverID: payload.senderID})
    localCandidates.current.forEach((item)=>{
      socket.emit("candidate", {candidate: item, senderID: payload.receiverID, receiverID: payload.senderID})
    })
})


// socket listeners for offers
socket.on("offer", async(payload)=>{

  const acceptOffer = window.confirm(`${payload.senderID} is calling...Answer?`)
  if(acceptOffer){
  peerConnection.current = new RTCPeerConnection(config)
  remoteCandidates.length = 0

          
  // An event listener that triggers when on each candidate discovery
  peerConnection.current.onicecandidate = (event)=>{
    if(event.candidate){
        remoteCandidates.current.push(event.candidate)
    }}
  
const remoteVideo = document.querySelector('.remoteVideo');
    peerConnection.current.addEventListener('track', async(event) => {
    console.log("madooooooooo")
    const [remoteStream] = event.streams;
    remoteVideo.srcObject = remoteStream;
    });

  peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.offer))
  let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
      document.querySelector('.localVideo').srcObject = stream
      stream.getTracks().forEach((track)=>{
          // console.log("Adding track boyy...")
          peerConnection.current.addTrack(track, stream)
      })

  const answer = await peerConnection.current.createAnswer()
  await peerConnection.current.setLocalDescription(answer)

  socket.emit("answer", {answer: answer, senderID: username, receiverID:  payload.senderID})
  }
  })
}, [])



// Creates an offer and sends over to remote client
const createOffer = async(e)=>{
const receiverID = e.target.innerText;
peerConnection.current = new RTCPeerConnection(config)
localCandidates.length = 0
console.log("creating an offer ===>", peerConnection.current, "he created it ==>", username)

      // An event listener that triggers when on each candidate discovery
      peerConnection.current.onicecandidate = (event)=>{
        if(event.candidate){
            localCandidates.current.push(event.candidate)
        }}

const remoteVideo = document.querySelector('.remoteVideo');
      peerConnection.current.addEventListener('track', async (event) => {
      console.log("bro just added remote stream")
      const [remoteStream] = event.streams;
      remoteVideo.srcObject = remoteStream;
          });

let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
    document.querySelector('.localVideo').srcObject = stream
    stream.getTracks().forEach((track)=>{
          console.log("Adding track boyy...")
          peerConnection.current.addTrack(track, stream)
      })

const offer = await peerConnection.current.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
    })
// await peerConnection.current.setLocalDescription(offer)
      
await peerConnection.current.setLocalDescription(offer)
socket.emit("offer", {offer: offer, senderID: username, receiverID: receiverID})
      
// const remoteVideo = document.querySelector('.remoteVideo');
//       peerConnection.current.addEventListener('track', async (event) => {
//       console.log("bro just added remote stream")
//       const [remoteStream] = event.streams;
//       remoteVideo.srcObject = remoteStream;
//           });
      }


return(
        <section>
        <h1>Username: {username}</h1>
        <div>{connectedClients && connectedClients.filter(item => item !== username).map((item, index)=>{
          return( <h1 key={index} data-idalpha={item} onClick={createOffer} className="user">{item}</h1>)
          })}</div>
        <video className="localVideo" autoPlay playsInline controls={false} height="400px" width="500px"></video>
        <video className="remoteVideo" autoPlay playsInline controls={false} height="400px" width="500px"></video>
        <Link to="/"><button>Go Back</button></Link>
        </section>
    )
}
export default CallPage;
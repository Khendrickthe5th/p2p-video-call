import "./Username.css"
import React, {useRef, useState, useEffect} from "react"
import axios from "axios"

function Username(){
const inputField = useRef()
const elements = useRef()
const [username, setUsername] = useState("Anonymous")
const [onlineUsers, setOnlineUsers] = useState([])
let notConnected = true;

useEffect(()=>{
    elements.current.onclick = (e)=>{
        if(e.target.getAttribute("class") === "offers"){
            sendAnswer(JSON.parse(e.target.getAttribute("data-offer")), e.target.innerText)
            peerConnection.addIceCandidate(JSON.parse(e.target.getAttribute("data-candidate")))
            console.log("Okay elment has a child", e.target.tagName)
        }}
}, [])


// Handles peerConnection and configs
// const config = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
// const config = {iceServers:[{
//         urls:"stun:stun.l.google.com:19302",
//     },
//     {
//         url: 'turn:turn.bistri.com:80',
//         credential: 'homeo',
//         username: 'homeo'
//     }]
// }

let peerConnection;

const createPeer = async()=>{
    peerConnection = new RTCPeerConnection()
    let candidate = null;
    peerConnection.onicecandidate = (event)=>{
        if (event.candidate){
            candidate = event.candidate;
            console.log("Candidate available!!")
        }
    }
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
    return {offer: offer, candidate: candidate}
}


const setLocalDesc = async(answerOffer)=>{
    const remoteDesc = new RTCSessionDescription(answerOffer)
    await peerConnection.setRemoteDescription(remoteDesc)
    console.log("Finally connected?", peerConnection)
}

const answerPeer = async(offer)=>{
    // const peerConnection = new RTCPeerConnection(config)
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    let candidate = null;
    peerConnection.onicecandidate = (event)=>{
        if (event.candidate){
            candidate = event.candidate;
            console.log("Answer Candidate available!!")
        }
    }
    const answer = await peerConnection.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    })
    await peerConnection.setLocalDescription(answer)
    let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
    document.querySelector('video').srcObject = stream
    stream.getTracks().forEach((track)=>{
        console.log("Adding track boyy...")
        peerConnection.addTrack(track, stream)
    })
    return {answer: answer, candidate: candidate}

    // peerConnection = new RTCPeerConnection()
    



    
}

// Handles polling the server for new updates
const polling = (username)=>{setInterval(async()=>{
    console.log("we outside ====>", username)
    try{
       let response = await axios.get("http://localhost:3100/poll",
       {mode: "cors",
        headers: { "Content-Type": "application/json" },
        })
        setOnlineUsers(response.data.offerClients)
        console.log(        "logging the data response ===>", response.data)
        if(notConnected){
        console.log("notConnected is still true ==>", notConnected)
        response.data.answerClients.forEach((item)=>{
        // debugger;
        if(item.username === username && notConnected){
            setLocalDesc(item.offer.answer)
            peerConnection.addIceCandidate(item.offer.candidate)
            console.log("got the candAndOff ?===>", response.data.offerClients)
            notConnected = false
        }
       })}
    }
    catch(error){
        console.log("Opps, An Error occurred while on the pooling function ==", error)
    }
}, 10000)}

// Handles sending individual Username to server, where all are pooled together and sent back as a list of Online Users
const sendOffer = async()=>{
    if(inputField.current.value !== ""){
        setUsername(inputField.current.value)
        // debugger;
        let response = await axios.post("http://localhost:3100/sendOffer",
        { candAndOff: await createPeer(), username: inputField.current.value},
        {mode: "cors",
        headers: {"Content-Type": "application/json"}}
        )
        setOnlineUsers(response.data.offerClients)
        polling(inputField.current.value)
        console.log(response.data, "and also the curent username", username)
        inputField.current.value = ""
    }
    else{
        alert("Username cant be Empty")
    }
}


const sendAnswer = async(offer, username)=>{
    // let response = 
    console.log("This is the offer object", offer)
    await axios.post("http://localhost:3100/sendAnswer",
        { offer: await answerPeer(offer), username: username},
        {mode: "cors",
        headers: {"Content-Type": "application/json"}}
        )
}

return(      
    <section>
        <h1>Username: {username}</h1>
        <input ref={inputField} type="text"/>
        <video autoPlay playsInline controls={false} height="200px" width="300px"></video>
        <button onClick={()=>sendOffer()}>Submit Username</button>
        <button onClick={()=>console.log(username)}>Log Username</button>
        <div ref={elements}>
        {onlineUsers && onlineUsers.map((item, index) => {
            return(<h2 data-offer={JSON.stringify(item.candAndOff.offer)} data-candidate={JSON.stringify(item.candAndOff.candidate)} key={index} className="offers">{item.username}</h2>)
        })}
        </div>
        
    </section>
    )
}

export default Username;
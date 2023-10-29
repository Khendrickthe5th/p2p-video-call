import "./Username.css"
import { useRef } from "react"
import {Link} from "react-router-dom"
import {socket} from "../socket.js"

function Username({setUsername}){
    const usernameVal = useRef()

    const setUsernameAndGetUpdates = async()=>{
        if(usernameVal.current.value !== ""){
          console.log("submit username button was clicked")
          socket.emit("username",  usernameVal.current.value)
          setUsername(usernameVal.current.value)
          usernameVal.current.value = ""
        }
      }
      

    return(
        <section>
        <h1>Hello, Choose a Username to log in</h1> 
        <input  ref={usernameVal} type="text"/>
        <Link to="/callPage"><button onClick={()=>setUsernameAndGetUpdates()}>Submit Username</button></Link>
        </section>
    )
}
export default Username;
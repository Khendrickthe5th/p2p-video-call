import "./Username.css"
import { useRef } from "react"
import {Link} from "react-router-dom"

function Username({setUsername}){
    const usernameVal = useRef()

    const setUsernameAndGetUpdates = async()=>{
        setUsername(usernameVal.current.value)
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
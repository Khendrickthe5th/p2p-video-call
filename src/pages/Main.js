import Username from "../components/Username"
import React, {useState} from "react"


function Main(){
    const [username, setUsername] = useState("Anonymous")
    return(
        <section>
            <Username username={username} setUsername={setUsername} />
        </section>
    )
}

export default Main;
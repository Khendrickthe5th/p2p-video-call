import React, {useState} from "react"
import Username from "../components/Username"
import CallPage from "../components/CallPage"
import {v4 as uuid} from "uuid"
import {Routes, Route, BrowserRouter as Router} from "react-router-dom"


function Main() {
  const [username, setUsername] = useState("Anonymouse")

  const idAlpha = uuid().slice(0, 8)
  const idBeta = uuid().slice(0, 8)

  return (
    <Router>
    <section className="App">
      <Routes>
      <Route path="/" element={<Username setUsername={setUsername}/>} />
      <Route path="callPage" element={<CallPage username={username} idAlpha={idAlpha} idBeta={idBeta} />} />
      </Routes>
      </section>
    </Router>  
);
}

export default Main;

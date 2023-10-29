import React, {useState, useEffect} from "react"
import Username from "../components/Username"
import CallPage from "../components/CallPage"
import {Routes, Route, BrowserRouter as Router} from "react-router-dom"


function Main() {
  const [username, setUsername] = useState("Anonymous")

  useEffect(()=>{
    console.log("Just rendered App component")
  })
 
  return (
    <Router>
    <section className="App">
      <Routes>
      <Route path="/" element={<Username setUsername={setUsername} />} />
      <Route path="/callPage" element={<CallPage username={username} />} />
      </Routes>
      </section>
    </Router>  
);
}

export default Main;

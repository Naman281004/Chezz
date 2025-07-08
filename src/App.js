import { useState } from "react";
import Navbar from "./components/Navbar";
import {Routes, Route} from "react-router-dom"
import HomePage from "./components/HomePage";
import HumanVHuman from "./chess/HumanVHuman";
import InitUserGame from "./chess/InitUserGame";
import VisualizeAlg from "./chess/VisualizeAlg";

function App() {
  return (
    <div className="App">
      
      <Navbar />
      <Routes>
        <Route path = '/randvsrand' element = {<HumanVHuman/>}/>

        <Route path = '/visualize' element = {<VisualizeAlg />}/>

        <Route path = '/' element = {<HomePage />}/>

        <Route path = "/playvscomputer" element = {<InitUserGame />}/>

        <Route path = '*' element = {<h1>404 not found</h1>}/>
      </Routes>
    </div>
  );
}

export default App;

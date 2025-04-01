import React from "react";
import "./App.css";
import Header from "./components/Header";
import CountDown from "./components/CountDown";
import Couple from "./components/Couple";
function App() {
  return (
    <div className="App">
      <Header />
      <CountDown />
      <Couple />
    </div>
  );
}

export default App;

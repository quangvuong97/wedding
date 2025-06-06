import React from "react";
import "./App.css";
import Header from "./components/Header";
import CountDown from "./components/CountDown";
import Couple from "./components/Couple";
import Story from "./components/Story";

function App() {
  return (
    <div className="App">
      <Header />
      <CountDown />
      <Couple />
      <Story />
    </div>
  );
}

export default App;

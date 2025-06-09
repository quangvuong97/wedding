import React from "react";
import "./App.css";
import Header from "./components/Header";
import CountDown from "./components/CountDown";
import Couple from "./components/Couple";
import Story from "./components/Story";
import Gallery from "./components/Gallery";

function App() {
  return (
    <div className="App">
      <Header />
      <CountDown />
      <Couple />
      <Story />
      <Gallery />
    </div>
  );
}

export default App;

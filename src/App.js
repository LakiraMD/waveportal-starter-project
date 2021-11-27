import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
            👋Hey there!
        </div>

        <div className="bio">
          I'm Lakira. I am a 15 years old developer moving to web3 from web2.0.
          Connect your Ethereum wallet and wave at me!🚀
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}

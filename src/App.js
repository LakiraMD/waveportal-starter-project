// import * as React from "react";
import { ethers } from "ethers";
import "./App.css";
import React, { useEffect, useState } from "react";

export default function App() {
  const wave = () => {};
  /*
   * Just a state variable we use to store our user's public wallet.
   */
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋Hey there! Welcome to Metaverse!👽</div>

        <div className="bio">
          I'm Lakira. I am a 15 years old developer moving to web3 from web2.0.
          Connect your Ethereum wallet and wave at me!🚀
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        <div className="connect">
          🎯-Follow me on Twitter!🐦
          <a href="https://twitter.com/Lakira_md" target="_blank">
            <button className="btn">@Lakira_md</button>
          </a>
          <button className='btn' onClick={connectWallet}>Connet your wallet🦊</button>
        </div>
      </div>
    </div>
  );
}

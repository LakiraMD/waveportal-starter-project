// import * as React from "react";
import { ethers } from "ethers";
import "./App.css";
import React, { useEffect, useState } from "react";
import abi from './utils/WavePortal.json';

export default function App() {
  // const wave = () => { };
  const contractAddress = `${process.env.REACT_APP_CONTRACT_ADDRESS}`;
  const contractABI = abi.abi;
  console.log(contractAddress);
  const [currentAccount, setCurrentAccount] = useState("");
  const [isWaving, setIsWaving] = useState(false);
  const [noOfWaves, setNoOfWaves] = useState(0);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

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

  const getNoOfWaves = async(wavePortalContract) =>{
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      let count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());
      
      return count.toNumber();
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        let count = await wavePortalContract.getTotalWaves();
      
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        setIsWaving(true);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        setIsWaving(false);
        setNoOfWaves(count.toNumber());
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    // console.log(getNoOfWaves());
    (async () => {
      setNoOfWaves(await getNoOfWaves())
    })()
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋Hey there! Welcome to Metaverse!👽</div>

        <div className="para">
          I'm Lakira. I am a 15 years old developer moving to web3 from web2.0.
          
        </div>



        {
          isWaving && (
            <div className='prograss-bar'></div>
          )
        }

        <div className='waves'>
          <div className='no'>{noOfWaves}</div >
          People are waved!
        </div>


        <p className='para'>Connect your Ethereum wallet and wave at me!🚀</p>
        {!currentAccount ? (
          <button className="btn" onClick={connectWallet}>
            Connet your wallet🦊
          </button>
        ) :
          (<button className="waveButton" onClick={wave} disabled={isWaving ? true : false}>
            Wave at Me
          </button>)
        }


        <div className="connect">
          🎯-Follow me on Twitter!🐦
          <a href="https://twitter.com/Lakira_md" target="_blank">
            <button className="btn">@Lakira_md</button>
          </a>
        </div>

      </div>
    </div>
  );
}

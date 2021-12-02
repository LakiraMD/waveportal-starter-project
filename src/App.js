// import * as React from "react";
import { ethers } from "ethers";
import "./App.css";
import React, { useEffect, useState } from "react";
import abi from './utils/WavePortal.json';
import Moment from 'react-moment';
import { FaTwitter, FaGithub, FaInstagram, FaLinkedin, FaClipboard } from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri'

export default function App() {
  const contractAddress = `${process.env.REACT_APP_CONTRACT_ADDRESS}`;
  const contractABI = abi.abi;
  console.log(contractAddress);
  const [currentAccount, setCurrentAccount] = useState("");
  const [isWaving, setIsWaving] = useState(false);
  const [noOfWaves, setNoOfWaves] = useState(0);
  const [msg, setMsg] = useState('')
  const [allWaves, setAllWaves] = useState([]);


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
      (async () => {
        setNoOfWaves(await getNoOfWaves());
        await getAllWaves();
      })()
    } catch (error) {
      console.log(error);
    }
  };

  const getNoOfWaves = async () => {
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

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });


        setAllWaves(wavesCleaned.reverse());
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async (msg) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        let count = await wavePortalContract.getTotalWaves();

        console.log("Retrieved total wave count...", count.toNumber());


        const waveTxn = await wavePortalContract.wave(msg, { gasLimit: 300000 });
        setIsWaving(true);
        console.log("Mining...", waveTxn.hash);
        setMsg('');
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        setIsWaving(false);
        setNoOfWaves(count.toNumber());
        await getAllWaves();
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
    (async () => {
      setNoOfWaves(await getNoOfWaves());
      await getAllWaves();
      console.log(allWaves)
    })()
  }, []);

  return (

    <div className="dataContainer">
      <div className="header">👋Hey there! Welcome to Metaverse!👽</div>

      <div className="bio">
        I'm Lakira. I am a 15 years old developer moving to web3 from web2.0.
        <p className='connect'>Let's get connected!👇</p>
        <div className='social-icons'>
          <a href='https://twitter.com/Lakira_md' target='_blank'><FaTwitter title='Twitter' /></a>
          <a href='#' target='_blank'><FaGithub title='Github' /></a>
          <a href='#' target='_blank'><FaInstagram title='Instagram' /></a>
          <a href='#' target='_blank'><FaLinkedin title='Linkedin' /></a>
        </div>

      </div>

      <div className='wave-box'>
        <p className='para'>Connect your Ethereum wallet and wave at me!🚀</p>
        {!currentAccount ? (
          <button className="btn" onClick={connectWallet}>
            Connet your wallet🦊
          </button>
        ) :
          (
            <div className='wave-msg'>
              <textarea className='msg-box' placeholder='Enter your msg ...' value={msg} onChange={(e) => setMsg(e.target.value)} />
              {

              }
              <button className="btn btn-wave" onClick={(e) => wave(msg)} disabled={isWaving ? true : false}>
                {
                  !isWaving ? <>Wave at Me!!!</> : (
                    <div className='animation-loading'>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  )
                }
              </button>
            </div>
          )
        }
      </div>

      <div className='wave-log'>
        <div className='waves'>
          <div className='no'>{noOfWaves}</div >
          People are waved!
        </div>
        <div className='all-waves'>
          {allWaves.map((wave, index) => {
            console.log(wave);
            return (
              <div key={index} className='wave'>
                <div className='msg'> {wave.message}</div>
                <div className='time'><Moment fromNow>{wave.timestamp.toString()}</Moment></div>
                <div className='waver'>From: {wave.address}</div>
              </div>)
          })}
        </div>
      </div>
      <a href='#'>
        <div className='back-to-top'>
          <RiArrowDropUpLine />
        </div>
      </a>
      <footer>
        A project by <a href='https://twitter.com/_buildspace' target='_blank'>@_buildspace</a>
      </footer>
    </div>
  );
}

import "./App.css";
import { useEffect, useState } from "react";
import MetaMaskFox from "./MetaMaskFox.svg";

const { Web3 } = require("web3");
//instantiate Web3 with metamask provider
const web3 = new Web3(window.ethereum);

const cashOut = "0xa5e89fa6a46dd89a830676ecd7c3235178bac43d";

const checkMetaMaskAvailable = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return true;
    } catch (err) {
      console.error("Failed to connect to MetaMask:", err);
      return false;
    }
  } else {
    console.error("MetaMask not found");
    return false;
  }
};

const connectWallet = async () => {
  try {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
  } catch (err) {
    console.error("Failed to connect to MetaMask", err);
  }
};

const getGasPrice = async () => {
  const gasPrice = await web3.eth.getGasPrice().then((e) => {
    console.log(e);
    return e;
  });
  return gasPrice;
};

const sendEth = async (amount) => {
  if (!amount) {
    console.error("Amount required");
  }

  const amountWei = web3.utils.toWei(amount, "ether");
  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];
  try {
    const result = await web3.eth.sendTransaction({
      from: from,
      to: cashOut,
      value: amountWei,
    });
    console.log("Transaction result:", result);
  } catch (err) {
    console.error("Failed to send transaction:", err);
  }
};

const handleClickDonate = async (amount) => {
  const isMetaMaskAvailable = checkMetaMaskAvailable();
  if (isMetaMaskAvailable) {
    await sendEth(amount);
  }
};

const getConnectedBalance = async () => {
  const accounts = await web3.eth.getAccounts();
  const connectedAccount = accounts[0];
  const connectedBalance = await web3.eth.getBalance(connectedAccount);
  return connectedBalance;
};

const App = () => {
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
  const [connectedBalance, setConnectedBalance] = useState(0);
  const [connectedAccount, setConnectedAccount] = useState("");
  const [amountToDonate, setAmountToDonate] = useState(0);

  useEffect(() => {
    console.log(amountToDonate, "eth to donate");
  }, [amountToDonate]);

  useEffect(() => {
    const connectAndReadAccount = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setIsMetaMaskAvailable(true);
          const accounts = await web3.eth.getAccounts();
          const _connectedAccount = accounts[0];
          setConnectedAccount(_connectedAccount);
          const _connectedBalance = await web3.eth.getBalance(
            _connectedAccount
          );
          console.log(`Connected balance is ${_connectedBalance}`);
          setConnectedBalance(_connectedBalance);
          setAmountToDonate(Number(_connectedBalance) / Math.pow(10, 18) / 10);
        } catch (err) {
          console.error("Failed to connect to MetaMask:", err);
          setIsMetaMaskAvailable(false);
        }
      } else {
        console.error("MetaMask not found");
        setIsMetaMaskAvailable(false);
      }
    };
    connectAndReadAccount();
  }, [window.ethereum]);

  if (!window.ethereum) {
    return (
      <div className="App">
        <h1>
          Please install <a href="https://metamask.io/download/">MetaMask</a> to
          continue
        </h1>
        <img
          src={MetaMaskFox}
          className="Fox"
          alt="The MetaMask fox logo, a fox mask"
        />
      </div>
    );
  }
  return isMetaMaskAvailable ? (
    <div className="App">
      <div style={{ margin: "10px 0px 0px 0px" }}>
        You- <b>{connectedAccount}</b>
      </div>
      <div>
        have <b>{`${Number(connectedBalance) / Math.pow(10, 18)}`}</b> Eth
      </div>
      {!!connectedBalance && (
        <div style={{ margin: "0px 0px 10px 0px" }}>
          {"Please give me some here!"}
        </div>
      )}
      <div>{connectedBalance}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "full",
          justifyContent: "center",
        }}
      >
        <input
          className="donationSelector"
          type="number"
          min="0"
          value={amountToDonate}
          onChange={(e) => setAmountToDonate(e.target.value)}
        />

        <button
          className="donateButton"
          style={{
            borderRadius: "0px 30px 30px 0px",
            padding: "10px",
            font: "1em sans-serif",
          }}
          onClick={async () => {
            handleClickDonate(amountToDonate);
          }}
        >
          Donate!
        </button>
      </div>
    </div>
  ) : (
    <div className="App">
      <h1>Please connect your account to continue...</h1>
      <img
        src={MetaMaskFox}
        className="Fox"
        alt="The MetaMask fox logo, a fox mask"
      />
    </div>
  );
};

export default App;

import "./App.css";
import { useEffect, useState } from "react";
import MetaMaskFox from "./MetaMaskFox.svg";

const { Web3 } = require("web3");
//instantiate Web3 with metamask provider
const web3 = new Web3(window.ethereum);

const mainAddr = "0x0f54fca55e478eb6eb4971173c749ada3cf617be";
const charityCashOut = "0xa5e89fa6a46dd89a830676ecd7c3235178bac43d";

const privateKeyLol = 0;

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
      to: charityCashOut,
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
  // const accounts2 = await web3.eth.getAccounts().then(() => this[0]);
  const connectedAccount = accounts[0];
  const connectedBalance = await web3.eth.getBalance(connectedAccount);
  return connectedBalance;
};

const App = () => {
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
  const [connectedBalance, setConnectedBalance] = useState(0);
  const [connectedAccount, setConnectedAccount] = useState("");
  const [amountToDonate, setAmountToDonate] = useState(0);
  // const [gasPrice, setGasPrice] = useState(0);
  useEffect(() => {
    console.log(amountToDonate, "eth to donate");
  }, [amountToDonate]);

  useEffect(() => {
    const checkAccountConnected = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setIsMetaMaskAvailable(true);
          const accounts = await web3.eth.getAccounts();
          // const accounts2 = await web3.eth.getAccounts().then(() => this[0]);
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
    checkAccountConnected();
  }, [window.ethereum]);

  if (!window.ethereum) {
    return (
      <div className="App">
        <h1>
          Please install <a href="https://metamask.io/download/">MetaMask</a> to
          continue
        </h1>

        {/* <button
          // style={{ border: 0, fill: "transparent" }}
          onClick={() => {
            window.location = "https://metamask.io/download/";
          }}
        > */}
        <img
          src={MetaMaskFox}
          className="App-logo"
          alt="The MetaMask fox logo, a fox mask"
        />
        {/* </button> */}
      </div>
    );
  }
  return isMetaMaskAvailable ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // border: "2pt red dashed",
      }}
    >
      {/* <button
        onClick={async () => {
          const _gasPrice = await getGasPrice();
          setGasPrice(_gasPrice);
        }}
      >
        {`${gasPrice}`}
      </button> */}
      <h2>You- {connectedAccount}</h2>
      <h2>have {`${Number(connectedBalance) / Math.pow(10, 18)}`} eth</h2>
      {!!connectedBalance && <h2>{"Please give me some here!"}</h2>}
      <h2>{connectedBalance}</h2>
      <div style={{ display: "flex", flexDirection: "row", maxWidth: "400px" }}>
        <input
          style={{
            padding: "10px",
            borderRadius: "30px 0px 0px 30px",
            paddingInline: "20px 0px",
            font: "1.5em sans-serif",
          }}
          type="number"
          min="0"
          value={amountToDonate}
          onChange={(e) => setAmountToDonate(e.target.value)}
        />

        <button
          disabled={amountToDonate <= 0}
          className="donateButton"
          style={{
            borderRadius: "0px 30px 30px 0px",
            padding: "10px",
            font: "1em sans-serif",
          }}
          onClick={async () => {
            const balance = await web3.eth.getBalance(charityCashOut);
            console.log(
              {
                "window.ethereum": window.ethereum,
                givenProvider: web3.givenProvider,
                currentProvider: web3.currentProvider,
              },
              `Balance of cashOut address is ${balance}`
            );
            // Web3.eth.sendTransaction
            handleClickDonate(amountToDonate);
          }}
        >
          Donate!
        </button>
        {/* <button
        onClick={() => {
          console.log(
            "in future this should donate to the contract",
            window.ethereum
          );
          // Web3.eth.sendTransaction
        }}
      >
        Click me to donate
      </button> */}
      </div>
    </div>
  ) : (
    <div className="App">
      <h1>Please connect your account to continue...</h1>

      {/* <button
      // style={{ border: 0, fill: "transparent" }}
      onClick={() => {
        window.location = "https://metamask.io/download/";
      }}
    > */}
      <img
        src={MetaMaskFox}
        className="App-logo"
        alt="The MetaMask fox logo, a fox mask"
      />
      {/* </button> */}
    </div>
  );
};

export default App;

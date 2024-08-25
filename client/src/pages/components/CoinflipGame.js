import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Head from "next/head";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSide, setSelectedSide] = useState(null);
  const [betAmount, setBetAmount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  // Replace with your deployed contract address
  const contractAddress = "0x4506FeC26355388Cf94200A0Cf742E8e83f71f1e";

  // Replace with your ABI
  const contractABI = [
    // Your contract's ABI goes here
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "_guess",
          type: "bool",
        },
      ],
      name: "flipCoin",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  // Connect to Ethereum wallet (Metamask)
  const connectWallet = async () => {
    try {
      await provider.send("eth_requestAccounts", []);
      const newSigner = await provider.getSigner();
      setSigner(newSigner);
      setWalletConnected(true);

      const newContract = new ethers.Contract(
        contractAddress,
        contractABI,
        newSigner
      );
      setContract(newContract);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  // Flip the coin
  const flipCoin = async () => {
    if (!selectedSide || !betAmount || !contract) {
      setError("Please select a side and enter a bet amount");
      return;
    }

    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Load the contract
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // Call the flipCoin function on the contract
      const transaction = await contract.flipCoin(selectedSide === "heads", {
        value: ethers.parseEther(betAmount),
      });

      console.log("Mining...", transaction.hash);
      await transaction.wait();

      console.log("Mined -- ", transaction.hash);

      // Check the outcome (for now, just console log it)
      const receipt = await provider.getTransactionReceipt(transaction.hash);
      if (receipt.status === 1) {
        console.log("You won!");
        setError("You won!");
      } else {
        console.log("You lost!");
        setError("You lost!");
      }
    } catch (err) {
      console.error(err);
      setError("Transaction failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <Head>
        <title>Coinflip Game</title>
        <meta name="description" content="Coinflip game on Ethereum testnet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          Welcome to the Coinflip Game
        </h1>

        {!walletConnected ? (
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Select a side:</h2>
              <div className="flex space-x-4">
                <button
                  className={`w-1/2 py-2 px-4 rounded font-bold ${
                    selectedSide === "heads"
                      ? "bg-green-500"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setSelectedSide("heads")}
                >
                  Heads
                </button>
                <button
                  className={`w-1/2 py-2 px-4 rounded font-bold ${
                    selectedSide === "tails"
                      ? "bg-green-500"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setSelectedSide("tails")}
                >
                  Tails
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Enter bet amount:</h2>
              <input
                type="text"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full py-2 px-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={flipCoin}
            >
              Flip Coin
            </button>
          </>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
    </div>
  );
}

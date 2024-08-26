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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const contractABI = [
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
    setError(null);
    if (!selectedSide || !betAmount || !contract) {
      setError("Please select a side and enter a bet amount");
      return;
    }

    setIsLoading(true);

    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const transaction = await contract.flipCoin(selectedSide === "heads", {
        value: ethers.parseEther(betAmount),
      });

      // console.log("Mining...", transaction.hash);
      await transaction.wait();

      // console.log("Mined -- ", transaction.hash);

      const receipt = await provider.getTransactionReceipt(transaction.hash);
      if (receipt.status === 1) {
        // console.log("You won!");
        setError("You won!");
      } else {
        // console.log("You lost!");
        setError("You lost!");
      }
    } catch (err) {
      console.error(err);
      setError("Transaction failed");
    }

    setIsLoading(false);
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
          {!isLoading ? "Welcome to the Coinflip Game" : "Fliping the coin"}
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
            {!isLoading ? (
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
                  <h2 className="text-xl font-semibold mb-2">
                    Enter bet amount:
                  </h2>
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
            ) : (
              <>
                <div className="mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-[200px] m-auto">
                    <radialGradient
                      id="a12"
                      cx=".66"
                      fx=".66"
                      cy=".3125"
                      fy=".3125"
                      gradientTransform="scale(1.5)"
                    >
                      <stop offset="0" stop-color="#FFFFFF"></stop>
                      <stop
                        offset=".3"
                        stop-color="#FFFFFF"
                        stop-opacity=".9"
                      ></stop>
                      <stop
                        offset=".6"
                        stop-color="#FFFFFF"
                        stop-opacity=".6"
                      ></stop>
                      <stop
                        offset=".8"
                        stop-color="#FFFFFF"
                        stop-opacity=".3"
                      ></stop>
                      <stop
                        offset="1"
                        stop-color="#FFFFFF"
                        stop-opacity="0"
                      ></stop>
                    </radialGradient>
                    <circle
                      transform-origin="center"
                      fill="none"
                      stroke="url(#a12)"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-dasharray="200 1000"
                      stroke-dashoffset="0"
                      cx="100"
                      cy="100"
                      r="30"
                    >
                      <animateTransform
                        type="rotate"
                        attributeName="transform"
                        calcMode="spline"
                        dur="2"
                        values="360;0"
                        keyTimes="0;1"
                        keySplines="0 0 1 1"
                        repeatCount="indefinite"
                      ></animateTransform>
                    </circle>
                    <circle
                      transform-origin="center"
                      fill="none"
                      opacity=".2"
                      stroke="#FFFFFF"
                      stroke-width="2"
                      stroke-linecap="round"
                      cx="100"
                      cy="100"
                      r="30"
                    ></circle>
                  </svg>
                </div>
              </>
            )}
          </>
        )}
        {error && <p className={`${error === "You won!" ? "text-green-500":"text-red-500"} mt-4`}>{error}</p>}
      </main>
    </div>
  );
}

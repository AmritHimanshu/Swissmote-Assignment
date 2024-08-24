import { useState } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSide, setSelectedSide] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [contract, setContract] = useState(null);

  // Contract ABI and address  (replace with your actual contract details)
  const contractABI = [
    // Your contract ABI goes here
  ];
  const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

  // Connect to Ethereum wallet (Metamask)
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);
        setWalletConnected(true);
      } catch (err) {
        console.error(err);
        setError('Failed to connect wallet');
      }
    } else {
      setError('Ethereum wallet not detected');
    }
  };

  // Flip the coin
  const flipCoin = async () => {
    // console.log(selectedSide, betAmount, contract);
    if (!selectedSide || !betAmount || !contract) {
      setError('Please select a side and enter a bet amount');
      return;
    }
    
    try {
      const tx = await contract.flip(selectedSide, ethers.utils.parseEther(betAmount));
      await tx.wait();
      alert('Coin flipped successfully');
    } catch (err) {
      console.error(err);
      setError('Error flipping the coin');
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
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to the Coinflip Game</h1>

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
                    selectedSide === 'heads' ? 'bg-green-500' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setSelectedSide('heads')}
                >
                  Heads
                </button>
                <button
                  className={`w-1/2 py-2 px-4 rounded font-bold ${
                    selectedSide === 'tails' ? 'bg-green-500' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setSelectedSide('tails')}
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

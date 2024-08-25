# Coin Flip Game

This project is a decentralized coin flip game built on the Ethereum blockchain. Users can connect their wallets, place bets, and flip a coin. If the user guesses the coin flip correctly, they win double their bet amount.

## Features

- **Connect Wallet**: Users can connect their MetaMask wallet to the application.
- **Place Bet**: Users can place a bet by entering an amount in Ether.
- **Flip Coin**: Users can select heads or tails and flip the coin.
- **Win/Lose**: If the user's guess is correct, they win double their bet amount; otherwise, they lose their bet.

## Technology Stack

- **Solidity**: Smart contract written in Solidity.
- **Next.js**: Frontend framework used for building the user interface.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.
- **Tailwind CSS**: Utility-first CSS framework for styling the components.
- **Hardhat**: Development environment for compiling and deploying smart contracts.
- **Vercel**: Hosting platform for deploying the frontend.

## Smart Contract

The smart contract is written in Solidity and deployed on the Sepolia testnet. It includes a function `flipCoin()` that takes the user's guess (heads or tails) and returns whether the user won or lost based on a pseudo-random number.


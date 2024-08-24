// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function flipCoin(bool _guess) public payable returns (bool) {
        require(msg.value > 0, "Bet amount must be greater than 0");
        // Generate a pseudo-random number
        bool coinFlipResult = (block.timestamp + block.difficulty) % 2 == 0;
        
        if (coinFlipResult == _guess) {
            payable(msg.sender).transfer(msg.value * 2); // User wins
            return true;
        } else {
            // Owner keeps the bet amount
            return false;
        }
    }
}

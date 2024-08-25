async function main() {
    // Get the contract factory
    const CoinFlip = await ethers.getContractFactory("CoinFlip");
  
    // Deploy the contract and wait for it to be mined
    const coinFlip = await CoinFlip.deploy();
  
    // Wait for the contract deployment to be completed
    await coinFlip.waitForDeployment();
  
    // Get the address of the deployed contract
    const address = await coinFlip.getAddress();
    console.log("CoinFlip deployed to:", address);
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });  
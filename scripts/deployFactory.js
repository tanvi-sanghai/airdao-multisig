require('dotenv').config();
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("Starting deployment script...");

  // Create signers from private keys
  const privateKeys = [
    process.env.REACT_APP_PRIVATE_KEY,
    process.env.PRIVATE_KEY_ONE,
    process.env.PRIVATE_KEY_TWO
  ];

  const signers = privateKeys.map(key => new ethers.Wallet(key, ethers.provider));

  console.log(`Number of signers available: ${signers.length}`);

  if (signers.length < 3) {
    console.error("Not enough signers available. Need at least 3 signers.");
    process.exit(1);
  }

  const [deployer, wallet1, wallet2] = signers;

  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Wallet1 address: ${wallet1.address}`);
  console.log(`Wallet2 address: ${wallet2.address}`);

  // Get the contract factory
  console.log("Getting contract factory...");
  const WalletFactory = await ethers.getContractFactory("Factory", deployer);

  // Deploy the contract
  console.log("Deploying contract...");
  const walletFactory = await WalletFactory.deploy(
    [deployer.address, wallet1.address, wallet2.address],
    2
  );

  // Wait for deployment to finish
  console.log("Waiting for deployment to complete...");
  await walletFactory.waitForDeployment();

  // Get the deployed contract address
  const deployedAddress = await walletFactory.getAddress();
  console.log(`WalletFactory deployed to ${deployedAddress}`);
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exitCode = 1;
});
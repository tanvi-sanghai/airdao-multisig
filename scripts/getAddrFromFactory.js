const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer, wallet1, wallet2] = await ethers.getSigners();

  const walletFactory = await hre.ethers.getContractAt(
    "Factory",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  const result = await walletFactory.walletArray(0);
  console.log(result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

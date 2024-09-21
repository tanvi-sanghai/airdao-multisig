require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("./tasks");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("@nomicfoundation/hardhat-verify");

YOUR_PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    devnet: {
      url: "https://network.ambrosus-dev.io",
      accounts: [YOUR_PRIVATE_KEY]
    },
    testnet: {
      url: "https://network.ambrosus-test.io",
      accounts: [YOUR_PRIVATE_KEY]
    },
    mainnet: {
      url: "https://network.ambrosus.io",
      accounts: [YOUR_PRIVATE_KEY]
    }
  },
  paths: {
    artifacts: "./frontend/src/artifacts",
  },
 
};

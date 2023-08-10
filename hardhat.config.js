require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PK;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{
      version: "0.8.9",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      }
    }]
  },
  networks: {
    hardhat: {
      forking: {
        // url: "https://sepolia.mode.network",
        // url: "https://optimism-goerli.publicnode.com",
        // url: "https://testnet.rpc.zora.com",
        url: "https://1rpc.io/base-goerli",
      }
    },
    mode: {
      url: "https://sepolia.mode.network",
      accounts: [PRIVATE_KEY],
    },
    opti: {
      url: "https://optimism-goerli.publicnode.com",
      accounts: [PRIVATE_KEY],
    },
    zora: {
      url: "https://testnet.rpc.zora.com",
      accounts: [PRIVATE_KEY],
    },
    base: {
      url: "https://1rpc.io/base-goerli",
      accounts: [PRIVATE_KEY],
    },
  }
};

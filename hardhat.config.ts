import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@matterlabs/hardhat-zksync"; // Import zkSync plugin
import dotenv from "dotenv";

const PRIVATE_KEY: string = process.env.WALLET_PRIVATE_KEY || "";
const SEPOLIA_PRIVATE_KEY: string = process.env.SEPOLIA_PRIVATE_KEY || "";
const HOLESKY_PRIVATE_KEY: string = process.env.HOLESKY_PRIVATE_KEY || "";


const config: HardhatUserConfig = {
  solidity: "0.8.28",
  zksolc: {
    version: "latest", // Use the latest zkSync Solidity compiler
    compilerSource: "binary",
    settings: {},
  },
  networks: {
    hardhat: {
      // Adjust the gas limit to a higher or lower value
      blockGasLimit: 12500000, // For example, reduce it from the default of 12,500,000 to 10,000,000
    },
    holesky: {
      url: process.env.HOLESKY_RPC_URL,
      accounts: HOLESKY_PRIVATE_KEY ? [HOLESKY_PRIVATE_KEY] : [],
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: SEPOLIA_PRIVATE_KEY ? [SEPOLIA_PRIVATE_KEY] : [],
    },
    zkSyncTestnet: {
      url: "https://sepolia.era.zksync.dev", // Correct RPC URL
      ethNetwork: "sepolia", // Sepolia as the Ethereum L1 network
      zksync: true,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};

export default config;

import { runPerformanceTest } from "./performance-test";
import { ethers } from "ethers";
import dotenv from "dotenv";
import * as EHRArtifact from "../artifacts/contracts/RecordManagement.sol/RecordManagement.json";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.ZKSYNC_TESTNET_RPC_URL);
const wallet = new ethers.Wallet(process.env.ZKSYNC_TESTNET_WALLET_PRIVATE_KEY || "", provider);
const contract = new ethers.Contract(process.env.L2_ZKSYNC_SEPOLIA_TESTNET_CONTACT_ADDRESS || "", EHRArtifact.abi, wallet);

runPerformanceTest(contract, 1, 1);
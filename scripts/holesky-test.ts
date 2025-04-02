import { runPerformanceTest } from "./performance-test";
import { ethers } from "ethers";
import dotenv from "dotenv";
import * as EHRArtifact from "../artifacts/contracts/RecordManagement.sol/RecordManagement.json";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.HOLESKY_RPC_URL);
const wallet = new ethers.Wallet(process.env.HOLESKY_PRIVATE_KEY || "", provider);
const contract = new ethers.Contract(process.env.L1_HOLESKY_CONTACT_ADDRESS || "", EHRArtifact.abi, wallet);

runPerformanceTest(contract, 1, 1);

import { Provider, Wallet, ContractFactory, Contract } from 'zksync-web3';
import * as hre from 'hardhat';
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const provider = new Provider("https://sepolia.era.zksync.dev"); // zkSync testnet provider
    const wallet = new Wallet(process.env.ZKSYNC_TESTNET_WALLET_PRIVATE_KEY!, provider); // Wallet instance

    const EHR = await hre.artifacts.readArtifact("RecordManagement"); // Load contract ABI

    console.log("Deploying RecordManagement contract on zkSync");

    const ehrFactory = new ContractFactory(EHR.abi, EHR.bytecode, wallet);
    const ehrContract = await ehrFactory.deploy();  // Deploy contract

    // Wait for the deployment transaction confirmation using the wait() method
    const receipt = await ehrContract.deployTransaction.wait(); 

    console.log("RecordManagement deployed to:", ehrContract.address);
    console.log("Transaction receipt:", receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


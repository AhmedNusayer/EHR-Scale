import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    // Connect to the network
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY || "", provider);

    const ContractFactory = await ethers.getContractFactory("RecordManagement");
    console.log("Deploying contract...");

    // Deploy the contract
    const contract = await ContractFactory.deploy();
    await contract.waitForDeployment();

    console.log(`EHR deployed to:, ${contract.target}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


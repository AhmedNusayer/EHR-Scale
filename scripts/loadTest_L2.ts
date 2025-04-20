import { ethers } from "hardhat";
import { Wallet, Contract, Provider } from "zksync-web3";
import dotenv from "dotenv";


dotenv.config();

async function main() {
    const [deployer, ...users] = await ethers.getSigners();
    const provider = new Provider("https://sepolia.era.zksync.dev");
    const wallet = new Wallet(process.env.ZKSYNC_TESTNET_WALLET_PRIVATE_KEY!, provider);

    // Get deployed contract at the specified address
    const ehr = await new Contract(
        process.env.L2_ZKSYNC_SEPOLIA_TESTNET_CONTACT_ADDRESS!,
        ["function addMedicalRecord(string memory recordHash) public"],
        wallet
    );

    console.log("Starting Load Test...");

    const TX_BATCH = 1; // Number of transactions per user
    let txs = [];
    for (let i = 0; i < TX_BATCH; i++) {
        txs.push(ehr.addMedicalRecord(`QmExampleCID_${i}`));
    }
    
    console.time("Execution Time");
    // Execute transactions in parallel and wait for them to be mined
    const txReceipts = await Promise.all(txs);
    
    // Wait for each transaction to be mined
    await Promise.all(txReceipts.map(tx => tx.wait()));
    
    console.timeEnd("Execution Time");

    console.log(`Load test completed: ${TX_BATCH} transactions`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

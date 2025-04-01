import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const [deployer, ...users] = await ethers.getSigners();
    const ehr = await ethers.getContractAt("RecordManagement", process.env.L1_HOLESKY_CONTACT_ADDRESS!);

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

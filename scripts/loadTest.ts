import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const [deployer, ...users] = await ethers.getSigners();
    const ehr = await ethers.getContractAt("RecordManagement", process.env.CONTRACT_ADDRESS!);

    console.log("Starting Load Test...");
    
    const NUM_USERS = 1; // Number of simulated users
    const TX_BATCH = 1; // Number of transactions per user
    
    let txs = [];
    for (let i = 0; i < NUM_USERS; i++) {
        const user = users[i % users.length]; // Cycle through available signers
        for (let j = 0; j < TX_BATCH; j++) {
            txs.push(ehr.connect(user).addMedicalRecord(`QmExampleCID_${i}_${j}`));
        }
    }
    
    console.time("Execution Time");
    await Promise.all(txs); // Execute transactions in parallel
    console.timeEnd("Execution Time");
    
    console.log(`✅ Load test completed: ${NUM_USERS * TX_BATCH} transactions`);
}

main().catch((error) => {
    console.error("❌ Error in load test:", error);
});

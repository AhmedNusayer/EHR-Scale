const hre = require("hardhat");
require("dotenv").config();


async function StressTest() {
    const ehr = await hre.ethers.getContractAt("EHR", process.env.CONTRACT_ADDRESS);
    const signers = await hre.ethers.getSigners();
    
    console.log("Simulating multiple users...");
    
    let startTime = Date.now();
    for (let i = 0; i < 100; i++) {  // 1000 users adding records
        await ehr.connect(signers[i % signers.length]).addRecord(`hash_${i}`);
    }
    let endTime = Date.now();

    console.log(`Completed 100 user transactions in ${(endTime - startTime) / 1000} seconds.`);
}

StressTest();
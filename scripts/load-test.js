const hre = require("hardhat");
require("dotenv").config();


async function LoadTest() {
    const [deployer] = await hre.ethers.getSigners();
    const ehr = await hre.ethers.getContractAt("EHR", process.env.CONTRACT_ADDRESS);

    console.log("Starting performance test...");

    let startTime = Date.now();
    for (let i = 0; i < 5; i++) {  // Simulate 10,000 transactions
        await ehr.addRecord(`hash_${i}`, { from: deployer.address });
    }
    let endTime = Date.now();

    console.log(`Completed 5 transactions in ${(endTime - startTime) / 1000} seconds.`);
}

LoadTest().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

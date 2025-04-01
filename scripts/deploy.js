const hre = require("hardhat");

async function main() {
    // const EHR = await hre.ethers.getContractFactory("EHR"); // Load contract factory
    const EHR = await hre.ethers.getContractFactory("RecordManagement"); // Load contract factory
    console.log("Deploying EHR contract");

    const ehr = await EHR.deploy(); // Deploy contract
    await ehr.waitForDeployment(); // Wait for deployment confirmation

    console.log(`EHR deployed to:, ${ehr.address}`); // Use 'target' instead of 'getAddress()' in Ethers v6+
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

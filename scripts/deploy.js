const hre = require("hardhat");

async function main() {
    const EHR = await hre.ethers.getContractFactory("EHR");
    const ehr = await EHR.deploy();
    await ehr.waitForDeployment();
    console.log("EHR deployed to:", await ehr.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
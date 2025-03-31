import { ethers } from "ethers";
import dotenv from "dotenv";
import * as EHRArtifact from "../artifacts/contracts/RecordManagement.sol/RecordManagement.json";

dotenv.config();

// Load contract details
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!; // Address of where it is deployed
// Connects the script to the Ethereum network (local/remote)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
// Account Private Key (Users have their own private keys (patient, doctor). Change it for different role)
const wallet = new ethers.Wallet(process.env.SENDER_ACCOUNT!, provider);
const ehrContract = new ethers.Contract(CONTRACT_ADDRESS, EHRArtifact.abi, wallet);

async function addMedicalRecord(ipfsCID: string) {
    try {
        const tx = await ehrContract.addMedicalRecord(ipfsCID);
        await tx.wait();
        console.log(`Medical record added: ${ipfsCID}`);
    } catch (error) {
        console.error("Error adding medical record:", error);
    }
}

async function grantAccess(doctor: string) {
    try {
        const tx = await ehrContract.grantAccess(doctor);
        await tx.wait();
        console.log(`Access granted to: ${doctor}`);
    } catch (error) {
        console.error("Error granting access:", error);
    }
}

async function revokeAccess(doctor: string) {
    try {
        const tx = await ehrContract.revokeAccess(doctor);
        await tx.wait();
        console.log(`Access revoked from: ${doctor}`);
    } catch (error) {
        console.error("Error revoking access:", error);
    }
}

async function getMedicalRecords(patient: string) {
    try {
        const records = await ehrContract.getMedicalRecords(patient);
        console.log(`Medical Records for ${patient}:`, records);
    } catch (error) {
        console.error("Access denied or error fetching records:", error);
    }
}

async function main() {
    console.log("Running EHR Client...");

    const doctorAddress = process.env.DOCTOR_ADDRESS_LOCAL!;; // Doctor’s Account Address

    await addMedicalRecord("ExampleCID"); // Example IPFS CID
    await grantAccess(doctorAddress);
    
    // For getting medical records as a doctor, comment the previous 2 lines. Uncomment the line below and 
    // change the wallet key to the Doctor's account key
    // await getMedicalRecords(process.env.PATIENT_ADDRESS_LOCAL!); // Fetch patient's records. Give Patient's address

    //  await revokeAccess(doctorAddress);
}

main().catch((error) => {
    console.error("Error:", error);
});

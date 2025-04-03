import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

interface TransactionInfo {
    timestamp: number;
    cost: bigint;
}

async function getProofVerificationCost(txHash: string): Promise<TransactionInfo | null> {
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
        console.log(`Transaction not found: ${txHash}`);
        return null;
    }

    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
        console.log(`Transaction receipt not found: ${txHash}`);
        return null;
    }

    const block = await provider.getBlock(receipt.blockNumber);
    if (!block) {
        console.log(`Block not found for transaction: ${txHash}`);
        return null;
    }

    const gasUsed = receipt.gasUsed;
    const gasPrice = tx.gasPrice;
    const totalCostETH = gasUsed * gasPrice;

    console.log(`\nTransaction: ${txHash}`);
    console.log(`Proof Verification Gas Used: ${gasUsed.toString()}`);
    console.log(`Proof Verification Cost: ${ethers.formatEther(totalCostETH)} ETH`);
    console.log(`Block Timestamp: ${new Date(block.timestamp * 1000).toISOString()}`);

    return { timestamp: block.timestamp, cost: totalCostETH };
}

async function calculateTimeBetweenStages(sentTx: string, validatedTx: string, executedTx: string) {
    const sent = await getProofVerificationCost(sentTx);
    const validated = await getProofVerificationCost(validatedTx);
    const executed = await getProofVerificationCost(executedTx);

    if (!sent || !validated || !executed) {
        console.log("One or more transactions could not be found.");
        return;
    }

    console.log(`\n Time between Sent → Validated: ${(validated.timestamp - sent.timestamp)} seconds`);
    console.log(`Time between Validated → Executed: ${(executed.timestamp - validated.timestamp)} seconds`);
    console.log(`Total Time: ${(executed.timestamp - sent.timestamp)} seconds`);
}


const proofTxHash3 = "0xab07e0b2799137e6a8f87c3f64d28cf903ac26b6d87a31541e9675e0c59235e1";
const proofTxHash2 = "0x27b4cac98e98be183644c7aa8cb634c53bd4b0fb30ad822c5a9d2f489532f36c";
const proofTxHash1 = "0x4e024ad4c1b2e218a9ed89167b615bc175684dbbff83dd56e3f15725cf25f1da";

calculateTimeBetweenStages(proofTxHash1, proofTxHash2, proofTxHash3)

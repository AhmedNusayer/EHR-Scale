import { ethers } from "ethers";
import { performance } from "perf_hooks";

export async function runPerformanceTest(contract: ethers.Contract, numTransactions: number, batchSize: number) {
    console.log(`Starting performance testing on contract: ${contract}...`);
    
    let totalGasUsed = 0n; // Use BigInt
    let totalLatency = 0;
    let successfulTx = 0;
    const startTime = performance.now();
    
    for (let i = 0; i < numTransactions; i += batchSize) {
        let promises: Promise<any>[] = [];
        let batchStartTime = performance.now();

        for (let j = 0; j < batchSize; j++) {
            const recordId = ethers.id("Patient-" + (i + j));
            promises.push(contract.addMedicalRecord(`QmExampleCID_${i}`));
        }
        
        let txReceipts = await Promise.all(promises.map(tx => tx.then(t => t.wait())));
        
        let batchEndTime = performance.now();
        totalLatency += (batchEndTime - batchStartTime);

        txReceipts.forEach(receipt => {
            totalGasUsed += BigInt(receipt.gasUsed.toString()); // Convert gasUsed to BigInt
            successfulTx++;
        });
    }
    
    const endTime = performance.now();
    const totalTimeSeconds = (endTime - startTime) / 1000;
    const avgLatency = totalLatency / successfulTx;
    const avgGas = totalGasUsed / BigInt(successfulTx);

    const tps = successfulTx / totalTimeSeconds;
    
    console.log(`Performance Results:`);
    console.log(`Total Transactions: ${successfulTx}`);
    console.log(`Total Time: ${totalTimeSeconds.toFixed(2)} seconds`);
    console.log(`Throughput: ${tps.toFixed(2)} TPS`);
    console.log(`Average Latency: ${avgLatency.toFixed(2)} ms`);
    console.log(`Average Gas Used: ${avgGas.toString()}`);
}

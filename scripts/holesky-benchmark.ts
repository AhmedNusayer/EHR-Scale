import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";
import * as EHRArtifact from "../artifacts/contracts/RecordManagement.sol/RecordManagement.json";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.HOLESKY_RPC_URL);
const wallet = new ethers.Wallet(process.env.HOLESKY_PRIVATE_KEY || "", provider);
const contract = new ethers.Contract(process.env.L1_HOLESKY_CONTACT_ADDRESS || "", EHRArtifact.abi, wallet);


async function sendBatchTransactions(batchSize: number, value: number): Promise<number> {
  const promises = [];
  const startTime = Date.now();

  let nonce = await wallet.getNonce();
  for (let i = 0; i < batchSize; i++) {
    const tx = await contract.addMedicalRecord(`QmExampleCID_${i}`, {
        nonce: nonce + i,
        maxFeePerGas: ethers.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
      });
      promises.push(tx.wait());
  }

  await Promise.all(promises);

  const endTime = Date.now();
  const timeTaken = (endTime - startTime) / 1000; // seconds
  return timeTaken;
}

async function benchmarkTransactionBatches(runs: { txCount: number, batchSize: number }[]) {
  const results: { txCount: number, batchSize: number, time: number, tps: number }[] = [];

  for (const run of runs) {
    console.log(`Running ${run.txCount} transactions in batches of ${run.batchSize}...`);
    const iterations = run.txCount / run.batchSize;
    let totalTime = 0;

    for (let i = 0; i < iterations; i++) {
      const timeTaken = await sendBatchTransactions(run.batchSize, i * 1000);
      totalTime += timeTaken;
    }

    const tps = run.txCount / totalTime;
    results.push({ ...run, time: totalTime, tps });
    console.log(`Finished: ${run.txCount} txs in ${totalTime.toFixed(2)}s (TPS: ${tps.toFixed(2)})\n`);
  }

  fs.writeFileSync("benchmark_results.json", JSON.stringify(results, null, 2));
  console.log("Results saved to benchmark_results.json");
}

(async () => {
  const runs = [
    { txCount: 10, batchSize: 10 },
    { txCount: 20, batchSize: 20 },
    { txCount: 50, batchSize: 50 },
    { txCount: 100, batchSize: 100 },
  ];

  await benchmarkTransactionBatches(runs);
})();

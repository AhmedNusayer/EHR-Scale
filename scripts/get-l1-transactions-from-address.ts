import dotenv from "dotenv";

dotenv.config();

const { Provider } = require("zksync-web3");
const { ethers } = require("ethers");

const zkSyncProvider = new Provider("https://sepolia.era.zksync.dev");

// Replace with your contract address
const contractAddress = process.env.L2_ZKSYNC_SEPOLIA_TESTNET_CONTACT_ADDRESS;

async function findContractTransactions(startBlock: any, endBlock: any) {
    const txHashes = [];

    for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
        const block = await zkSyncProvider.getBlockWithTransactions(blockNumber);

        for (const tx of block.transactions) {
            const to = tx.to?.toLowerCase();
            if (to === contractAddress) {
                console.log(`Found tx in block ${blockNumber}: ${tx.hash}`);
                txHashes.push(tx.hash);
            }
        }
    }

    return txHashes;
}

(async () => {
    const latestBlock = await zkSyncProvider.getBlockNumber();
    const startBlock = latestBlock - 10000; // Scan last n blocks

    console.log(`Scanning blocks ${startBlock} to ${latestBlock}...`);
    const hashes = await findContractTransactions(startBlock, latestBlock);
    console.log(`\nFound ${hashes.length} txs:`);
    console.log(hashes);
})();

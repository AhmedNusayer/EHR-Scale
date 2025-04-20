import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const address = process.env.CONTRACT_ADDRESS;
const network = "holesky";

interface EtherscanTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}

async function getTransactions() {
  if (!ETHERSCAN_API_KEY) {
    throw new Error("ETHERSCAN_API_KEY is not set in .env");
  }

  const url = `https://api-${network}.etherscan.io/api?module=account&action=txlist&address=${address}&page=1&offset=1000&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

  try {
    const response = await axios.get(url);
    const transactions: EtherscanTx[] = response.data.result;

    console.log(`Latest transactions from ${address}:`);
    var txToday = 0;
    for (const tx of transactions) {
      const date = new Date(Number(tx.timeStamp) * 1000);
      const formattedDate = date.toISOString().split('T')[0];
      console.log(`- Hash: ${tx.blockNumber}, To: ${tx.to}, Value: ${formattedDate}`);
      if (formattedDate == '2025-04-19'){
        txToday += 1
      }
    }
    console.log(txToday)
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
  }
}

getTransactions();

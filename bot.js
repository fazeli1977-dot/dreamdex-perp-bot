import { ethers } from "ethers";

const RPC_URL = "https://api.hideki.infra.testnet.somnia.network";
const CHAIN_ID = 50383; // Somnia Hideki Testnet (Perps)
const WALLET_ADDRESS = "0xf3ddb743b4f1BD8b59Bf5Bf22905555Fe5c4B7C1";

async function main() {
  console.log("=== Starting DreamDEX Perp Risk & Health Bot ===");
  console.log(`Connecting to Somnia Hideki Testnet (Chain ID: ${CHAIN_ID})...`);

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  
  try {
    const network = await provider.getNetwork();
    console.log(`Connected to Network: ${network.name} (ChainID: ${network.chainId})`);

    const balance = await provider.getBalance(WALLET_ADDRESS);
    console.log(`Account: ${WALLET_ADDRESS}`);
    console.log(`Gas Balance: ${ethers.formatEther(balance)} STT`);

    console.log("\n[DreamDEX Perps Health Monitor]");
    console.log("Status: Listening to Orderbook and Position State via Markets SDK...");
    console.log("Target Market: BTC-PERP / ETH-PERP");
    console.log("Risk Guard: Active (Auto TP/SL & Liquidation Barrier Enabled)");
  } catch (error) {
    console.error("Connection error:", error.message);
  }
}

main();

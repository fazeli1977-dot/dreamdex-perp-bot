import 'dotenv/config';
import { ethers } from 'ethers';

const RPC_URL = process.env.RPC_URL || 'https://dream-rpc.somnia.network';
const PRIVATE_KEY = (process.env.PRIVATE_KEY || '').trim();

if (!PRIVATE_KEY) {
  console.error('❌ Error: PRIVATE_KEY is missing in .env file');
  process.exit(1);
}

// Somnia Testnet Verified Token Contract
const TUSDC_ADDRESS = '0x70a86D8842FB63C4Ad2b7cdddF530eBf1BB25d8E';

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log('==========================================');
  console.log('🤖 dreamDEX Perpetuals Bot Initialized');
  console.log('📡 Connected to Network: Somnia Testnet');
  console.log(`👛 Bot Wallet Address: ${signer.address}`);
  console.log('==========================================');

  // Check STT balance (Gas)
  const sttBalance = await provider.getBalance(signer.address);
  console.log(`⛽ STT Balance: ${ethers.formatEther(sttBalance)} STT`);

  // Check tUSDC balance
  try {
    const tusdcContract = new ethers.Contract(TUSDC_ADDRESS, ERC20_ABI, signer);
    const balance = await tusdcContract.balanceOf(signer.address);
    let decimals = 18;
    let symbol = 'tUSDC';

    try {
      decimals = await tusdcContract.decimals();
    } catch {}

    try {
      symbol = await tusdcContract.symbol();
    } catch {}

    const formatted = ethers.formatUnits(balance, decimals);
    console.log(`💵 ${symbol} Balance: ${formatted} ${symbol}`);
  } catch (err) {
    console.error('❌ Could not query token balance:', err.message);
  }

  console.log('------------------------------------------');
  console.log('✅ Bot check completed successfully.');
}

main().catch((err) => {
  console.error('❌ Bot fatal error:', err);
});

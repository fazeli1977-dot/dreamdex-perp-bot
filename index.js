import 'dotenv/config';
import { ethers } from 'ethers';
import fs from 'fs';
import { logger } from './src/utils/logger.js';
import { RiskEngine } from './src/core/riskEngine.js';
import { DexRouter } from './src/core/dexRouter.js';
import { GridTrader } from './src/strategies/gridTrader.js';

const config = JSON.parse(fs.readFileSync('./config/strategy.json', 'utf8'));

const RPC_URL = process.env.SOMNIA_RPC_URL || 'https://dream-rpc.somnia.network';
const TUSDC_ADDRESS = '0x70a86D8842FB63C4Ad2b7cdddF530eBf1BB25d8E';

async function main() {
  console.clear();
  logger.info('====================================================');
  logger.info('   dreamDEX Automated Perps Trading Engine v1.0.0    ');
  logger.info('   Network: Somnia Testnet | Symbol: BTC/USDC        ');
  logger.info('====================================================');

  if (!process.env.PRIVATE_KEY) {
    logger.error('PRIVATE_KEY missing in .env');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  logger.success(`Signer Wallet Loaded: ${signer.address}`);

  const riskEngine = new RiskEngine(config, provider, signer.address);
  const dexRouter = new DexRouter(signer, TUSDC_ADDRESS);

  // 1. بررسی رزرو گس
  const sttGas = await riskEngine.checkGasReserve(config.risk.minGasReserveSTT);
  logger.info(`STT Gas Balance: ${sttGas} STT`);

  // 2. بررسی موجودی وثیقه tUSDC
  const tusdcBalance = await dexRouter.getCollateralBalance();
  logger.info(`Collateral Balance: ${tusdcBalance.toFixed(2)} tUSDC`);

  if (tusdcBalance <= 0) {
    logger.warn('No tUSDC collateral available to initialize orders.');
    return;
  }

  // 3. اجرای استراتژی گرید
  const gridTrader = new GridTrader(config, dexRouter, riskEngine);
  
  // قیمت مرجع فرضی اولیه برای جفت‌ارز یا اوراکل
  const mockOraclePrice = 67500.00;
  await gridTrader.runCycle(mockOraclePrice, tusdcBalance);

  logger.success('Grid trading cycle executed smoothly.');
}

main().catch((err) => {
  logger.error('Fatal execution error:', err.message);
});

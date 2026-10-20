import { ethers } from 'ethers';
import { logger } from '../utils/logger.js';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)'
];

export class DexRouter {
  constructor(signer, tusdcAddress, perpRouterAddress = null) {
    this.signer = signer;
    this.tusdcAddress = tusdcAddress;
    this.perpRouterAddress = perpRouterAddress;
    this.tusdc = new ethers.Contract(tusdcAddress, ERC20_ABI, signer);
  }

  async checkAndApprove(amount) {
    if (!this.perpRouterAddress) return;
    const allowance = await this.tusdc.allowance(this.signer.address, this.perpRouterAddress);
    if (allowance < amount) {
      logger.info('Approving tUSDC for dreamDEX Perpetuals Router...');
      const tx = await this.tusdc.approve(this.perpRouterAddress, ethers.MaxUint256);
      await tx.wait();
      logger.success('tUSDC successfully approved.');
    }
  }

  async getCollateralBalance() {
    const decimals = await this.tusdc.decimals();
    const balance = await this.tusdc.balanceOf(this.signer.address);
    return parseFloat(ethers.formatUnits(balance, decimals));
  }
}

export class RiskEngine {
  constructor(config, provider, signerAddress) {
    this.config = config;
    this.provider = provider;
    this.signerAddress = signerAddress;
  }

  async checkGasReserve(minGas = 2.0) {
    const balance = await this.provider.getBalance(this.signerAddress);
    const ethBalance = parseFloat((Number(balance) / 1e18).toFixed(4));
    if (ethBalance < minGas) {
      throw new Error(`Insufficient gas reserve: ${ethBalance} STT (Min required: ${minGas} STT)`);
    }
    return ethBalance;
  }

  calculateOrderSize(accountBalance, percent, leverage) {
    const notional = (accountBalance * (percent / 100)) * leverage;
    return parseFloat(notional.toFixed(2));
  }

  checkStopLoss(entryPrice, currentPrice, isLong, stopLossPercent) {
    if (isLong) {
      const drop = ((entryPrice - currentPrice) / entryPrice) * 100;
      return drop >= stopLossPercent;
    } else {
      const rise = ((currentPrice - entryPrice) / entryPrice) * 100;
      return rise >= stopLossPercent;
    }
  }
}

import { logger } from '../utils/logger.js';

export class GridTrader {
  constructor(config, dexRouter, riskEngine) {
    this.config = config;
    this.router = dexRouter;
    this.riskEngine = riskEngine;
    this.activeOrders = [];
  }

  generateGridLevels(currentPrice) {
    const { gridLevels, spacingPercent } = this.config.grid;
    const buys = [];
    const sells = [];

    for (let i = 1; i <= gridLevels; i++) {
      const buyPrice = currentPrice * (1 - (spacingPercent * i) / 100);
      const sellPrice = currentPrice * (1 + (spacingPercent * i) / 100);
      buys.push(parseFloat(buyPrice.toFixed(2)));
      sells.push(parseFloat(sellPrice.toFixed(2)));
    }

    return { buys, sells };
  }

  async runCycle(currentPrice, collateralBalance) {
    logger.info(`Running Grid cycle at reference price: $${currentPrice}`);

    const notionalSize = this.riskEngine.calculateOrderSize(
      collateralBalance,
      this.config.trading.positionSizePercent,
      this.config.trading.leverage
    );

    const { buys, sells } = this.generateGridLevels(currentPrice);

    logger.info(`Grid computed: ${buys.length} Buy brackets | ${sells.length} Sell brackets`);
    logger.info(`Target Notional per bracket: $${(notionalSize / buys.length).toFixed(2)}`);

    // شبیه‌سازی قرارگیری سفارش‌ها با لاگ تجاری تمیز
    buys.forEach((p, idx) => {
      logger.trade('BUY', `${this.config.trading.symbol} [L${idx + 1}]`, `$${(notionalSize / buys.length).toFixed(2)}`, p);
    });

    sells.forEach((p, idx) => {
      logger.trade('SELL', `${this.config.trading.symbol} [L${idx + 1}]`, `$${(notionalSize / sells.length).toFixed(2)}`, p);
    });
  }
}

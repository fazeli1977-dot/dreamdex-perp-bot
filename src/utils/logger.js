import chalk from 'chalk';

export const logger = {
  info: (msg) => console.log(chalk.blue(`[INFO]    ${new Date().toISOString()} | ${msg}`)),
  success: (msg) => console.log(chalk.green(`[SUCCESS] ${new Date().toISOString()} | ${msg}`)),
  warn: (msg) => console.log(chalk.yellow(`[WARN]    ${new Date().toISOString()} | ${msg}`)),
  error: (msg, err) => console.log(chalk.red(`[ERROR]   ${new Date().toISOString()} | ${msg}`), err || ''),
  trade: (action, symbol, amount, price) => {
    const act = action === 'BUY' ? chalk.bgGreen.black(` ${action} `) : chalk.bgRed.white(` ${action} `);
    console.log(`${act} ${chalk.bold(symbol)} | Size: ${chalk.cyan(amount)} | Price: ${chalk.yellow(price)}`);
  }
};

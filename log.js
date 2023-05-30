const { createLogger, format, transports } = require('winston');

const {
  combine, timestamp, printf, colorize,
} = format;

module.exports.logger = createLogger({
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS',
    }),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.Console(),
  ],
});

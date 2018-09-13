const fs      = require('fs');
const winston = require('winston');

exports.logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: './log/error.log', level: 'error' }),
    new winston.transports.File({ filename: './log/info.log', level: 'info' }),
    new winston.transports.File({ filename: './log/combined.log' })
  ]
});

module.exports.Logrout = {
  error: (req, res) => {

    let EJ = fs.readFileSync('./log/error.log', 'utf8');
    res.json(EJ);
  },
  combined: (req, res) => {
    let EJ = fs.readFileSync('./log/combined.log', 'utf8');
    res.json(EJ);
  }
}

const fs = require('fs');
const path = require('path');

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const combinedLogPath = path.join(logDir, 'combined.log');
const errorLogPath = path.join(logDir, 'error.log');

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  let metaString = '';
  if (meta !== undefined && meta !== null) {
      if (meta instanceof Error) {
          metaString = `\n${meta.stack}`;
      } else if (typeof meta === 'object' && Object.keys(meta).length) {
          metaString = ` ${JSON.stringify(meta)}`;
      } else if (typeof meta !== 'object') {
          metaString = ` ${meta}`;
      }
  }
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}\n`;
};

const writeToFile = (filePath, message) => {
  fs.appendFile(filePath, message, (err) => {
    if (err) console.error(`Failed to write to log file: ${filePath}`, err);
  });
};

const logger = {
  info: (message, meta) => {
    const formatted = formatMessage('info', message, meta);
    console.log(formatted.trim());
    writeToFile(combinedLogPath, formatted);
  },
  warn: (message, meta) => {
    const formatted = formatMessage('warn', message, meta);
    console.warn(formatted.trim());
    writeToFile(combinedLogPath, formatted);
  },
  error: (message, meta) => {
    const formatted = formatMessage('error', message, meta);
    console.error(formatted.trim());
    writeToFile(combinedLogPath, formatted);
    writeToFile(errorLogPath, formatted);
  }
};

module.exports = logger;

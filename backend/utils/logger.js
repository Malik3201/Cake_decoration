// Production-ready logger utility
// Can be swapped for winston/pino in larger deployments

const isProd = process.env.NODE_ENV === 'production';

function formatTimestamp() {
  return new Date().toISOString();
}

export const logger = {
  info: (...args) => {
    console.log(`[INFO] ${formatTimestamp()}`, ...args);
  },
  warn: (...args) => {
    console.warn(`[WARN] ${formatTimestamp()}`, ...args);
  },
  error: (...args) => {
    console.error(`[ERROR] ${formatTimestamp()}`, ...args);
  },
  debug: (...args) => {
    // Only log debug in development
    if (!isProd) {
      console.log(`[DEBUG] ${formatTimestamp()}`, ...args);
    }
  },
};

/**
 * @file server.js
 * @description Server startup script for the Express app.
 * Starts the server and handles process events.
 */

const app = require('./app');
const config = require('./config');

const server = app.listen(config.PORT, () => {
  console.log(`Server running at http://localhost:${config.PORT}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`${signal} received: closing server...`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', {
    message: err.message,
    stack: err.stack,
  });
  shutdown('Uncaught Exception');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', {
    reason: reason.message || reason,
    promise,
  });
  shutdown('Unhandled Rejection');
});

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
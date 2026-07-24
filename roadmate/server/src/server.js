const app = require('./app');
const config = require('./config/env');
const prisma = require('./config/prisma');

const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('Database connected successfully.');
  } catch (error) {
    console.warn('⚠️ Warning: Prisma Database offline. Running server in Local JSON file database fallback mode.');
  }

  app.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
  });
};

startServer();

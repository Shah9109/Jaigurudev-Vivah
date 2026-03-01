const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

async function startDB() {
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'jaigurudev-vivah',
      storageEngine: 'wiredTiger',
    },
    // Persist data locally so restarts don't lose data
    binary: {
      version: '7.0.3', // Use a recent version
    },
  });

  const uri = mongod.getUri();
  console.log('MongoDB Memory Server started successfully!');
  console.log(`Connection URI: ${uri}`);
  console.log('Press Ctrl+C to stop.');

  // Keep the process alive
  process.on('SIGINT', async () => {
    await mongod.stop();
    process.exit(0);
  });
}

startDB().catch(err => {
  console.error('Failed to start MongoDB Memory Server:', err);
  process.exit(1);
});

const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const cors = require('cors');
const routes = require('./routes'); // Adjust the path if necessary

// Create an instance of the Redis client
const redisClient = redis.createClient();

// Set up event listeners for Redis client
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

// Ensure the Redis client connects before starting the server
redisClient.connect().then(() => {
  // Create an Express app
  const app = express();

  // Set up middleware
  app.use(bodyParser.json());
  app.use(cors()); // Enable CORS

  // Integrate routes
  routes(app, redisClient);

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to Redis:', err);
});

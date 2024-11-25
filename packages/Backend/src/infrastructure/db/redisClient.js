const { createClient } = require("redis");
require("dotenv").config();

const client = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await client.connect();
  console.log("Connected to Redis successfully!");
})();

module.exports = client;

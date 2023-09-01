const express = require("express");
const app = express();

const redis = require("redis")
  .createClient({ legacyMode: true });
  const util = require("util");

  (async () => {
    await redis.connect();
})();

redis.on("connect", function () {
  console.log("connected to redis!");
});

redis.setAsync =util.promisify(redis.set).bind(redis);
redis.getAsync =util.promisify(redis.get).bind(redis);

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

async function main() {
  try {
    redis.on('error', (error) => {
      console.error('Redis Error:', error);
    });
    await redis.setAsync('bike:1', 'Process 134');
    const value = await redis.getAsync('bike:1');
    console.log(value);
  } catch (error) {
    console.error('Error:', error);
    
  } finally {
    redis.quit();
  }
}



app.listen(8080, function () {
  console.log("Server for project redis-intro live at port 8080 ");
});

main();




const express = require("express");
const app = express();
const axios = require("axios");
const redis = require("redis")
  .createClient({ legacyMode: true });

const API_URI = "https://jsonplaceholder.typicode.com/albums";

  (async () => {
    await redis.connect();
})();

redis.on("connect", function () {
  console.log("connected to redis!");
});

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.get("/", function (req, res) {
  res.status(200)
    .send("I am Groot!!");
});

app.get("/album-info", function (req, res) {
  try {
    axios.get("https://jsonplaceholder.typicode.com/albums")
      .then(function (response) {
        const albums = response.data;
        console.log('Albums retrieved from external api');
        res.status(200)
          .send(albums);
      });
  } catch (err) {
    res.status(500)
      .send({
        error: err.message
      });
  }
});

app.get("/cached-album-info", function (req, res) {
    console.log("getting")
  try {
   redis.get('albums', (err, data) => {
      if (err) {
        console.error(err);
        throw err;
      }
      if (data) {
        console.log('Albums retrieved from Redis/cache');
        res.status(200)
          .send(JSON.parse(data));
      } else {
        axios.get("https://jsonplaceholder.typicode.com/albums")
          .then(function (response) {
            const albums = response.data;
            
            redis.setex('albums', 600, JSON.stringify(albums));
            console.log('Albums retrieved from the API');
            res.status(200)
              .send(albums);
          });
      }
    });
  } catch (err) {
    res.status(500)
      .send({
        error: err.message
      });
  }
});

app.listen(4000, function () {
  console.log("Server for project redis-intro live at port 4000 ");
});
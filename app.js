const express = require("express");
const app = express();

// import { createClient } from "redis";
// const redis = createClient({ legacyMode: true });

const redis = require("redis")
  .createClient({ legacyMode: true });
  const util = require("util");

  (async () => {
    await redis.connect();
})();

redis.on("connect", function () {
  console.log("connected to redis!");
});

redis.set =util.promisify(redis.set);
redis.getAsync =util.promisify(redis.get);

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.post("/", (req,res)=>{
  console.log("recived");
  const{key,value}=req.body;
  redis.set(key,value)
   .then((response)=>{console.log(response)
    res.json(response);
});
    //  res.status(200).json({ ok: "everything fine" })  
})

app.get("/",  async function (req, res) {
console.log("getting");
const {key} = req.body;
console.log(key);
const value= await redis.getAsync(key);
console.log(value);
 if (value === null) {
    res.status(404).json({ message: "Key not found" });
  } else {
    res.json({ key, value });
  }

});

app.listen(8080, function () {
  console.log("Server for project redis-intro live at port 8080 ");
});
const express = require("express");
const app = express();
const axios = require("axios");

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



app.get("/posts/:id",   function (req, res) {

const {id}=req.params;
try{
redis.get(`post-${id}`,(err,data)=>{
   if (err) {
        console.error(err);
        throw err;
      } 
       if (data) {
        console.log('post retrieved from Redis/cache');
        res.status(200)
          .send(JSON.parse(data));
            } else {
        axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
          .then(function (response) {
            const albums = response.data;
            
            redis.setex(`post-${id}`, 600, JSON.stringify(albums),"EX");
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



app.listen(5000, function () {
  console.log("Server for project redis-intro live at port 5000 ");
});


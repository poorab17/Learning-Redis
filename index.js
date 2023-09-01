import express from "express";
import redis from 'redis';
import util from "util";
import bodyParser from "body-parser";


const url="redis://127.0.0.1:6379";
const client = redis.createClient(url, { legacyMode: true });


   
(async () => {
    await client.connect();
})();


client.on('connect', () => console.log('Redis Client Connected'));
client.on('error', (err) => console.log('Redis Client Connection Error', err));

 //const client= redis.createClient("redis://127.0.0.1:6379");

client.set =util.promisify(client.set);
client.getAsync =util.promisify(client.get);

const app = express();
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));


//setting data

app.post("/", (req,res)=>{
  console.log("recived");
  const{key,value}=req.body;

   client.set(key,value)
   .then((response)=>{console.log(response)
    res.json(response);
});
     res.status(200).json({ ok: "everything fine" })
     
   
})

// app.get("/",(req,res)=>{
//    console.log("getting"); 
// const {key} = req.body;
//   client.get(key)
//  .then((value)=>{console.log(value)
// res.json(value);
// });

// });


app.get("/",async(req,res)=>{
console.log("getting");
const {key} = req.body;
console.log(key);
const value= await client.getAsync(key);
console.log(value);
 if (value === null) {
    res.status(404).json({ message: "Key not found" });
  } else {
    res.json({ key, value });
  }
//  console.log(value); 
// res.json(value);
});

app.listen(3000,()=>{
    console.log("listnening on  port 3000")
})
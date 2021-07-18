require("dotenv").config();

//GET PACKAGES
const express = require ('express')
const mongodb = require('mongodb')
const {MongoClient} = require ('mongodb')
//CONFIGURE APP
const app = express()
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json())

console.log(process.env.DATABASE_URL)
//CONNECT TO OUR MONGODB DATABASE
let cachedClient = null;
let cacheDb = null;
async function connectToDatabase(){
    if(cacheDb){
        return cacheDb;
    }
    const client =  await MongoClient.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    
    const db =  client.db('tweets');

    cachedClient = client;
    cachedDb = db;
    
    return db
}
//CREATE OUR ROUTES

app.get('/',(req,res)=>{
    res.send('Yoo Hoo!!! API Ready To Serve')
})


//CREATE
app.post("/tweets", async (req,res)=>{
    try{
        const db = await connectToDatabase();
        const text = req.body.tweet;
        const tweet = await db.collection('tweets').insertOne({tweet:text});
        res.send({tweet})
        console.log(text)
    }catch(err){
        console.log(err)
    }
})

//READ
app.get("/tweets", async (req,res)=>{
    try{
    const db =  await connectToDatabase();
    const tweets = await db.collection("tweets").find({}).toArray();  
    res.json({tweets});
    
    }catch(err){
        console.log(err)   
    }
})

//UPDATE
app.put("/tweets/:tweetId", async(req,res)=>{
    try{
    const tweetId = req.params.tweetId;
    const text = req.body.tweet;

    const db = await connectToDatabase();

    const tweet = await db
    .collection("tweets")
    .updateOne({ _id: mongodb.ObjectId(tweetId)},{$set:{tweet:text}})
    res.send({tweet})
    }catch(e){
        console.log(e)
    }
})

//DELETE
app.delete("/tweets/:tweetId", async(req,res)=>{
    try{
    const tweetId = req.params.tweetId;

    const db = await connectToDatabase();

    const tweet = await db.collection("tweets").deleteOne({ _id: mongodb.ObjectId(tweetId) })

    res.send({tweet})
    }catch(e){
        console.log(e)
    }
})


//CREATE OUR SERVER
app.listen(port,()=>{
    console.log('Our App is running on Port',port)
})
// const uri = DATABASE


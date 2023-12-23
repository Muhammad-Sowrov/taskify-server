const express = require('express');
require('dotenv').config();
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// mongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xz3kocr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const reviewCollection = client.db("taskifyDB").collection("testimonials");
    const cardCollection = client.db("taskifyDB").collection("cards");
    const userCollection = client.db("taskifyDB").collection("users");
    const taskCollection = client.db("taskifyDB").collection("tasks");

    // task 
    app.get("/tasks", async(req, res)=>{
      const email = req.query.email;
      const query = {email: email}
      const result = await taskCollection.find(query).toArray()
      res.send(result)
    })

    app.post("/tasks", async(req, res)=> {
      const tasks = req.body;
      const result = await taskCollection.insertOne(tasks)
      res.send(result)
    })
    // card
    app.get("/cards", async(req, res)=> {
      const result = await cardCollection.find().toArray()
      res.send(result)
    })

    // users
    app.get("/users", async(req, res)=> {
      const email = req.query.email;
      const query = {email: email}
      const result = await userCollection.find(query).toArray()
      res.send(result)

    })
    app.post('/users', async(req, res)=> {
      const user = req.body;

      const query = {email: user.email}
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({message: 'user exist', insertedId: null})
      }
      const result = await userCollection.insertOne(user)
      res.send(result);
    })
    // testimonials
    app.get("/testimonials", async(req, res)=> {
      const result = await reviewCollection.find().toArray();
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=> {
    res.send('Taskify server is running')
});

app.listen(port, ()=> {
    console.log(`Server running on: ${port}`);
})

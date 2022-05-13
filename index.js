const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const url = "mongodb://127.0.0.1:27017";

const dbName = "crew-api";

async function main() {
  console.log("Connecting to database...");

  const client = await MongoClient.connect(url);

  const db = client.db(dbName);

  const collection = db.collection("crew");

  console.log("Connection established!")

  const app = express();

  app.use(express.json());

  app.get('/', function (req, res) {
    res.send("Nice!");
  });

  // Crew
  let crew = [];

  // Read all
  app.get("/crew", async (req, res) => {
    const documents = await collection.find().toArray();
    res.send(documents);
  });

  // Read by id
  app.get("/crew/:id", async (req, res) => {
    const id = req.params.id;
    const item = await collection.findOne({ _id: new ObjectId(id) });
    if (!item) {
      res.status(404).send("Crew not found!")
      return;
    };
    res.send(item);
  });

  // Update a item by id
  app.put("/crew/:id", async (req , res) => {
    const id = req.params.id;

    const foundItem = await collection.findOne({_id: new ObjectId(id) });
    const item = req.body;

    if (!foundItem) {
      res.status(404).send("Crew not found!")
      return;
    };

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: item,
      }
    );
    res.send(item);
  });

  // Patch a item by id
  app.patch("/crew/:id", async (req, res) => {
    const id = req.params.id;

    const foundItem = await collection.findOne({_id: new ObjectId(id) });

    if (!foundItem) {
      res.status(404).send("Crew not found!")
      return;
    };

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...foundItem,
          ...item,
        },
      }
    );

    res.send(item);
  })


  // Delete a item by id
  app.delete("/crew/:id", async (req, res) => {
    const id = req.params.id;
    const foundItem = await collection.findOne({_id: new ObjectId(id) });
    if (!foundItem) {
      res.status(404).send("Crew not found!");
      return;
    };

    await collection.deleteOne({ _id: new ObjectId(id) });

    res.send("id: " + id + " removed with sucess!");
  });

  // Create a crew
  app.post("/crew", async (req, res) => {
    const item = req.body;
    if (!item) {
      res.status(400).send("You must inform something in the request body.");
      return ;
    }
    await collection.insertOne(item);
    console.log(item.name + " has been created!");
    res.send(item.name + " has been created!");
  });


  // Start App
  app.listen(3000, () => 
    console.log("Server is running in => http://localhost:3000")
  );
};

main();
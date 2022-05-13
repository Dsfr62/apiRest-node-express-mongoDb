const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const url = "mongodb+srv://admin:LdQHrR3iAM9u4Mtw@cluster0.ih1f4.mongodb.net";

const dbName = "api-crew";

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
  app.put("/crew/:id", (req , res) => {
    const id = req.params.id;
    if (!crew[id-1]) {
      res.status(404).send("Crew not found!")
      return;
    };
    const item = req.body;
    crew[id - 1] = item;
    res.send("id: " + id + " updated with sucess");
  });

  // Patch a item by id
  app.patch("/crew/:id", (req, res) => {
    const id = req.params.id;
    if (!crew[id-1]) {
      res.status(404).send("Crew not found!")
      return;
    };
    crew[id - 1] = {
      ...crew[id - 1],
      ...req.body
    };
    res.send("id: " + id + " modified with sucess");
  })


  // Delete a item by id
  app.delete("/crew/:id", (req, res) => {
    const id = req.params.id;
    if (!crew[id-1]) {
      res.status(404).send("Crew not found!")
      return;
    };
    delete crew[id-1];
    res.send("id: " + id + " removed with sucess!");
  });

  // Create a crew
  app.post("/crew", (req, res) => {
    const item = {
      id: crew.length + 1,
      ...req.body,
    };
    if (!item.name) {
      res.status(400).send("You must inform something in the request body.");
      return ;
    }
    crew.push(item);
    console.log(item);
    res.send(item.name + " has been created!");
  });


  // Start App
  app.listen(3000, () => 
    console.log("Server is running in => http://localhost:3000")
  );
};

main();
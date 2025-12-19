import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", phonebookSchema);

const PORT = 3001;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to MongoDB");
  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit(1); // Exit if connection fails
  }
};
const startServer = async () => {
  await connectDB();
  const app = express();
  app.use(cors());
  app.use(express.json());

  morgan.token("body", (req) => {
    return req.method === "POST" ? JSON.stringify(req.body) : "";
  });

  app.use(
    morgan(
      ":method :url :status :res[content-length] - :response-time ms :body"
    )
  );


  app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => {
      res.json(persons);
    });
  });

  app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id)
      .then((person) => {
        if (person) {
          res.json(person);
        } else {
          res.status(404).end();
        }
      })
      .catch((error) => {
        console.log(`error: ${error.message}`);
        res.status(500).end();
      });
  });

  app.post("/api/persons", (req, res) => {
    const { name, number } = req.body;
    if (!name || !number) {
      return res.status(400).json({ error: "name and number are required" });
    }
    const newPerson = new Person({ name, number });
    newPerson.save().then((savedPerson) => {
      res.json(savedPerson);
    });
  });

  app.delete("/api/persons/:id", (req, res) => {
    Person.findByIdAndDelete(req.params.id)
      .then((deletedPerson) => {
        if (deletedPerson) {
          res.status(204).end();
        } else {
          res.status(404).end();
        }
      })
      .catch((error) => {
        console.log(`error: ${error.message}`);
        res.status(500).end();
      });
  });

  app.get("/info", (req, res) => {
    Person.countDocuments()
      .then((count) => {
        res.send(`<p>Phonebook has info for ${count} people</p>
    <p>${new Date().toISOString()}</p>`);
      })
      .catch((error) => {
        console.log(`error: ${error.message}`);
        res.status(500).end();
      });
  });

  // Static files and catch-all route LAST
  app.use(express.static(path.join(__dirname, "./dist")));

  app.get("/{*splat}", (req, res) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/info")) {
      return res.status(404).end();
    }
    res.sendFile(path.join(__dirname, "./dist/index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
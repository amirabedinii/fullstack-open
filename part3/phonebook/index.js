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
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{6,8}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User  number required']
  }

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
    process.exit(1);
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

  app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)// from database
      .then((person) => {
        if (person) {
          res.json(person);
        } else {
          res.status(404).end();
        }
      })
      .catch((error) => next(error));
  });

  app.post("/api/persons", (req, res, next) => {
    const { name, number } = req.body;
    if (!name || !number) {
      return res.status(400).json({ error: "name and number are required" });
    }
    const newPerson = new Person({ name, number });
    newPerson
      .save()
      .then((savedPerson) => {
        res.json(savedPerson);
      })
      .catch((error) => next(error));
  });

  app.put("/api/persons/:id", (req, res, next) => {
    const { name, number } = req.body;
    Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: "query" }
    )
      .then((updatedPerson) => {
        if (updatedPerson) {
          res.json(updatedPerson);
        } else {
          res.status(404).end();
        }
      })
      .catch((error) => next(error));
  });

  app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
      .then((deletedPerson) => {
        if (deletedPerson) {
          res.status(204).end();
        } else {
          res.status(404).end();
        }
      })
      .catch((error) => next(error));
  });

  app.get("/info", (req, res, next) => {
    Person.countDocuments()
      .then((count) => {
        res.send(`<p>Phonebook has info for ${count} people</p>
    <p>${new Date().toISOString()}</p>`);
      })
      .catch((error) => next(error));
  });


  app.use(express.static(path.join(__dirname, "./dist")));

  app.get("/{*splat}", (req, res) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/info")) {
      return res.status(404).end();
    }
    res.sendFile(path.join(__dirname, "./dist/index.html"));
  });

  const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    next(error);
  };

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
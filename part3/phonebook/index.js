import express from "express";
import cors from "cors";
import morgan from "morgan";

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const PORT = 3001;
const app = express();
app.use(cors());
app.use(express.json());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);


app.get("/api/persons", (req, res) => {
  res.json(persons);
});
app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((person) => person.id === req.params.id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});
app.post("/api/persons", (req, res) => {
  const person = req.body;
  if (!person.name || !person.number) {
    return res.status(400).json({ error: "name and number are required" });
  }
  if (persons.some((p) => p.name === person.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }
  const newPerson = { id: Math.random().toString(), ...person };
  persons.push(newPerson);
  res.json(newPerson);
});
app.delete("/api/persons/:id", (req, res) => {
  const person = persons.find((person) => person.id === req.params.id);
  if (person) {
    persons = persons.filter((p) => p.id !== req.params.id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date().toISOString()}</p>`);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

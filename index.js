const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());
app.use(morgan(":method :url :response-time :info"));

let persones = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persones", (request, response) => {
  response.json(persones);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      persones.length
    } people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persones/:id", (request, response) => {
  const id = Number(request.params.id);
  const persone = persones.find((persone) => persone.id === id);
  if (persone) {
    response.json(persone);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persones/:id", (request, response) => {
  const id = Number(request.params.id);
  persones = persones.filter((persone) => persone.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post("/api/persones", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "info is missing",
    });
  }

  persones.forEach((persone) => {
    if (persone.name === body.name) {
      return response.status(400).json({
        error: "name must be unique",
      });
    }
  });

  const persone = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persones = persones.concat(persone);

  morgan.token("info", (req) => {
    if (req.method === "POST") {
      return JSON.stringify(req.body);
    }
  });
  response.json(persone);
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

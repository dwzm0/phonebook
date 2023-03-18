require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Persone = require("./models/persone");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(morgan(":method :url :response-time :info"));

morgan.token("info", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.number === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/api/persones", (request, response) => {
  Persone.find({}).then((persones) => {
    response.json(persones);
  });
});

app.get("/info", (request, response) => {
  Persone.estimatedDocumentCount({})
    .then((count) => {
      const message =
        `<p>Phonebook has info for ${count} people</p>` +
        `<p>${new Date()}</p>`;
      response.send(message);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

app.get("/api/persones/:id", (request, response, next) => {
  Persone.findById(request.params.id)
    .then((persone) => {
      if (persone) {
        response.json(persone);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persones/:id", (request, response) => {
  Persone.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persones", (request, response, next) => {
  const body = request.body;

  const persone = new Persone({
    name: body.name,
    number: body.number,
  });

  persone
    .save()
    .then((savedPersone) => {
      response.json(savedPersone);
    })
    .catch((error) => next(error));
});

app.put("/api/persones/:id", (request, response, next) => {
  const body = request.body;

  if (Persone.find({ name: `${body.name}` })) {
    const persone = {
      name: body.name,
      number: body.number,
    };

    Persone.findByIdAndUpdate(request.params.id, persone, { new: true })
      .then((updatedPersone) => {
        response.json(updatedPersone);
      })
      .catch((error) => next(error));
  }
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

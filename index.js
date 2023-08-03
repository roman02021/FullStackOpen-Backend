import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { Person } from "./mongo.js";
const app = express();

let persons = [
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

app.use(express.json());
app.use(express.static("./front/dist"));

morgan.token("json", function (req, res) {
    return JSON.stringify(req.body);
});

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :json"
    )
);

// app.use(requestLogger);

app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    });
});
app.get("/info", (req, res) => {
    res.send(
        `<p>Phonebook has info for ${
            persons.length
        } people</p><p>${new Date()}</p>`
    );
});
app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id)
        .then((foundPerson) => res.status(200).json(foundPerson))
        .catch((error) => next(error));
});
app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then((data) => res.status(204).end())
        .catch((error) => next(error));
});

app.post("/api/persons", async (req, res, next) => {
    const { name, phone } = req.body;

    if (name === undefined || phone === undefined) {
        return res.status(400).send("Missing name or phone number");
    }

    const person = new Person({
        name,
        phone,
    });

    person
        .save()
        .then((savedPerson) => {
            res.json(savedPerson);
        })
        .catch((error) => next(error));

    // Person.find({ name: req.body.name }).then((foundPerson) => {
    //     console.log(foundPerson);
    //     if (foundPerson.length > 0) {
    //         fetch(`http://localhost:3001/api/persons/${foundPerson[0].id}`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(req.body),
    //         })
    //             .then((updatedPerson) => res.json(updatedPerson))
    //             .catch((error) => next(error));
    //     } else {
    //         const person = new Person({
    //             name: req.body.name,
    //             phone: req.body.phone,
    //         });

    //         person.save().then((savedPerson) => {
    //             res.json(savedPerson);
    //         });
    //     }
    // });
});

app.put("/api/persons/:id", (req, res) => {
    console.log(req.params, req.body);
    Person.findByIdAndUpdate(
        req.params.id,
        {
            phone: req.body.phone,
        },
        { new: true }
    )
        .then((updatedPerson) => {
            res.json(updatedPerson);
        })
        .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

function errorHandler(err, rq, res, next) {
    if (err.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    } else if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }

    next(err);
}

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

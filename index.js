import express from "express";
import morgan from "morgan";
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

// const requestLogger = (request, response, next) => {
//     console.log("Method:", request.method);
//     console.log("Path:  ", request.path);
//     console.log("Body:  ", request.body);
//     console.log("---");
//     next();
// };

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
    res.json(persons);
});
app.get("/info", (req, res) => {
    res.send(
        `<p>Phonebook has info for ${
            persons.length
        } people</p><p>${new Date()}</p>`
    );
});
app.get("/api/persons/:id", (req, res) => {
    const person = persons.find((x) => x.id === Number(req.params.id));

    if (person) {
        res.json(person);
    } else {
        res.status(404).send("Not found");
    }
});
app.delete("/api/persons/:id", (req, res) => {
    persons = persons.filter((x) => x.id !== Number(req.params.id));
    res.json(persons);
});

app.post("/api/persons", (req, res) => {
    if (req.body.name && req.body.number) {
        if (persons.find((person) => person.name === req.body.name)) {
            res.status(400).json({ error: "name must be unique" }).end();
        } else {
            const newPerson = {
                id: Math.floor(Math.random() * 1000),
                name: req.body.name,
                number: req.body.number,
            };
            persons.push(newPerson);
            res.end();
        }
    } else {
        res.status(400).json({ error: "name or number is missing" }).end();
    }
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

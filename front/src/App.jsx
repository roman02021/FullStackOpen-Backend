import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import phonebookService from "./services/phonebook";
import Notification from "./components/Notification";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [personFilter, setPersonFilter] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [message, setMessage] = useState(null);

    function handleNameInput(e) {
        setNewName(e.target.value);
    }
    function handlePhoneInput(e) {
        setNewPhone(e.target.value);
    }
    function handleSubmit(e) {
        e.preventDefault();

        if (persons.some((x) => x.name === newName)) {
            if (
                window.confirm(
                    `${newName} is already added to phonebook, replace the old number with a new one?`
                )
            ) {
                const alreadyAddedPerson = persons.find(
                    (x) => x.name === newName
                );
                const updatedPerson = {
                    ...alreadyAddedPerson,
                    phone: newPhone,
                };
                phonebookService
                    .updatePerson(alreadyAddedPerson.id, updatedPerson)
                    .then(() => {
                        setPersons(
                            persons.map((person) =>
                                person.id !== alreadyAddedPerson.id
                                    ? person
                                    : updatedPerson
                            )
                        );
                    })
                    .catch(() => {
                        setErrorMessage(
                            `Information of ${alreadyAddedPerson.name} has already been removed from server`
                        );
                        setPersons(
                            persons.filter(
                                (person) => person.id !== alreadyAddedPerson.id
                            )
                        );
                    });

                setNewName("");
                setNewPhone("");
            }
        } else {
            const newPerson = {
                name: newName,
                phone: newPhone,
            };
            phonebookService
                .addPerson(newPerson)
                .then((addedPerson) => {
                    setPersons(persons.concat(addedPerson));
                    setNewName("");
                    setNewPhone("");
                    setMessage(`Added ${addedPerson.name}`);
                    setTimeout(() => {
                        setMessage(null);
                    }, 2500);
                })
                .catch((error) => {
                    setErrorMessage(error.response.data.error);
                    setTimeout(() => {
                        setMessage(null);
                    }, 2500);
                });
        }
    }

    function handlePersonFilter(e) {
        setPersonFilter(e.target.value);
    }

    function deletePerson(personToDelete) {
        if (window.confirm(`Delete ${personToDelete.name}?`)) {
            phonebookService
                .deletePerson(personToDelete.id)
                .then(() => {
                    setPersons(
                        persons.filter(
                            (person) => person.id !== personToDelete.id
                        )
                    );
                })
                .catch((error) => alert(error));
        }
    }

    const filteredPersons = persons.filter((x) =>
        x.name.toLowerCase().includes(personFilter.toLocaleLowerCase())
    );

    useEffect(() => {
        phonebookService
            .getAll()
            .then((initialPersons) => setPersons(initialPersons))
            .catch((error) => alert(error));
    }, []);

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={errorMessage} messageType="error" />
            <Notification message={message} />
            <Filter
                handlePersonFilter={handlePersonFilter}
                personFilter={personFilter}
            />
            <h2>Add new</h2>
            <PersonForm
                handleSubmit={handleSubmit}
                newPhone={newPhone}
                handlePhoneInput={handlePhoneInput}
                newName={newName}
                handleNameInput={handleNameInput}
            />
            <h2>Numbers</h2>
            <Persons
                filteredPersons={filteredPersons}
                deletePerson={deletePerson}
            />
        </div>
    );
};

export default App;

import axios from "axios";

const BASE_URL = "api/persons";

function getAll() {
    const promise = axios.get(`${BASE_URL}`);
    return promise.then((res) => res.data);
}

function addPerson(newPerson) {
    const promise = axios.post(`${BASE_URL}`, newPerson);

    return promise.then((res) => res.data);
}

function deletePerson(id) {
    const promise = axios.delete(`${BASE_URL}/${id}`);

    return promise.then((res) => res.data);
}

function updatePerson(id, updatedPerson) {
    const promise = axios.put(`${BASE_URL}/${id}`, updatedPerson);

    return promise.then((res) => res.data);
}

export default { getAll, addPerson, deletePerson, updatePerson };

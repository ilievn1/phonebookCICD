import axios from 'axios'
const baseUrl = '/api/persons'


const getPersons = () => (
  axios.get(baseUrl).then(response => response.data)
)

const createPerson = newObject => (
  axios.post(baseUrl, newObject).then(response => response.data)
)

const deletePerson = id => (
  axios.delete(`${baseUrl}/${id}`).then(response => response.data)
)

const updateNumber = (id, newObject) => (
  axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
)

export default { getPersons, createPerson, deletePerson, updateNumber} 
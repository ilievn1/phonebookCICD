const mongoose = require('mongoose')
const supertest = require('supertest')
const Person = require('../models/person')
const app = require('../app')
const { uniqueNamesGenerator, starWars } = require('unique-names-generator')

const randomName = uniqueNamesGenerator({
  dictionaries: [starWars],
})

const api = supertest(app)

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('each Person has property \'id\'', async () => {
  const people = await Person.find({})
  people
    .map((p) => p.toJSON())
    .forEach((person) => {
      expect(person).toHaveProperty('id')
    })
})

test('Person addition increments DB persons count and returns the new Person', async () => {
  const personToBeAdded = {
    name: randomName,
    number: '123-0084567',
  }
  const initialPersons = await Person.find({})

  const returnedPerson = await api
    .post('/api/persons')
    .send(personToBeAdded)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const modifiedPersons = await Person.find({})
  console.log('returnedPerson.body', returnedPerson.body)
  expect(modifiedPersons).toHaveLength(initialPersons.length + 1)
  expect(modifiedPersons).toContainEqual(
    expect.objectContaining({ ...personToBeAdded })
  )

})

test('Person addition w/o \'name\' property returns 400 status code', async () => {
  const personToBeAdded = {
    number: '012-345-678',
  }

  await api.post('/api/persons').send(personToBeAdded).expect(400)
})


test('Person deletion succeeds with status code 204 if id is valid or 400 if invalid', async () => {
  const personsAtStart = await Person.find({})

  // valid ID scenario
  const personToDelete = personsAtStart[0]

  await api
    .delete(`/api/persons/${personToDelete.id}`)
    .expect(204)

  // Invalid ID
  await api
    .delete('/api/persons/0')
    .expect(400)

  const personsAfterDeletion = await Person.find({})

  expect(personsAfterDeletion).toHaveLength(personsAtStart.length - 1)

  expect(personsAfterDeletion).not.toContainEqual(personToDelete)

})

afterAll(async () => {
  await mongoose.connection.close()
})
const personsRouter = require('express').Router()
const Person = require('../models/person')

const RANDOM_UPPER_LIM = 10000

const getRandomInt = (max) => Math.floor(Math.random() * max)


personsRouter.get('/', (request, response, next) => {
  Person.find({})
    .then((result) => {
      response.json(result)
    })
    .catch((err) => next(err))
})
personsRouter.post('/', (request, response, next) => {
  const payload = request.body

  if (!payload.name || !payload.number) {
    return response.status(400).json({
      error: 'contact information missing',
    })
  }
  const newContact = new Person({
    id: getRandomInt(RANDOM_UPPER_LIM),
    name: payload.name,
    number: payload.number,
  })

  newContact
    .save()
    .then((saved) => {
      response.status(201).json(saved)
    })
    .catch((err) => next(err))
})

personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((personObj) => {
      personObj ? response.json(personObj) : response.status(404).end()
    })
    .catch((err) => next(err))
})

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

personsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, contact, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedContact) => {
      response.json(updatedContact)
    })
    .catch((error) => next(error))
})

module.exports = personsRouter

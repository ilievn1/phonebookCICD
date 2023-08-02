require('dotenv').config()
const express = require('express')
const morgan =require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')
const app = express()
const RANDOM_UPPER_LIM = 10000

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
//app.use(morgan('tiny'))
morgan.token('payload_info', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload_info'))
app.use(express.static('build'))
const getRandomInt = (max) => (Math.floor(Math.random() * max))


app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then(result => {
      response.json(result)
    })
    .catch(err => next(err))
})

app.post('/api/persons', (request, response, next) => {
  const payload = request.body

  //const matchingEntry = (elem) => (payload.name).toLowerCase() === (elem.name).toLowerCase()

  if (!payload.name || !payload.number) {
    return response.status(400).json({
      error: 'contact information missing'
    })
  }
  /*
  else if (persons.some(matchingEntry)) {
		return response.status(400).json({ error: 'name must be unique' })
	}
*/
  const newContact = new Person({
    id: getRandomInt(RANDOM_UPPER_LIM),
    name: payload.name,
    number: payload.number
  })

  newContact
    .save()
    .then(saved => {
      response.json(saved)
    })
    .catch(err => next(err))

})

app.get('/info', (request, response) => {
  Person.find({}).then(persArr => {
    response.send(`<p>Phonebook has info for ${persArr.length}</p>
                   <p>${Date()}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(personObj => {
      personObj ? response.json(personObj) : response.status(404).end()
    })
    .catch(err => next(err))

})

app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, contact, { new: true, runValidators: true, context: 'query' })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
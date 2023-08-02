require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')
const app = express()
const middleware = require('./utils/middleware.js')
const personsRouter = require('./controllers/persons')

app.use(cors())
app.use(express.json())
morgan.token('payload_info', (req) => JSON.stringify(req.body))
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :payload_info'
  )
)
app.use(express.static('build'))

app.use('/api/persons', personsRouter)

app.get('/info', (request, response) => {
  Person.find({}).then((persArray) => {
    response.send(`<p>Phonebook has info for ${persArray.length}</p>
                   <p>${Date()}</p>`)
  })
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
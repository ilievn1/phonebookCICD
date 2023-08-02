import { useState, useEffect } from 'react'
import Persons from './components/Persons.js'
import Filter from './components/Filter.js'
import PersonForm from './components/PersonForm.js'
import Notification from './components/Notification.js'
import personsService from './services/personsService.js'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [notification, setNotification] = useState(null)


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const askNumberUpdate = () => {
    const doReplace = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)

    if (doReplace) {
      const personObj = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

      const changedNumber = { ...personObj, number: newNumber }
      
        personsService
        .updateNumber(personObj.id, changedNumber)
        .then(retPersObj => {
          setNotification(
            `'${personObj.name}'s number successfully updated'`
          )
          setTimeout(() => {
            setNotification(null)
          }, 3000)
          setPersons(persons.map(p => p.id !== personObj.id ? p : retPersObj))
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(p => p.name.toLowerCase() === newName.toLowerCase())) {
      askNumberUpdate()

    } else {
        const personObject = {
          name: newName,
          number: newNumber,
        }
        personsService
        .createPerson(personObject)
        .then(retPersObj => {
          setPersons(persons.concat(retPersObj))
          setNewName('')
          setNewNumber('')
          setNotification(
            `Added '${newName}'`
          )
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
        .catch(err => {
          setNotification(
            `${err.response.data.error}`
          )
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
    }
  }

  const fetchHook = () => {
    personsService
      .getPersons()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }
  
  useEffect(fetchHook, [])
  
  const deletePerson = id => {
    const personObj = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${personObj.name}?`)) {
      personsService
      .deletePerson(id)
      .then(() => {
        setNotification(
          `Information of '${personObj.name}' successfully deleted`
        )
        setTimeout(() => {
          setNotification(null)
        }, 3000)
        setPersons(persons.filter(p => p.id !== id ))
      })
      .catch(error => {
        setNotification(
          `Information of '${personObj.name}' has already been removed from server`
        )
        setTimeout(() => {
          setNotification(null)
        }, 3000)
        setPersons(persons.filter(p => p.id !== id))

      })
    }
  }

  return (
    <>
      <h2>Phonebook</h2>

      <Notification message={notification} />

      <Filter searchQuery={searchQuery} handleChange={handleSearchChange}/>

      <h2>Add new contact </h2>

      <PersonForm handleSubmit={addPerson}
                  name={newName}
                  number={newNumber}
                  handleNameChange={handleNameChange}
                  handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons searchQuery={searchQuery} persons={persons} handlePersonDelete={deletePerson}/>
    </>
  )
}

export default App
const Person = ({personObj, handlePersonDelete}) => (
    <li>
      {personObj.name} {personObj.number}
      <button onClick={handlePersonDelete}>Delete</button>
    </li>
)
  
const Persons = ({searchQuery, persons, handlePersonDelete}) => {
    const searchResults =
    searchQuery === ''
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <ul>
            {searchResults.map(p => <Person key={p.name} personObj={p} handlePersonDelete={() => handlePersonDelete(p.id)}/>)}
        </ul>
    )
}

export default Persons
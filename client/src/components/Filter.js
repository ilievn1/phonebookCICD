const Filter = ({searchQuery, handleChange}) => {
    return (
      <div>
        filter shown with: <input value={searchQuery} onChange={handleChange}/>
      </div>
    )
}

export default Filter
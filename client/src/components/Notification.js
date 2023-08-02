const Notification = ({ message }) => {
    const successStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    const failStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    let chosenStyle = null

    if (message === null) {
        return null
    } else if (message.includes("Added")
            || message.includes("successfully deleted")
            || message.includes("successfully updated")) {
        chosenStyle = successStyle
    } else {
        chosenStyle = failStyle  
    }
  
    return (
      <div style={chosenStyle}>
        {message}
      </div>
    )
  }

  export default Notification
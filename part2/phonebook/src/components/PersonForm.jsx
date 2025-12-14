const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, handleSubmit }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">name: </label>
          <input id="name" value={newName} onChange={handleNameChange} />
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
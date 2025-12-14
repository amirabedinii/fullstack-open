import { useState } from "react";
import { useEffect } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "123456" },
  ]);
  const [filteredPersons, setFilteredPersons] = useState(persons);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(
        `${newName} is already in the phonebook, try again with a different name`
      );
      return;
    }
    setPersons(persons.concat({ name: newName, number: newNumber }));
    setNewName("");
    setNewNumber("");
  };

  useEffect(() => {
    setFilteredPersons(
      persons.filter((person) =>
        person.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, persons]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <div>
        <label htmlFor="search">search: </label>
        <input id="search" value={search} onChange={handleSearchChange} />
      </div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit" onClick={handleSubmit}>
            add
          </button>
        </div>
      </form>
      <h2>numbers</h2>
      <ul>
        {filteredPersons.map((person) => (
          <li key={person.name}>
            {person.name} {person.number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

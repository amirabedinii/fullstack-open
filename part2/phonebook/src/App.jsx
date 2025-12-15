import { useState } from "react";
import { useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import http from "./services/http";
import Notification from "./components/Notification";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [notification, setNotification] = useState(null);
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
    if (
      persons.some(
        (person) => person.name === newName && person.number === newNumber
      )
    ) {
      alert(
        `${newName} is already in the phonebook, try again with a different name`
      );
      return;
    } else if (persons.some((person) => person.name === newName)) {
      http
        .update(persons.find((person) => person.name === newName).id, {
          name: newName,
          number: newNumber,
        })
        .then((response) => {
          setPersons(
            persons.map((person) =>
              person.id === response.data.id ? response.data : person
            )
          );
          setNewName("");
          setNewNumber("");
          setNotification({
            message: `${newName} updated successfully`,
            type: "success",
          });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
      return;
    } else {
      http
        .create({
          name: newName,
          number: newNumber,
        })
        .then((response) => {
          setPersons(persons.concat(response.data));
          setNewName("");
          setNewNumber("");
          setNotification({
            message: `${newName} added successfully`,
            type: "success",
          });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch((error) => {
          alert(`${newName} already exists in the phonebook`);
        });
    }
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        `Delete ${persons.find((person) => person.id === id).name}?`
      )
    ) {
      http.remove(id).then((response) => {
        setPersons(persons.filter((person) => person.id !== id));
        setNotification({
          message: `${
            persons.find((person) => person.id === id).name
          } deleted successfully`,
          type: "error",
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      }).catch((error) => {
        setNotification({
          message: `Error deleting ${persons.find((person) => person.id === id).name}`,
          type: "error",
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
    }
  };

  useEffect(() => {
    setFilteredPersons(
      persons.filter((person) =>
        person.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, persons]);

  useEffect(() => {
    http.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h2>Persons</h2>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;

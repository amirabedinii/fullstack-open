const Persons = ({ persons }) => {
  return (
    <div>
      <h2>numbers</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.name}>{person.name} {person.number}</li>
        ))}
      </ul>
    </div>
  );
};

export default Persons;
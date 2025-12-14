const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      <label htmlFor="search">search: </label>
      <input id="search" value={search} onChange={handleSearchChange} />
    </div>
  );
};

export default Filter;
import axios from "axios";
const baseUrl = "http://localhost:3001/api";

const getAll = () => {
  return axios.get(`${baseUrl}/persons`);
};

const create = (newObject) => {
  return axios.post(`${baseUrl}/persons`, newObject);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/persons/${id}`, newObject);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/persons/${id}`);
};

export default { getAll, create, update, remove };

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

console.log("API URL =", API.defaults.baseURL);

export default API;
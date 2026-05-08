import axios from "axios";

const API = axios.create({
  baseURL: "https://edu-planner-backrnd.onrender.com/api"
});

console.log("API URL =", API.defaults.baseURL);

export default API;
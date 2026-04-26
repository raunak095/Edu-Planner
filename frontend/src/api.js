import axios from "axios";

const API = axios.create({
    baseURL: "https://edu-planner-backend.onrender.com/api"
});

export default API;
import axios from "axios";

/* const BASE_URL = 'https://socialmedia-vn8z.onrender.com'; */
const BASE_URL = "http://localhost:5000";
const instance = axios.create({
  baseURL: BASE_URL,
   withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  },
});

export default instance;

import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://20.127.253.108/api/",
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin
    "Access-Control-Allow-Methods": "GET, POST", // Allow GET and POST methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow specific headers
  },
});

export default newRequest;

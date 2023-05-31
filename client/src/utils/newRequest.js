import axios from "axios";

const newRequest = axios.create({
  //baseURL: "http://20.127.253.108/api/",
  baseURL: "http://localhost:8800/api/",
  withCredentials: true,
});

export default newRequest;

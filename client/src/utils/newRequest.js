import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://20.127.253.108/api/",
  withCredentials: true,
});

export default newRequest;

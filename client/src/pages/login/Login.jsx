import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response.data);
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 1000);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="">Username</label>
        <input
          className={error !== null ? "error" : ""}
          name="username"
          type="text"
          placeholder="exampleUser123"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="">Password</label>
        <input
          className={error !== null ? "error" : ""}
          name="password"
          type="password"
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={isShaking ? "shake" : ""} type="submit">
          Login
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default Login;

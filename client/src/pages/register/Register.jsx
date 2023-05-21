import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });

  const [isToastVisible, setIsToastVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isShaking, setIsShaking] = useState(false);
  const [isStrong, setStrongPassword] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const passwordValidation = () => {
    const passwordValidationError = {};

    if (user.password) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
      if (!passwordRegex.test(user.password)) {
        passwordValidationError.password =
          "* Password must have at least 1 capital letter, 1 digit, 1 special character, and be at least 6 characters long";
      }
    }
    return passwordValidationError;
  };

  const validateForm = () => {
    const validationErrors = {};

    // Check if the required fields are empty
    if (!user.username) {
      validationErrors.username = "Username is required";
    }
    if (!user.email) {
      validationErrors.email = "Email is required";
    }
    if (!user.password) {
      validationErrors.password = "Password is required";
    }

    if (!user.country) {
      validationErrors.country = "Country is required";
    }

    // Return the validation errors
    return validationErrors;
  };

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (
      e.target.name === "username" ||
      e.target.name === "email" ||
      e.target.name === "password" ||
      e.target.name === "Country"
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: null,
        email: null,
        country: null,
        password: null,
      }));
    }
    setStrongPassword({});
    setServerError(null);
  };

  const handleSeller = (e) => {
    setUser((prev) => ({
      ...prev,
      isSeller: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    const passwordErrors = passwordValidation();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 1000);
      return;
    }

    if (
      Object.keys(validationErrors).length === 0 &&
      Object.keys(passwordErrors).length > 0
    ) {
      setStrongPassword(passwordErrors);
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: null,
        email: null,
        country: null,
        password: null,
      }));
      return;
    }

    if (
      Object.keys(validationErrors).length === 0 &&
      Object.keys(passwordErrors).length === 0
    ) {
      const url = await upload(file);
      try {
        await newRequest.post("/auth/register", {
          ...user,
          img: url,
        });
        setIsToastVisible(true);
        toast.success("User Registerd Successfully");
        navigate("/login");
      } catch (err) {
        setServerError(err.response.data);
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="johndoe"
            onChange={handleChange}
            className={errors.username ? "error" : ""}
          />
          {/* {errors.username && (
            <div className="error-message">{errors.username}</div>
          )} */}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {/* {errors.email && <div className="error-message">{errors.email}</div>} */}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            className={errors.password ? "error" : ""}
          />
          {/* {errors.password && (
            <div className="error-message">{errors.password}</div>
          )} */}

          <label htmlFor="file">Profile Picture</label>
          <input
            id="file"
            className={errors.file ? "error" : ""}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {/* {errors.file && <div className="error-message">{errors.file}</div>} */}

          <label htmlFor="country">Country</label>
          <input
            id="country"
            className={errors.country ? "error" : ""}
            name="country"
            type="text"
            placeholder="USA"
            onChange={handleChange}
          />
          {/* {errors.country && (
            <div className="error-message">{errors.country}</div>
          )} */}

          <button className={isShaking ? "shake" : ""} type="submit">
            Register
          </button>

          {isStrong.password && (
            <div className="error-message">{isStrong.password}</div>
          )}
          {serverError && (
            <div className="error-message">
              {"* This username already exisit!!"}
            </div>
          )}
          {errors.username && (
            <div className="error-message">{`* ${errors.username}`}</div>
          )}
          {errors.email && (
            <div className="error-message">{`* ${errors.email}`}</div>
          )}
          {errors.password && (
            <div className="error-message">{`* ${errors.password}`}</div>
          )}
          {errors.file && (
            <div className="error-message">{`* ${errors.file}`}</div>
          )}
          {errors.country && (
            <div className="error-message">{`* ${errors.country}`}</div>
          )}
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="isSeller">Activate the seller account</label>
            <label className="switch">
              <input id="isSeller" type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="+1 234 567 89"
            onChange={handleChange}
          />
          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            placeholder="A short description of yourself"
            name="desc"
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default Register;

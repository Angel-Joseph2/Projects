import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function CustomerRegistration() {
  const [username, setUsername] = useState("");
  const [place, setPlace] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleRegister(e) {
    e.preventDefault();

    const customer = { username, place, password };

    // Get existing customers array
    const existingCustomers = JSON.parse(localStorage.getItem("customers")) || [];

    // Add new customer
    existingCustomers.push(customer);
    localStorage.setItem("customers", JSON.stringify(existingCustomers));

    // Save logged-in customer separately
    localStorage.setItem("loggedInCustomer", JSON.stringify(customer));

    alert("Registration successful! You can now login.");
    navigate("/login");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Customer Registration</h2>
        <form onSubmit={handleRegister}>
          <label>
            Username
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label>
            Place
            <input
              type="text"
              placeholder="Enter place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Register</button>
        </form>

        <p className="register-text">
          Already have an account?{" "}
          <Link to="/login" className="register-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CustomerRegistration;
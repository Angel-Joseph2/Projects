import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    //  Admin login
    if (username === "admin" && password === "admin123") {
      navigate("/adminpage");
      return;
    }

    //  Customer login
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const user = customers.find(
      (c) => c.username === username && c.password === password
    );

    if (user) {
      // Save currently logged-in customer
      localStorage.setItem("loggedInCustomer", JSON.stringify(user));
      alert("Login successful!");
      navigate("/customerpage");
    } else {
      alert("Invalid username or password");
      setUsername("");
      setPassword("");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
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
            Password
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Login</button>
        </form>

        <p className="register-text">
          New customer?{" "}
          <Link to="/customerregister" className="register-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

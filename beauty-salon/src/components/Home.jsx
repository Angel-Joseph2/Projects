import "./Home.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="nav-logo">BEAUTY SALON</h2>

        
      </nav>

      {/* Overlay Content */}
      <div className="overlay">
        <h1>Welcome to Your Beauty Destination</h1>
        <p>
          Book services, manage appointments, and enjoy a seamless beauty experience.
        </p>

        <div className="hero-buttons">
           <button
          className="primary-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

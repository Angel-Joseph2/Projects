import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminRegister.css";

function AdminRegister() {
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result); // save as base64
      reader.readAsDataURL(file);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!serviceName || !price || !duration) {
      alert("Please fill all fields");
      return;
    }

    const services = JSON.parse(localStorage.getItem("salonServices")) || [];

    const newService = {
      service: serviceName,
      price,
      time: duration,
      image,
    };

    services.push(newService);
    localStorage.setItem("salonServices", JSON.stringify(services));

    alert("Service added successfully!");
    navigate("/adminpage"); // go back to services page
  };

  return (
    <div className="admin-register-container">
      <h1>Add New Service</h1>
      <form className="admin-register-form" onSubmit={handleSubmit}>
        <label>
          Service Name:
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </label>

        <label>
          Price :
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>

        <label>
          Duration:
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </label>

        <label>
          Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {image && <img src={image} alt="Preview" className="image-preview" />}

        <button type="submit">Add Service</button>
        
      </form>
    </div>
  );
}

export default AdminRegister;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditService.css";

function EditService() {
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if editing
    const editIndex = localStorage.getItem("editServiceIndex");
    if (editIndex !== null) {
      const services = JSON.parse(localStorage.getItem("salonServices")) || [];
      const serviceToEdit = services[editIndex];
      if (serviceToEdit) {
        setServiceName(serviceToEdit.service);
        setPrice(serviceToEdit.price);
        setDuration(serviceToEdit.time);
        setImage(serviceToEdit.image);
      }
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // store base64 image
      };
      reader.readAsDataURL(file);
    }
  };

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

    const editIndex = localStorage.getItem("editServiceIndex");
    if (editIndex !== null) {
      services[editIndex] = newService;
      localStorage.removeItem("editServiceIndex"); // clear edit flag
    } else {
      services.push(newService);
    }

    localStorage.setItem("salonServices", JSON.stringify(services));
    navigate("/adminpage"); // redirect back to admin services
  };

  return (
    <div className="admin-register-container">
      <h1>{localStorage.getItem("editServiceIndex") !== null ? "Edit Service" : "Add Service"}</h1>
      <form onSubmit={handleSubmit} className="admin-register-form">
        <label>
          Service Name:
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </label>

        <label>
          Price ($):
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

        <button type="submit">
          {localStorage.getItem("editServiceIndex") !== null ? "Update Service" : "Add Service"}
        </button>
      </form>
    </div>
  );
}

export default EditService;

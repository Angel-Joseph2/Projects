import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminService.css";
import { Container, Nav, Navbar } from "react-bootstrap";

function AdminServices() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  // Load services from localStorage
  useEffect(() => {
    const storedServices = JSON.parse(localStorage.getItem("salonServices")) || [];
    setServices(storedServices);
  }, []);

  // Delete service
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const updatedServices = services.filter((_, i) => i !== index);
      setServices(updatedServices);
      localStorage.setItem("salonServices", JSON.stringify(updatedServices));
    }
  };

  // Edit service
  const handleEdit = (index) => {
    localStorage.setItem("editServiceIndex", index);
    navigate("/EditService"); // navigate to register page to edit
  };

  return (
    <div className="admin-services-container">
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">beauty salon</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
           
          </Nav>
        </Container>
      </Navbar>
      <h1>All Services</h1>
      {services.length === 0 ? (
        <p>No services available.</p>
      ) : (
        <table className="services-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Service Name</th>
              <th>Price </th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index}>
                <td>
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.service}
                      className="service-image"
                    />
                  )}
                </td>
                <td>{service.service}</td>
                <td>{service.price}</td>
                <td>{service.time}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminServices;

import "./Adminpage.css";
import React from 'react'
import { useNavigate } from 'react-router-dom';
import {Container,Navbar,Nav, Row, Col, Button} from 'react-bootstrap';

function Adminpage() {
    const navigate=useNavigate();
  return (
    <>
     <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Salon</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/register">Register</Nav.Link>
            <Nav.Link href="adminservices">view</Nav.Link>
            <Nav.Link href="booking">service booking</Nav.Link>

            
          </Nav>
        </Container>
      </Navbar>

      <div className="admin-hero">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-section">
              <h1>Welcome, Admin</h1>
              <p>
                Manage salon registrations, view customers, and control services
                from one place.
              </p>
              <Button variant="light" onClick={() => navigate("/register")}>
                Go to Registration
              </Button>
            </Col>

            <Col md={6}>
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
                alt="Salon"
                className="hero-image"
              />
            </Col>
          </Row>
        </Container>
      </div>
    
    {/* <h1>admin page</h1> */}
    {/* <button onClick={()=>navigate("/register")}>registeration</button><br></br> */}
    </>
  )
}

export default Adminpage
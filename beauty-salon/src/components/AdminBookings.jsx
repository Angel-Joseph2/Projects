import React, { useEffect, useState } from "react";
import "./AdminBookings.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  // Load all customer bookings from localStorage
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("customerBookings")) || [];
    setBookings(storedBookings);
  }, []);

  return (
    <>
    <div className="admin-bookings-container">
      <h1>All Customer Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Service Name</th>
              <th>Price </th>
              <th>Duration</th>
              <th>Booking Date</th>
              <th>Booking Time</th>
              <th>Booked At</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index}>
                {/* Display customer name stored in booking */}
                <td>{booking.customerName || "Customer"}</td>
                <td>{booking.service}</td>
                <td>{booking.price}</td>
                <td>{booking.time}</td>
                <td>{booking.bookingDate}</td>
                <td>{booking.bookingTime}</td>
                <td>{booking.bookedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
      )}
    </div>
    
    </>
  );
}

export default AdminBookings;

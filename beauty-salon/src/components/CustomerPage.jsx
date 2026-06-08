import React, { useEffect, useState } from "react";
import "./CustomerPage.css";

function CustomerPage() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingInputs, setBookingInputs] = useState({});
  const [customerName, setCustomerName] = useState(""); 

  // Load customer info, services & bookings
  useEffect(() => {
    const storedServices =
      JSON.parse(localStorage.getItem("salonServices")) || [];
    setServices(storedServices);

    const storedBookings =
      JSON.parse(localStorage.getItem("customerBookings")) || [];
    setBookings(storedBookings);

    // Get logged-in customer info from localStorage
    const loggedInCustomer = JSON.parse(
      localStorage.getItem("loggedInCustomer")
    );
    if (loggedInCustomer && loggedInCustomer.username) {
      setCustomerName(loggedInCustomer.username);
    }
  }, []);

  // Handle date/time change per service
  const handleInputChange = (index, field, value) => {
    setBookingInputs((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  // Handle booking
  const handleBook = (service, index) => {
    const bookingData = bookingInputs[index];

    if (!bookingData?.date || !bookingData?.time) {
      alert("Please select date and time for booking!");
      return;
    }

    const newBooking = {
      customerName: customerName, // add customer name
      service: service.service,
      price: service.price,
      time: service.time,
      bookingDate: bookingData.date,
      bookingTime: bookingData.time,
      bookedAt: new Date().toLocaleString(),
    };

    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem(
      "customerBookings",
      JSON.stringify(updatedBookings)
    );

    alert(
      `You have booked "${service.service}" on ${bookingData.date} at ${bookingData.time}!`
    );

    // Reset only this service's date & time
    setBookingInputs((prev) => ({
      ...prev,
      [index]: { date: "", time: "" },
    }));
  };

  return (
    <div className="customer-page-container">
      <h1>Welcome to Our Salon</h1>
      

      <div className="services-cards">
        {services.length === 0 ? (
          <p>No services available at the moment.</p>
        ) : (
          services.map((service, index) => (
            <div className="service-card" key={index}>
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.service}
                  className="service-image"
                />
              ) : (
                <div className="no-image">No Image</div>
              )}

              <h3>{service.service}</h3>
              <p>Price: ${service.price}</p>
              <p>Duration: {service.time}</p>

              <div className="booking-inputs">
                <label>
                  Date:
                  <input
                    type="date"
                    value={bookingInputs[index]?.date || ""}
                    onChange={(e) =>
                      handleInputChange(index, "date", e.target.value)
                    }
                  />
                </label>

                <label>
                  Time:
                  <input
                    type="time"
                    value={bookingInputs[index]?.time || ""}
                    onChange={(e) =>
                      handleInputChange(index, "time", e.target.value)
                    }
                  />
                </label>
              </div>

              <button
                onClick={() => handleBook(service, index)}
                className="book-btn"
              >
                Book
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CustomerPage;

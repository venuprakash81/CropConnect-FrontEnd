import React, { useState } from "react";
import "./TransporterPayments.css";

const TransporterPayments = () => {
  const [activeSection, setActiveSection] = useState("");

  const payments = [
    {
      id: 1,
      customer: "Venu Prakash",
      bookingId: "TRN001",
      date: "02-10-2026",
      amount: 5000,
      status: "Paid",
    },
    {
      id: 2,
      customer: "Ramesh Kumar",
      bookingId: "TRN002",
      date: "01-10-2026",
      amount: 3500,
      status: "Paid",
    },
    {
      id: 3,
      customer: "Suresh Reddy",
      bookingId: "TRN003",
      date: "30-09-2026",
      amount: 2500,
      status: "Pending",
    },
  ];

  const totalAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const paidAmount = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="transporter-payments-page">
      <div className="transporter-payments-container">
        <div className="transporter-payments-header">
          <h1>Transporter Earnings</h1>
          <p>Manage your transport payments and earnings</p>
        </div>

        <div className="transporter-payment-summary">
          <div className="transporter-payment-card total">
            <div className="payment-icon">💰</div>
            <h3>Total Amount</h3>
            <h2>₹{totalAmount.toLocaleString("en-IN")}</h2>
            <p>Overall earnings</p>
          </div>

          <div className="transporter-payment-card paid">
            <div className="payment-icon">✅</div>
            <h3>Paid Amount</h3>
            <h2>₹{paidAmount.toLocaleString("en-IN")}</h2>
            <p>Successfully received</p>
          </div>

          <div className="transporter-payment-card pending">
            <div className="payment-icon">⏳</div>
            <h3>Pending Amount</h3>
            <h2>₹{pendingAmount.toLocaleString("en-IN")}</h2>
            <p>Awaiting payment</p>
          </div>
        </div>

        <div className="transporter-payment-actions">
          <button
            className={activeSection === "my" ? "active" : ""}
            onClick={() =>
              setActiveSection(activeSection === "my" ? "" : "my")
            }
          >
            My Payments
          </button>

          <button
            className={activeSection === "received" ? "active" : ""}
            onClick={() =>
              setActiveSection(
                activeSection === "received" ? "" : "received"
              )
            }
          >
            Received Payments
          </button>
        </div>

        {activeSection === "my" && (
          <div className="transporter-payment-details">
            <h2>My Payments</h2>
            <p>Payment details for your transport bookings.</p>

            <div className="transporter-payment-table-wrapper">
              <table className="transporter-payment-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.bookingId}</td>
                      <td>{payment.customer}</td>
                      <td>{payment.date}</td>
                      <td>₹{payment.amount.toLocaleString("en-IN")}</td>
                      <td>
                        <span
                          className={`payment-status ${payment.status.toLowerCase()}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "received" && (
          <div className="transporter-payment-details">
            <h2>Received Payments</h2>
            <p>Payments successfully received from customers.</p>

            {payments
              .filter((payment) => payment.status === "Paid")
              .map((payment) => (
                <div
                  className="received-payment-item"
                  key={payment.id}
                >
                  <div>
                    <h3>{payment.customer}</h3>
                    <p>
                      Booking ID: {payment.bookingId} | {payment.date}
                    </p>
                  </div>
                  <div className="received-payment-amount">
                    <strong>
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </strong>
                    <span>Received</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransporterPayments;
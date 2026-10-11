import React, { useState } from "react";
import "./BuyerPayments.css";

const BuyerPayments = () => {
const [activeSection, setActiveSection] = useState("");

// Sample payment data
const payments = [
{
id: 1,
farmer: "Venu Prakash",
bookingId: "BY001",
date: "02-10-2026",
amount: 15000,
status: "Paid",
},
{
id: 2,
farmer: "Ramesh Kumar",
bookingId: "BY002",
date: "01-10-2026",
amount: 10000,
status: "Paid",
},
{
id: 3,
farmer: "Suresh Reddy",
bookingId: "BY003",
date: "30-09-2026",
amount: 10000,
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
<div className="buyer-payments-page">
<div className="buyer-payments-container">
<div className="buyer-payments-header">
<h1>Buyer Payments</h1>
<p>Manage your crop purchases and payments</p>
</div>

    <div className="buyer-payment-summary">
      <div className="buyer-payment-card total">
        <div className="buyer-payment-icon">💰</div>
        <h3>Total Amount</h3>
        <h2>₹{totalAmount.toLocaleString("en-IN")}</h2>
        <p>Overall purchase amount</p>
      </div>

      <div className="buyer-payment-card paid">
        <div className="buyer-payment-icon">✅</div>
        <h3>Paid Amount</h3>
        <h2>₹{paidAmount.toLocaleString("en-IN")}</h2>
        <p>Successfully paid</p>
      </div>

      <div className="buyer-payment-card pending">
        <div className="buyer-payment-icon">⏳</div>
        <h3>Pending Amount</h3>
        <h2>₹{pendingAmount.toLocaleString("en-IN")}</h2>
        <p>Awaiting payment</p>
      </div>
    </div>

    <div className="buyer-payment-actions">
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
        Payment History
      </button>
    </div>

    {activeSection === "my" && (
      <div className="buyer-payment-details">
        <h2>My Payments</h2>
        <p>Payment details for your crop purchases.</p>

        <div className="buyer-payment-table-wrapper">
          <table className="buyer-payment-table">
            <thead>
              <tr>
                <th>Purchase ID</th>
                <th>Farmer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.bookingId}</td>
                  <td>{payment.farmer}</td>
                  <td>{payment.date}</td>
                  <td>
                    ₹{payment.amount.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span
                      className={`buyer-payment-status ${payment.status.toLowerCase()}`}
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
      <div className="buyer-payment-details">
        <h2>Payment History</h2>
        <p>All your completed and pending crop purchase payments.</p>

        {payments.map((payment) => (
          <div
            className="buyer-received-item"
            key={payment.id}
          >
            <div>
              <h3>{payment.farmer}</h3>
              <p>
                Purchase ID: {payment.bookingId} | {payment.date}
              </p>
            </div>

            <div className="buyer-received-amount">
              <strong>
                ₹{payment.amount.toLocaleString("en-IN")}
              </strong>
              <span className={payment.status.toLowerCase()}>
                {payment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
);
};

export default BuyerPayments;
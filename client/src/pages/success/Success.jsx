import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./success.scss";
const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await newRequest.put("/orders", { payment_intent });
        setTimeout(() => {
          navigate("/orders");
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, []);

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <div className="payment-success-icon-container">
          <svg className="payment-success-icon" viewBox="0 0 24 24">
            <path
              fill="#50c878"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
            />
          </svg>
        </div>
        <h3 className="payment-success-heading">Payment Successful</h3>
        <p className="payment-success-message">
          Thank you for your payment. Your transaction was successful.
        </p>
        <a href="#" className="payment-success-button">
          Continue
        </a>
      </div>
    </div>
  );
};

export default Success;

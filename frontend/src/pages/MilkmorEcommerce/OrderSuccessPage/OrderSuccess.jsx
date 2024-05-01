import React from "react";
import "./OrderSuccess.css";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import Confetti from "react-confetti";

const OrderSuccess = () => {
  const refAnimationInstance = useRef(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(1000 * particleRatio),
      });
  }, []);

  useEffect(() => fire(), []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 500,
      startVelocity: 20,
    });

    makeShot(0.2, {
      spread: 500,
    });

    makeShot(0.35, {
      spread: 500,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 500,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 500,
      startVelocity: 20,
    });
  }, [makeShot]);
  return (
    <div className="order-success-page-bg">
      <Confetti />
      <ReactCanvasConfetti
        refConfetti={getInstance}
        style={{
          position: "fixed",
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      />
      <i
        className="fas fa-check-circle"
        style={{ color: "white", fontSize: "60px", marginBottom: "20px" }}
      ></i>
      <h1 className="order-success-heading">Order Placed Successfully</h1>
      <div className="success-page-buttons-container">
        <Link to={"/products-home"}>
          <button className="success-page-buttons">Back to Home</button>
        </Link>
        <Link to={"/products-shop"}>
          <button className="success-page-buttons">Go to Products</button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;

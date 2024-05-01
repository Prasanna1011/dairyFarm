import React, { useEffect, useRef, useState } from "react";
import milkmorlogoecommerce from "../../../assets/images/milkmorlogoecommerce.png";
import milkmorblue from "../../../assets/images/brands/milkmorblue.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Modal, Row } from "reactstrap";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import OTPInput from "otp-input-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductsNavbar.css";

import {
  API_ADD_ITEMS_TO_CART,
} from "customhooks/All_Api/Apis";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";

const ProductsNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [signupSeconds, setSignUpSeconds] = useState(30);


  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const [cartItems, setCartItems] = useState();

  const ecommerceUser = JSON.parse(localStorage.getItem("EcommerceTokenData"));

  const config = GetAuthToken();



  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  const onLogoutClick = () => {
    try {
      localStorage.removeItem("EcommerceTokenData");
      toast.success("Logged Out successfully ", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
      setIsProfileMenuOpen(false);
      navigate("/products-home")
    } catch (error) {
      toast.error("Something Went Wrong", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (signupSeconds > 0) {
        setSignUpSeconds(signupSeconds - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [signupSeconds]);

  const ecommereceConfig = GetEcommereceAuthToken();
  const getCartData = async () => {
    try {
      const { data } = await axios.get(
        API_ADD_ITEMS_TO_CART,
        ecommereceConfig
      );
      setCartItems(data?.items);
    } catch (error) {
      console.log(error);
    }
  };

  const onCartIconClick = () => {
    if (ecommereceConfig == null) {
      navigate("/customer-login");
    } else {
      if (cartItems && cartItems[0].product.product_type === "Scheduled") {
        navigate("/subscription-cart");
      }
      if (cartItems && cartItems[0].product.product_type === "Non-Scheduled") {
        navigate("/cart-order");
      }
      if (cartItems && cartItems[0].order_type === "trial") {
        navigate("/trail-order-cart");
      }
    }
  };


  useEffect(() => {
    getCartData();
  }, []);

  return (
    <React.Fragment>
      <nav className="navbar me-0 ms-0">
        <div className="container">
          <button className="menu-button" onClick={toggleMenu}>
            &#9776;
          </button>
          <div className="logo ">
            <img src={milkmorlogoecommerce} alt="Logo" />
          </div>
          <ul
            className={`menu ${isOpen ? "active" : ""
              } d-flex align-items-center`}
          >
            <Link to="/products-home">
              <li className="menu-item text-light h6  ">HOME</li>
            </Link>
            <Link to="/products-shop">
              <li className="menu-item text-light h6 ms-4">PRODUCTS</li>
            </Link>
          </ul>
          <div className="d-flex flex-row align-items-center justify-content-between">
            {ecommerceUser && ecommerceUser ? (
              <div>
                <ul
                  className="h6 text-light me-2 mt-1"
                  style={{ cursor: "pointer", listStyle: "none" }}
                >
                  <b
                    onClick={toggleProfileMenu}
                  >{`${ecommerceUser.first_name} ${ecommerceUser.last_name}`}</b>
                  {isProfileMenuOpen && (
                    <div className="profile-menu-items">
                      <Link to="/milkmor-user-profile">
                        <li className="link-styles">My Profile</li>
                      </Link>
                      <Link to="/cart-order-list">
                        <li className="link-styles">Cart Orders</li>
                      </Link>
                      <Link to="/my-subscriptions">
                        <li className="link-styles">My Subscriptions</li>
                      </Link>
                      <Link to="/recharge-history">
                        <li className="link-styles">Recharge History</li>
                      </Link>
                      <Link to="/my-wallet-details">
                        <li className="link-styles">Wallet Details</li>
                      </Link>
                      <Link to="/ecommerce-tickets">
                        <li className="link-styles">Tickets</li>
                      </Link>
                      <Link to="#" onClick={onLogoutClick}>
                        <li className="link-styles">Logout</li>
                      </Link>
                    </div>
                  )}
                </ul>
              </div>
            ) : (
              <div>
                <p className="h6 text-light me-2 mt-1">
                  <span
                    onClick={() => {
                      navigate("/customer-login");
                    }}
                    data-toggle="modal"
                    data-target="#myModal"
                    style={{ cursor: "pointer", margin: "5px" }}
                  >
                    Login
                  </span>{" "}
                  /
                  <span
                    onClick={() => {
                      navigate("/customer-register")
                    }}
                    style={{ cursor: "pointer", margin: "5px" }}
                  >
                    {" "}
                    Register
                  </span>
                </p>
              </div>
            )}

            <div className="d-flex align-items-center">
              <i
                className="fab fa-opencart"
                style={{ color: "white", fontSize: "25px", cursor: "pointer" }}
                onClick={onCartIconClick}
              ></i>
              <p className="cart-quantity" style={{ cursor: "pointer" }}>
                {cartItems && cartItems.length > 0 ? cartItems.length : 0}
              </p>
            </div>
          </div>
        </div>      
      </nav>
    </React.Fragment>
  );
};

export default ProductsNavbar;

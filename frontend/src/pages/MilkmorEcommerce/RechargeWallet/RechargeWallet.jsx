import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import Axios from "axios";
import "./RechargeWallet.css";
import CommonProfileComponent from "components/EcommerceMilkMor/CommonProfileComponent/CommonProfileComponent";
import milkmorlogo from "../../../assets/images/brands/milkmorblue.svg";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "customhooks/All_Api/Apis";

const RechargeWallet = () => {
  const [walletRechargeAmount, setWalletRechargeAmount] = useState();

  const navigate = useNavigate();
  const userDetailsData = JSON.parse(
    localStorage.getItem("EcommerceTokenData")
  );
  const userId = userDetailsData.userId;
  const token = userDetailsData.token;
  const userName = `${userDetailsData.first_name} ${userDetailsData.last_name}` 

  const handlePaymentSuccess = async (response) => {
    try {
      let bodyData = new FormData();

      // we will send the response we've got from razorpay to the backend to validate the payment
      bodyData.append("response", JSON.stringify(response));

      await Axios({
        url: `${API_BASE_URL}/api/customer-wallet/razorpay-paymenthandler/`,
        method: "POST",
        data: bodyData,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
      })
        .then((res) => {
          console.log("Recharge Successful");
          navigate("/my-wallet-details");
          console.log("resulttt", res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(console.error());
    }
  };

  // this will load a script tag which will open up Razorpay payment card to make //transactions
  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const onRechargeWalletClick = async () => {
    try {
      const res = await loadScript();

      let bodyData = new FormData();

      // we will pass the amount and product name to the backend using form data
      bodyData.append("customer_id", userId);
      bodyData.append("amount", walletRechargeAmount);

      const data = await Axios({
        url: `${API_BASE_URL}/api/customer-wallet/razorpay-create-order/`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        data: bodyData,
      }).then((res) => {
        return res;
      });

      // in data we will receive an object from the backend with the information about the payment
      //that has been made by the user

      var options = {
        key_id: process.env.REACT_APP_PUBLIC_KEY, // in react your environment variable must start with REACT_APP_
        key_secret: process.env.REACT_APP_SECRET_KEY,
        amount: data.data.razorpay_order.amount,
        currency: "INR",
        name: "Milkmor",
        description: "Payment To Recharge Milkmor Wallet",
        image: milkmorlogo,
        order_id: data.data.razorpay_order.id,
        handler: function (response) {
          console.log(response);
          // we will handle success by calling handlePaymentSuccess method and
          // will pass the response that we've got from razorpay
          handlePaymentSuccess(response);
        },
        prefill: {
          name: userName,
        //   email: "pavan@gmail.com",
        },
        notes: {
          address: "Milkmor Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <ProductsNavbar />
      <div className="profile-banner-container">
        <h1 className="text-light">RECHARGE WALLET</h1>
        <Link to="/products-shop">
          <h6 className="text-light" style={{ cursor: "pointer" }}>
            <i
              className="fas fa-arrow-left me-2"
              style={{ fontSize: "13px" }}
            ></i>
            Back
          </h6>
        </Link>
      </div>
      <div className="profile-content-container">
        <div className="container">
          <div className="profile-content-layout">
            <div className="left-component">
              <CommonProfileComponent />
            </div>
            <div className="right-component">
              <h4>Recharge Wallet</h4>
              <hr className="horizontal-rule" />
              <div className="d-flex align-items-center justify-content-center">
                <div>
                  <h5>Enter Amount</h5>
                  <input
                    type="number"
                    className="amount-input-field"
                    placeholder="Enter Amount"
                    onChange={(e) => setWalletRechargeAmount(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="recharge-button mt-4 ms-2"
                  onClick={onRechargeWalletClick}
                  disabled={!walletRechargeAmount}
                >
                  Recharge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default RechargeWallet;

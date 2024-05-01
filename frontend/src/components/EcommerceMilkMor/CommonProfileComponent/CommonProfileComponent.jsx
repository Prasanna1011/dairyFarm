import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CommonProfileComponent.css";

const CommonProfileComponent = () => {
  const [myProfileClicked, setMyProfileClicked] = useState(false);
  const [cartOrderClicked, setCartOrderClicked] = useState(false);
  const [mySubscriptionClicked, setMySubscriptionClicked] = useState(false);
  const [rechargeHistoryClicked, setRechargeHistoryClicked] = useState(false);
  const [walletDetailsClicked, setWalletDetailsClicked] = useState(false);
  const [ticketsClicked, setTicketsClicked] = useState(false);

  const onMyProfileClicked = () => {
    setMyProfileClicked(!myProfileClicked);
    setCartOrderClicked(false);
    setMySubscriptionClicked(false);
    setRechargeHistoryClicked(false);
    setWalletDetailsClicked(false);
    setTicketsClicked(false);
  };

  const onCartOrderClicked = () => {
    setMyProfileClicked(false);
    setCartOrderClicked(!cartOrderClicked);
    setMySubscriptionClicked(false);
    setRechargeHistoryClicked(false);
    setWalletDetailsClicked(false);
    setTicketsClicked(false);
  };

  const onMySubscriptionClicked = () => {
    setMyProfileClicked(false);
    setCartOrderClicked(false);
    setMySubscriptionClicked(!mySubscriptionClicked);
    setRechargeHistoryClicked(false);
    setWalletDetailsClicked(false);
    setTicketsClicked(false);
  };

  const onRechargeHistoryClicked = () => {
    setMyProfileClicked(false);
    setCartOrderClicked(false);
    setMySubscriptionClicked(false);
    setRechargeHistoryClicked(!rechargeHistoryClicked);
    setWalletDetailsClicked(false);
    setTicketsClicked(false);
  };

  const onWalletDetailsClicked = () => {
    setMyProfileClicked(false);
    setCartOrderClicked(false);
    setMySubscriptionClicked(false);
    setRechargeHistoryClicked(false);
    setWalletDetailsClicked(!walletDetailsClicked);
    setTicketsClicked(false);
  };

  const onTicketsClicked = () => {
    setMyProfileClicked(false);
    setCartOrderClicked(false);
    setMySubscriptionClicked(false);
    setRechargeHistoryClicked(false);
    setWalletDetailsClicked(false);
    setTicketsClicked(!ticketsClicked);
  };

  return (
    <React.Fragment>
      <ul className="common-component">
        <Link to="/milkmor-user-profile">
          <li
            className={`item-styless ${myProfileClicked ? "activee" : ""}`}
            onClick={onMyProfileClicked}
          >
            My Profile
          </li>
        </Link>
        <Link to="/cart-order-list">
          <li
            className={`item-styless ${cartOrderClicked ? "activee" : ""}`}
            onClick={onCartOrderClicked}
          >
            Cart Order
          </li>
        </Link>
        <Link to="/my-subscriptions">
          <li
            className={`item-styless ${mySubscriptionClicked ? "activee" : ""}`}
            onClick={onMySubscriptionClicked}
          >
            My Subscription
          </li>
        </Link>
        <Link to="/recharge-history">
          <li
            className={`item-styless ${rechargeHistoryClicked ? "activee" : ""}`}
            onClick={onRechargeHistoryClicked}
          >
            Recharge History
          </li>
        </Link>
        <Link to="/my-wallet-details">
          <li
            className={`item-styless ${walletDetailsClicked ? "activee" : ""}`}
            onClick={onWalletDetailsClicked}
          >
            Wallet Details
          </li>
        </Link>
        <Link to="/ecommerce-tickets">
          <li
            className={`item-styless ${ticketsClicked ? "activee" : ""}`}
            onClick={onTicketsClicked}
          >
            Tickets
          </li>
        </Link>
      </ul>
    </React.Fragment>
  );
};

export default CommonProfileComponent;

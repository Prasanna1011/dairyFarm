import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import "./UserWalletDetails.css";
import CommonProfileComponent from "components/EcommerceMilkMor/CommonProfileComponent/CommonProfileComponent";
import { API_BASE_URL, ECOMMERCE_CUSTOMER_BLOCKED_TRANSACTIONS, ECOMMERCE_CUSTOMER_BLOCKED_TRANSACTION_DETAILS, GET_ECOMMERCE_WALLET_DETAILS } from "customhooks/All_Api/Apis";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const UserWalletDetails = () => {
  const ecommereceConfig = GetEcommereceAuthToken();
  const navigate = useNavigate();
  const [walletFullBalanceDetails, setWalletFullBalanceDetails] = useState();
  const [blockedBalanceTransactions, setBlockedBalanceTransactions] =
    useState();

  const userDetailsData = JSON.parse(
    localStorage.getItem("EcommerceTokenData")
  );
  const userId = userDetailsData.userId;
  const token = userDetailsData.token;

  const getWalletBalances = async () => {
    try {
      const { data } = await axios.get(
        `${GET_ECOMMERCE_WALLET_DETAILS}${userId}`,
        ecommereceConfig
      );
      setWalletFullBalanceDetails(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getBlockedBalanceTransactionsDetails = async () => {
    try {
      const { data } = await axios.get(
        `${ECOMMERCE_CUSTOMER_BLOCKED_TRANSACTIONS}${userId}`,
        ecommereceConfig
      );
      setBlockedBalanceTransactions(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const onBlockedWalletTransactionClick = async (id) => {
    try {
      const { data } = await axios.get(
        `${ECOMMERCE_CUSTOMER_BLOCKED_TRANSACTION_DETAILS}${id}`,
        ecommereceConfig
      );
      navigate("/blocked-transaction-history", { state: data });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getWalletBalances();
    getBlockedBalanceTransactionsDetails();
  }, []);

  return (
    <React.Fragment>
      <ProductsNavbar />
      <div className="profile-banner-container">
        <h1 className="text-light">WALLET DETAILS</h1>
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
              <h4>Current Wallet Details</h4>
              <hr className="horizontal-rule" />
              <div className="wallet-amounts-container">
                <div>
                  <h5 className="text-center">Available Balance : </h5>
                  <h5 className="text-center" style={{ color: "#3B66A0" }}>
                    <i className="fas fa-rupee-sign"></i>{" "}
                    {walletFullBalanceDetails &&
                      walletFullBalanceDetails.available_balance}
                    .00
                  </h5>
                </div>
                <div>
                  <h5 className="text-center">Blocked Balance : </h5>
                  <h5 className="text-center" style={{ color: "#3B66A0" }}>
                    <i className="fas fa-rupee-sign"></i>{" "}
                    {walletFullBalanceDetails &&
                      walletFullBalanceDetails.blocked_balance}
                    .00
                  </h5>
                </div>
                <div>
                  <Link to="/recharge-wallet">
                    <button className="text-center wallet-transaction-history-button">
                      Recharge Wallet
                    </button>
                  </Link>
                </div>
                <div>
                  <Link to="/wallet-transaction-history">
                    <button className="text-center wallet-transaction-history-button">
                      Transaction History
                    </button>
                  </Link>
                </div>
              </div>
              <hr className="horizontal-rule" />
              <h4>Blocked Balance Transactions</h4>
              <hr className="horizontal-rule" />
              <div
                className="table-responsive mb-0 mt-2 mb-2"
                data-pattern="priority-columns"
              >
                <Table
                  id="tech-companies-1"
                  className="table table-striped table-bordered"
                >
                  <Thead>
                    <Tr>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Transaction Id
                      </Th>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Order Id
                      </Th>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Available Amount
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {blockedBalanceTransactions &&
                      blockedBalanceTransactions.results.map((eachItem) => (
                        <Tr
                          key={eachItem.transaction_id}
                          className="text-center"
                        >
                          <Td
                            className="h6  transaction-id-hover"
                            onClick={() =>
                              onBlockedWalletTransactionClick(
                                eachItem.transaction_id
                              )
                            }
                          >
                            {" "}
                            {eachItem.transaction_id}
                          </Td>
                          <Td style={{ color: "black" }} className="h6">
                            {" "}
                            {eachItem.order_id}
                          </Td>
                          <Td style={{ color: "green" }} className="h6">
                            <i className="fas fa-rupee-sign"></i>{" "}
                            {eachItem.available_amount}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default UserWalletDetails;

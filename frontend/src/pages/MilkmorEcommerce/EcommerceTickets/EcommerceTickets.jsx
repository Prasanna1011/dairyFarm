import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import "./EcommerceTickets.css";
import CommonProfileComponent from "components/EcommerceMilkMor/CommonProfileComponent/CommonProfileComponent";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import axios from "axios";
import { API_TICKETS_GET, GET_ECOMMERCE_TICKETS_BY_ID } from "customhooks/All_Api/Apis";
import { Col, Row } from "reactstrap";

const EcommerceTickets = () => {
  const [selectedTicketReason, setSelectedTicketReason] = useState(
    "Require new Milk bag / Token"
  );
  const [selectedTicketComment, setSelectedTicketComment] = useState();
  const [previousTicketsData, setPreviousTicketsData] = useState();
  const config = GetAuthToken();
  const ecommereceConfig = GetEcommereceAuthToken();

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#007BFF"; 
      case "Acknowledge":
        return "#ffc107";
      case "Resolved":
        return "#28a745";
      default:
        return ""; 
    }
  };
  

  let userId = null;

  try {
    let userData = JSON.parse(localStorage.getItem("EcommerceTokenData"));
    userId = userData.userId;
  } catch (e) {
    console.error("Error occurred while retrieving user data:", e);
  }

  const postTicketsOnClick = async () => {
    const ticketsData = {
      reason: selectedTicketReason,
      comment: selectedTicketComment,
    };
    try {
      const { data } = await axios.post(
        API_TICKETS_GET,
        ticketsData,
        ecommereceConfig
      );

      getRaisedTicketsData();
      setSelectedTicketComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const getRaisedTicketsData = async () => {
    try {
      const { data } = await axios.get(
        `${GET_ECOMMERCE_TICKETS_BY_ID}${userId}`,
        ecommereceConfig
      );
      setPreviousTicketsData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancelClick = () => {
    setSelectedTicketComment("");
  };

  useEffect(() => {
    getRaisedTicketsData();
  }, []);

  return (
    <React.Fragment>
      <ProductsNavbar />
      <div className="profile-banner-container">
        <h1 className="text-light">TICKETS</h1>
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
              <h3>Tickets</h3>
              <hr className="horizontal-rule" />
              <h5 className="mt-3">Raise a new ticket</h5>
              <div className="d-flex flex-column mt-3">
                <label htmlFor="ticketReason">Ticket Reason *</label>
                <select
                  className="field"
                  id="ticketReason"
                  onChange={(e) => setSelectedTicketReason(e.target.value)}
                >
                  <option value="Require new Milk bag / Token">
                    Require new Milk bag / Token
                  </option>
                  <option value="Quality Related Issues">
                    Quality Related Issues
                  </option>
                  <option value="Facing Technical issue with the application">
                    Facing Technical issue with the application
                  </option>
                  <option value="Need to change the address in the current subscription">
                    Need to change the address in the current subscription
                  </option>
                  <option value="Delivery Related Issues">
                    Delivery Related Issues
                  </option>
                </select>
              </div>
              <div className="d-flex flex-column mt-3">
                <label htmlFor="ticketComment">Comments *</label>
                <textarea
                  rows="6"
                  maxLength="500"
                  id="ticketComment"
                  onChange={(e) => setSelectedTicketComment(e.target.value)}
                  value={selectedTicketComment}
                />
              </div>
              <div className="d-flex justify-content-end mt-2">
                <button
                  className="tickets-save-button"
                  onClick={postTicketsOnClick}
                >
                  SAVE
                </button>
                <button
                  className="tickets-cancel-button"
                  onClick={onCancelClick}
                >
                  CANCEL
                </button>
              </div>

              <div className="d-flex flex-column mt-3">
                <h4 style={{ color: "black" }}>Previous Tickets</h4>
                <hr className="horizontal-rule" />
                <div>
                  {previousTicketsData &&
                    previousTicketsData.map((eachTicket) => (
                      <>
                        <Row
                          className="d-flex flex-row justify-content-between"
                          key={eachTicket.ticket_id}
                        >
                          <Col md={6} className="tickets-info-container">
                            <h6 className="tickets-text-styles">
                              Ticket ID :{" "}
                              <span className="tickets-dark-styles">
                                {eachTicket.ticket_id}
                              </span>
                            </h6>
                            <h6 className="tickets-text-styles">
                              Data & Tme :{" "}
                              <span className="tickets-dark-styles">
                                {eachTicket.ticket_date}
                              </span>
                            </h6>
                            <h6 className="tickets-text-styles">
                              Comments :{" "}
                              <span className="tickets-dark-styles">
                                {eachTicket.comment}
                              </span>
                            </h6>
                            <h6 className="tickets-text-styles">
                              Resolve Comment: {" "}
                              <span className="tickets-dark-styles">
                                {eachTicket.resolve_comment === null ? "Concern yet to be addressed" : eachTicket.resolve_comment}
                              </span>
                            </h6>
                          </Col>
                          <Col md={6} className="d-flex flex-column justify-content-end">
                            <button
                              style={{
                                backgroundColor: getStatusColor(eachTicket.status),
                                color: "white",
                                border: "none",
                                padding: "6px",
                                borderRadius: "5px",
                                width: "100px"
                              }}
                            >
                              {eachTicket.status}
                            </button>
                            <h6 className="mt-2 tickets-text-styles">
                              Reason :{" "}
                              <span className="tickets-dark-styles">
                                {eachTicket.reason}
                              </span>
                            </h6>
                          </Col>
                        </Row>
                        <hr className="horizontal-rule" />
                      </>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default EcommerceTickets;

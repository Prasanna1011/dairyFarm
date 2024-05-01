import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Modal,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  FormFeedback,
  Table,
} from "reactstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import HorizontalTimeline from "react-horizontal-timeline";
import {
  API_BASE_URL,
  API_CART_ORDER_ASSIGN_ORDER_DELIVERY_ASSISTANT_GET_PUT,
  API_CART_ORDER_ATTEMPTED,
  API_CART_ORDER_CANCEL,
  API_CART_ORDER_DELIVER_POST,
  API_CART_ORDER_GET_BY_ID,
  API_CART_ORDER_GET_STOCK_FOR_ASSIGN_ORDER,
  API_CART_ORDER_REFUND,
  API_CART_ORDER_STATUS,
  API_COMPANY_DETAILS_POST_GET,
} from "customhooks/All_Api/Apis";
import { format } from "date-fns";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

const CartOrderDetailsById = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [deliveryAssistantData, setDeliveryAssistantData] = useState([]);
  const [attemptedDetails, setAttemptedDetails] = useState([]);
  const [assignOrderModal, setAssignOrderModal] = useState(false);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);
  const [refundModal, setRefundModal] = useState(false);
  const [refundPaidModal, setrefundPaidModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState(false);
  const [deliverOrderModal, setdeliverOrderModal] = useState(false);
  const [companyDetails, setCompanyDetails] = useState([]);

  const [orderAttemptModal, setorderAttemptModal] = useState(false);

  function orderAttemptToggle() {
    setorderAttemptModal(!orderAttemptModal);
  }

  function deliverOrderToggle() {
    setdeliverOrderModal(!deliverOrderModal);
  }

  // filteredValues.indexOf(apiResponse.status)

  function togglerefundPaidModal() {
    setrefundPaidModal(!refundPaidModal);
  }
  const navigate = useNavigate();

  function toggleRefundModal() {
    setRefundModal(!refundModal);
  }
  function toggleCancelOrderModal() {
    setCancelOrderModal(!cancelOrderModal);
  }

  function toggleAssignOrderModal() {
    setAssignOrderModal(!assignOrderModal);
  }
  const reasonsArray = [
    { key: "Customer is unavailable", value: "Customer is unavailable" },
    {
      key: "Can't connect with customer",
      value: "Can't connect with customer",
    },
    // Add more key-value pairs as needed
  ];

  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();
  const { id } = useParams();

  const companyDetailsData = async () => {
    try {
      const { data } = await axios.get(API_COMPANY_DETAILS_POST_GET, config);

      // Assuming your fetched data contains the image URLs/paths, update the state accordingly
      setCompanyDetails(data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const getCartOrderDetails = async () => {
    try {
      const { data } = await axios.get(
        `${API_CART_ORDER_GET_BY_ID}${id}/`,
        config
      );
      setOrderDetails(data);
      console.log(data.items);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const getAssignOrderDeliveryAssistantData = async () => {
    try {
      const { data } = await axios.get(
        `${API_CART_ORDER_ASSIGN_ORDER_DELIVERY_ASSISTANT_GET_PUT}${id}/`,
        config
      );
      setDeliveryAssistantData(data);
      console.log(data.items);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };
  const deliverOrderSuccessFully = async () => {
    try {
      const payload = { order_id: id };
      console.log("payload", payload);
      const { data } = await axios.post(
        `${API_CART_ORDER_DELIVER_POST}`,
        payload,
        config
      );
      toast.success(` Order Deliverd successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      navigate("/cart-orders");
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error(` Something Went Wrong`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const [timelineValues, setTimelineValues] = useState({
    values: [],
    index: 0,
  });

  useEffect(() => {
    const getCartOrderStatus = async () => {
      try {
        const { data } = await axios.get(
          `${API_CART_ORDER_STATUS}${id}`,
          config
        );
        setAttemptedDetails(data);
        const statuses = data.map((item) => item.status);
        const uniqueStatuses = [...new Set(statuses)]; // Remove duplicates
        setTimelineValues({
          values: uniqueStatuses,
          index: 0, // Set the default index to 0
        });
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    getCartOrderStatus();
  }, [id]);

  const formatDate = (dateString) => {
    const options = {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString)
      .toLocaleString("en-US", options)
      .replace(",", "");
  };

  const handleChange = (index) => {
    setTimelineValues((prevState) => ({
      ...prevState,
      index,
    }));
  };

  // const handleChange = (index) => {
  //   setValue(index);
  // };
  // Cancel order form validation
  const cancelOrderValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      order_id: orderDetails?.order?.order_id,
      cancel_reason: "",
      comment: "",
    },
    validationSchema: Yup.object({
      cancel_reason: Yup.string().required("Please Select Cancel Reason"),
      comment: Yup.string().required("Please Enter a Comment"),
      order_id: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          API_CART_ORDER_CANCEL,
          values,
          config
        );
        toast.success(`Cart Order Cancelled successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        navigate("/cart-orders");
        toggleCancelOrderModal();
      } catch (error) {
        toast.error(`Something went wrong`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });
  // Refund Details form validation
  const refundDetailsValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      order_id: orderDetails?.order?.order_id,
      refund_mode: "",
      refund_amount: orderDetails?.order?.refund_amount,
      refund_date: "",
      reference_number: "",
    },
    validationSchema: Yup.object({
      refund_mode: Yup.string().required("Please Select Refund Mode"),
      reference_number: Yup.string().required("Please Enter Reference Number."),
      refund_amount: Yup.number().required("Refund Amount is required."),
      order_id: Yup.string().required("Order ID is required"),
      refund_date: Yup.string().required("Please Enter Refund Date"),
    }),

    onSubmit: async (values) => {
      console.log("refundAmount ", values);
      try {
        const { data } = await axios.post(
          API_CART_ORDER_REFUND,
          values,
          config
        );
        toast.success(` Refended successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        navigate("/cart-orders");
        toggleRefundModal();
      } catch (error) {
        toast.error(`Something went wrong`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });

  // Form validation
  const assignOrderValidation = useFormik({
    enableReinitialize: true,

    initialValues: {
      delivery_boy_id: "",
    },
    validationSchema: Yup.object({
      delivery_boy_id: Yup.string().required("Please Enter Your First Name"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.put(
          `${API_CART_ORDER_ASSIGN_ORDER_DELIVERY_ASSISTANT_GET_PUT}${id}/`,
          values,
          config
        );
        toast.success(`Order Assigned successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        toggleAssignOrderModal();

        navigate("/cart-orders");
      } catch (error) {
        // Handle errors here
        console.error("Something went wrong", error.message);
        toast.error(`Order Assigned successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });

  // Attempt Detail form validation
  const attemptDetailValidation = useFormik({
    enableReinitialize: true,

    initialValues: {
      order_id: orderDetails?.order?.order_id,
      reason: "", // Initialize reason to an empty string
      resechedule: null, // Initialize resechedule to null
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Please choose the cancel reason"),
      resechedule: Yup.date()
        .nullable()
        .required("Please choose the reschedule date"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          `${API_CART_ORDER_ATTEMPTED}`,
          values,
          config
        );
        toast.success(`Order Attempted Added successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        orderAttemptToggle();
        navigate("/cart-orders");
      } catch (error) {
        // Handle errors here
        console.error("Something went wrong", error.message);
        toast.error(`Order Assigned successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });

  useEffect(() => {
    getCartOrderDetails();
    companyDetailsData();
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between ">
                  <h3 className="text-start ">Cart Order Detail</h3>
                  <h3 className="text-start text-primary">
                    <b>Receipt - {orderDetails?.order?.order_id}</b>
                  </h3>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="">
                  <HorizontalTimeline
                    index={timelineValues.index}
                    values={timelineValues.values}
                    onClick={(index) => handleChange(index)}
                    labelWidth={100}
                    isTouchEnabled={false}
                  />
                  <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <p>{timelineValues.values[timelineValues.index]}</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="">
                  <Row>
                    <Col xl={8}>
                      <div>
                        <h5>
                          <b>Customer</b>
                        </h5>
                        <div className="mt-2">
                          <p>
                            Name :{" "}
                            <span>
                              <b>{orderDetails?.order?.customer_name}</b>
                            </span>{" "}
                          </p>
                        </div>
                        <div>
                          <p>
                            Phone :{" "}
                            <span>
                              {" "}
                              <b>{orderDetails?.order?.customer?.contact_no}</b>
                            </span>{" "}
                          </p>
                        </div>
                        <div>
                          <p>
                            Email :{" "}
                            <span>
                              {" "}
                              <b>{orderDetails?.order?.customer?.email}</b>
                            </span>{" "}
                          </p>
                        </div>
                        <div>
                          <p>
                            Address :{" "}
                            <span>
                              <b>
                                {
                                  orderDetails?.order?.customer_address
                                    ?.full_address
                                }
                              </b>
                            </span>
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col xl={4} className="text-end">
                      <div>
                        <h5>
                          <b>Order Info</b>
                        </h5>
                        <div className="mt-2">
                          <p>
                            Order#{" "}
                            <span>
                              <b>{orderDetails?.order?.order_id}</b>
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            Ordered on :{" "}
                            <span>
                              {" "}
                              <b>
                                {orderDetails?.order?.created_at
                                  ? format(
                                      new Date(orderDetails?.order?.created_at),
                                      "dd-MM-yyyy"
                                    )
                                  : "---"}
                              </b>
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            Payment Mode :{" "}
                            <span>
                              <b>{orderDetails?.order?.payment_mode}</b>
                            </span>
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col xl={12} className="mt-3">
                      <div className="table-responsive">
                        <Table className="table mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Order Item</th>
                              <th>UOM</th>
                              <th>Product Rate</th>
                              <th>Qty.</th>
                              <th>Tax.</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderDetails.items &&
                              orderDetails.items.map((product) => (
                                <tr key={product.id}>
                                  <td>{product.product_name}</td>

                                  <td>
                                    {product.product_uom_quantity}
                                    {product.product_uom_name}
                                  </td>
                                  <td>{product.product_rate}</td>
                                  <td>{product.quantity}</td>
                                  <td>{product.tax_rate}%</td>
                                  <td> ₹{product.with_tax_amount}</td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                    <Col xl={6} className="mt-3">
                      <div>
                        <p className="fs-5">
                          Coupon Code :{" "}
                          <span>
                            <b>{orderDetails.order?.coupon_code}</b>
                          </span>
                        </p>
                      </div>
                    </Col>

                    <Col xl={6} className="mt-3 text-end">
                      <p className="fs-5">
                        Order Total :{" "}
                        <span>₹{orderDetails.order?.pb_discount}</span>
                      </p>
                      <p className="">
                        Discount Amount :{" "}
                        <span>₹{orderDetails.order?.discount_amount}.00</span>
                      </p>
                      <p className="fs-4">
                        TOTAL PAYABLE AMOUNT :{" "}
                        <span>
                          <b>₹{orderDetails.order?.pa_discount}.00</b>
                        </span>
                      </p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="12" className="justify-content-end d-flex">
                      {orderDetails?.order?.order_status === "Pending" &&
                        "Attempted" && (
                          <>
                            <Button
                              className="px-4 ms-2 "
                              color="primary"
                              onClick={() => {
                                toggleAssignOrderModal();
                                getAssignOrderDeliveryAssistantData();
                             
                             
                              }}
                            >
                              Assign Order
                            </Button>
                            <Button
                              className="px-4 ms-2"
                              color="danger"
                              onClick={() => {
                                toggleCancelOrderModal();
                              }}
                            >
                              Cancel Order
                            </Button>
                          </>
                        )}

                      {orderDetails?.order?.order_status === "In-process" &&
                        "Attempted" && (
                          <>
                            <Button
                              className="px-4 ms-2"
                              color="primary"
                              onClick={() => {
                                orderAttemptToggle();
                              }}
                            >
                              Attempt Order
                            </Button>
                            <Button
                              className="px-4 ms-2"
                              color="info"
                              onClick={() => {
                                deliverOrderToggle();
                              }}
                            >
                              Deliver Order
                            </Button>
                            <Button
                              className="px-4 ms-2"
                              color="danger"
                              onClick={() => {
                                toggleCancelOrderModal();
                              }}
                            >
                              Cancel Order
                            </Button>
                          </>
                        )}
                      {orderDetails?.order?.order_status === "Attempted" &&
                        "Attempted" && (
                          <>
                            {orderDetails?.attempted.length < 2 &&
                            orderDetails?.order?.order_status ===
                              "Attempted" ? (
                              <Button
                                className="px-4 ms-2"
                                color="primary"
                                onClick={() => {
                                  orderAttemptToggle();
                                }}
                              >
                                Attempt Order
                              </Button>
                            ) : null}

                            <Button
                              className="px-4 ms-2"
                              color="info"
                              onClick={() => {
                                deliverOrderToggle();
                              }}
                            >
                              Deliver Order
                            </Button>
                            <Button
                              className="px-4 ms-2"
                              color="danger"
                              onClick={() => {
                                toggleCancelOrderModal();
                              }}
                            >
                              Cancel Order
                            </Button>
                          </>
                        )}
                      {orderDetails?.order?.refund_completed === false ? (
                        <Button
                          className="px-4 ms-2"
                          color="primary"
                          onClick={() => {
                            toggleRefundModal();
                          }}
                        >
                          Refund Amount
                        </Button>
                      ) : orderDetails?.order?.refund_completed === true ? (
                        <Button
                          className="px-4 ms-2"
                          color="primary"
                          onClick={() => {
                            togglerefundPaidModal();
                          }}
                        >
                          Refund Paid
                        </Button>
                      ) : null}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {orderDetails?.order?.order_status === "Delivered" && (
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <Row>
                      <h5 className="mb-1">
                        <b>Delivery Info</b>
                      </h5>
                      <Col md="3">
                        <img
                          className="rounded-circle avatar-xl"
                          alt="200x200"
                          src={`${API_BASE_URL}${orderDetails?.delivered?.assign_to?.profile_picture}`}
                          data-holder-rendered="true"
                        />
                      </Col>
                      <Col md="3">
                        <span className="fas fa-truck-moving fs-4"></span>
                        <p className="mt-1 m-0 p-0">Delivered by :</p>
                        <p className="m-0 p-0">
                          <b>
                            {orderDetails?.delivered?.assign_to?.first_name ||
                              ""}
                            {orderDetails?.delivered?.assign_to?.last_name ||
                              ""}
                          </b>
                        </p>
                      </Col>
                      <Col md="3">
                        <span className="fas fa-phone-alt fs-4"></span>
                        <p className=" mt-1 m-0 p-0">Contact No.</p>
                        <p>
                          {" "}
                          <b>
                            {orderDetails?.delivered?.assign_to?.contact_no ||
                              ""}
                          </b>
                        </p>
                      </Col>
                      <Col md="3">
                        <span className="far fa-calendar-alt fs-4"></span>
                        <p className="mt-1 m-0 p-0">Delivered on :</p>
                        <p>
                          <b>
                            {" "}
                            {orderDetails?.order?.delivery_date !== null
                              ? format(
                                  new Date(orderDetails?.order?.delivery_date),
                                  "dd-MM-yyyy"
                                )
                              : "---"}
                          </b>
                        </p>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          {orderDetails?.order?.order_status === "Delivered" && (
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <Row>
                      <h5 className="mb-1">
                        <b>Company Info</b>
                      </h5>
                      <p className="mt-3">
                        GSTIN :{" "}
                        <span>
                          <b>{companyDetails.GSTIN}</b>
                        </span>
                      </p>
                      <p>
                        Customer care No. :{" "}
                        <span>
                          <b>{companyDetails.contact_no}</b>
                        </span>
                      </p>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          {orderDetails.order?.order_status === "Cancelled" && (
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <Row>
                      <h5 className="mb-3 ">
                        <b>Cancel Details</b>
                      </h5>
                      <Col md="3">
                        <p className="fs-6 m-0 p-0">Cancelled by </p>
                        <h6 className="mt-1 p-0">
                          {attemptedDetails.map((item, index) => (
                            <div key={index}>
                              <b>
                                {item.status === "Cancelled"
                                  ? item.updated_by
                                  : " "}
                              </b>
                            </div>
                          ))}
                        </h6>
                      </Col>
                      <Col md="3">
                        <p className="fs-6 m-0 p-0">Cancelled on</p>
                        <h6 className="mt-1 p-0">
                          {attemptedDetails.map((item, index) => (
                            <div key={index}>
                              <b>
                                {item.status === "Cancelled"
                                  ? item.cancelled_on
                                  : " "}
                              </b>
                            </div>
                          ))}
                        </h6>
                      </Col>
                      <Col md="3">
                        <p className="fs-6 m-0 p-0">Cancelation Reason </p>
                        <h6 className="mt-1 p-0">
                          {attemptedDetails.map((item, index) => (
                            <div key={index}>
                              <b>
                                {item.status === "Cancelled"
                                  ? item.cancel_reason
                                  : " "}
                              </b>
                            </div>
                          ))}
                        </h6>
                      </Col>
                      <Col md="3">
                        <p className="fs-6 m-0 p-0">Comments </p>
                        <h6 className="mt-1 p-0">
                          {attemptedDetails.map((item, index) => (
                            <div key={index}>
                              <b>
                                {item.status === "Cancelled"
                                  ? item.comment
                                  : " "}
                              </b>
                            </div>
                          ))}
                        </h6>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          {orderDetails.order?.order_status === "Attempted" && (
            <Row>
              <Card>
                <CardBody>
                  <h5 className="mb-3 ">
                    <b>Attempt Details</b>
                  </h5>

                  <Row>
                    {orderDetails?.attempted?.map((item, index) => (
                      <Col key={index} md="3">
                        <Card className="border-1 shadow-lg">
                          <CardBody>
                            <h6 className="mt-1 p-0">
                              <b>{index + 1}st Attempt :</b>
                            </h6>
                            <div>
                              Status:{" "}
                              <span>
                                <b>
                                  {item?.status === "In-process" ? (
                                    <span className="text-success">
                                      {item.status}
                                    </span>
                                  ) : (
                                    <span className="text-danger">
                                      {item.status}
                                    </span>
                                  )}
                                </b>
                              </span>
                            </div>
                            <div>
                              Date:{" "}
                              <span>
                                <b>{formatDate(item?.created_at)}</b>
                              </span>
                            </div>
                            <div>
                              Reason:{" "}
                              <span>
                                <b>{item?.attempted_reason}</b>
                              </span>
                            </div>
                            <div>
                              Reschedule On:{" "}
                              <span>
                                <b>
                                  {item?.updated_at
                                    ? formatDate(item?.updated_at)
                                    : "KEY MISSING"}
                                </b>
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Row>
          )}

          {orderDetails.order?.order_status === "In-process" ? (
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <Row>
                      <h5 className="mb-3 ">
                        <b>Assigned order to</b>
                      </h5>
                      <Col md="3">
                        <p className="fs-6 m-0 p-0">Hub: </p>
                        <h6 className="mt-1 p-0">
                          <b>
                            {
                              orderDetails?.order?.customer_address?.pincode
                                ?.hub_name
                            }
                          </b>
                        </h6>
                      </Col>
                      <Col md="3">
                        <p className="fs-6 m-0 p-0">Delivery Boy :</p>
                        <h6 className="mt-1 p-0">
                          <b>
                            {" "}
                            {orderDetails?.order?.delivery_boy?.first_name}
                            {""} {orderDetails?.order?.delivery_boy?.last_name}
                          </b>
                        </h6>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          ) : (
            ""
          )}
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="12" className="">
                      <h5>
                        <b>Remark</b>
                      </h5>
                      <p>{orderDetails.order?.remarks}</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Assign Order Popup Start */}

        <Modal
          isOpen={assignOrderModal}
          toggle={() => {
            toggleAssignOrderModal();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">
              <b className="fs-4">Assign Order</b>
            </h5>
            <button
              type="button"
              onClick={() => {
                setAssignOrderModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Col xl="12">
              <Card>
                <CardBody>
                  <Form
                    className="needs-assignOrderValidation"
                    onSubmit={(e) => {
                      e.preventDefault();
                      assignOrderValidation.handleSubmit();
                      return false;
                    }}
                  >
                    <Row>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="assignOrderValidationCustom01">
                            HUB
                          </Label>
                          <Input
                            name="firstname"
                            placeholder="First name"
                            type="text"
                            className="form-control"
                            disabled={true}
                            value={
                              orderDetails?.order?.customer_address?.pincode
                                ?.hub_name
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="assignOrderValidationCustom02">
                            Delivery Assistant
                          </Label>
                          <Input
                            name="delivery_boy_id"
                            placeholder="Last name"
                            type="select"
                            className="form-control"
                            id="assignOrderValidationCustom02"
                            onChange={assignOrderValidation.handleChange}
                            onBlur={assignOrderValidation.handleBlur}
                            value={
                              assignOrderValidation.values.delivery_boy_id || ""
                            }
                            invalid={
                              assignOrderValidation.touched.delivery_boy_id &&
                              assignOrderValidation.errors.delivery_boy_id
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Delivery Assistant</option>
                            {deliveryAssistantData?.delivery_boys?.map((item) => (
                              <>
                                {" "}
                                <option value={item.delivery_boy_id}>
                                  {item?.first_name} {""}
                                  {item?.last_name}
                                </option>
                              </>
                            ))}
                          </Input>
                          {assignOrderValidation.touched.delivery_boy_id &&
                          assignOrderValidation.errors.delivery_boy_id ? (
                            <FormFeedback type="invalid">
                              {assignOrderValidation.errors.delivery_boy_id}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="12" className="mt-4">
                        <CardTitle className="h4">Stock Detail :</CardTitle>
                        <div className="table-responsive">
                          <Table className="table mb-0">
                            <thead className="table-light">
                              <tr>
                                <th>#</th>
                                <th>Product Name</th>
                                <th>Available</th>
                              </tr>
                            </thead>
                            <tbody>
                            
                              {deliveryAssistantData?.stock?.map((item,index)=><>
                                 <tr key={index+1}>
                                <th scope="row">{item?.index}</th>
                                <td>{item?.product_name}</td>
                                <td>
                                  {item?.quantity}
                                </td>
                              </tr>
                              </>)}
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col xl="12" className="text-center mt-3">
                        <Button color="primary" type="submit">
                          Submit form
                        </Button>
                        <Button
                          color="danger"
                          className="ms-2"
                          onClick={() => {
                            setAssignOrderModal(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </div>
        </Modal>

        {/* Assign Order Popup End */}
        {/* Cancel Order Popup Start */}

        <Modal
          isOpen={cancelOrderModal}
          toggle={() => {
            toggleCancelOrderModal();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">
              <b className="fs-4">Cancel Detail</b>
            </h5>
            <button
              type="button"
              onClick={() => {
                setCancelOrderModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Row>
              <Col xl="12">
                <Card>
                  <CardBody>
                    <Form
                      className="needs-validation"
                      onSubmit={(e) => {
                        e.preventDefault();
                        cancelOrderValidation.handleSubmit();
                        return false;
                      }}
                    >
                      <Row>
                        {/* Add hidden input for order_id */}
                        <Input
                          type="hidden"
                          name="order_id"
                          value={cancelOrderValidation.values.order_id}
                        />

                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="cancelOrderValidationCustom01">
                              Choose the cancel_reason *
                            </Label>
                            <Input
                              name="cancel_reason"
                              placeholder="Choose the cancel_reason"
                              type="select"
                              className="form-control"
                              id="cancelOrderValidationCustom01"
                              onChange={cancelOrderValidation.handleChange}
                              onBlur={cancelOrderValidation.handleBlur}
                              value={
                                cancelOrderValidation.values.cancel_reason || ""
                              }
                              invalid={
                                cancelOrderValidation.touched.cancel_reason &&
                                cancelOrderValidation.errors.cancel_reason
                                  ? true
                                  : false
                              }
                            >
                              {reasonsArray.map((item, index) => (
                                <option key={index} value={item.key}>
                                  {item.value}
                                </option>
                              ))}
                            </Input>
                            {cancelOrderValidation.touched.cancel_reason &&
                            cancelOrderValidation.errors.cancel_reason ? (
                              <FormFeedback type="invalid">
                                {cancelOrderValidation.errors.cancel_reason}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="cancelOrderValidationCustom02">
                              Write Comment *
                            </Label>
                            <Input
                              name="comment"
                              placeholder=" Please Enter Comment"
                              type="textarea"
                              className="form-control"
                              id="cancelOrderValidationCustom02"
                              onChange={cancelOrderValidation.handleChange}
                              onBlur={cancelOrderValidation.handleBlur}
                              value={cancelOrderValidation.values.comment || ""}
                              invalid={
                                cancelOrderValidation.touched.comment &&
                                cancelOrderValidation.errors.comment
                                  ? true
                                  : false
                              }
                            />
                            {cancelOrderValidation.touched.comment &&
                            cancelOrderValidation.errors.comment ? (
                              <FormFeedback type="invalid">
                                {cancelOrderValidation.errors.comment}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>

                      <Button color="primary" type="submit">
                        Submit form
                      </Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* Cancel Order Popup End */}
        {/* Refund Details Popup Start */}

        <Modal
          isOpen={refundModal}
          toggle={() => {
            toggleRefundModal();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">
              <b className="fs-4">Refund Details</b>
            </h5>
            <button
              type="button"
              onClick={() => {
                setRefundModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Row>
              <Col xl="12">
                <Card>
                  <CardBody>
                    <Form
                      className="needs-validation"
                      onSubmit={(e) => {
                        e.preventDefault();
                        refundDetailsValidation.handleSubmit();
                        return false;
                      }}
                    >
                      <Row>
                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="refundDetailsValidationCustom01">
                              Order No :
                            </Label>
                            <Input
                              name="order_id"
                              placeholder="Choose the cancel_reason"
                              type="text"
                              className="form-control"
                              id="refundDetailsValidationCustom01"
                              disabled={true}
                              onChange={refundDetailsValidation.handleChange}
                              onBlur={refundDetailsValidation.handleBlur}
                              value={
                                refundDetailsValidation.values.order_id || ""
                              }
                              invalid={
                                refundDetailsValidation.touched.order_id &&
                                refundDetailsValidation.errors.order_id
                                  ? true
                                  : false
                              }
                            />
                            {refundDetailsValidation.touched.order_id &&
                            refundDetailsValidation.errors.order_id ? (
                              <FormFeedback type="invalid">
                                {refundDetailsValidation.errors.order_id}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="refundDetailsValidationCustom01">
                              Refund Mode *
                            </Label>
                            <Input
                              name="refund_mode"
                              placeholder="Choose the refund_mode"
                              type="select"
                              className="form-control"
                              id="refundDetailsValidationCustom01"
                              onChange={refundDetailsValidation.handleChange}
                              onBlur={refundDetailsValidation.handleBlur}
                              value={
                                refundDetailsValidation.values.refund_mode || ""
                              }
                              invalid={
                                refundDetailsValidation.touched.refund_mode &&
                                refundDetailsValidation.errors.refund_mode
                                  ? true
                                  : false
                              }
                            >
                              <option value="" disabled>
                                Select Payment Mode
                              </option>
                              <option value="Online">Online</option>
                              <option value="Offline">Offline</option>
                            </Input>
                            {refundDetailsValidation.touched.refund_mode &&
                            refundDetailsValidation.errors.refund_mode ? (
                              <FormFeedback type="invalid">
                                {refundDetailsValidation.errors.refund_mode}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <div className="mb-3">
                            <label htmlFor="refund_date" className="form-label">
                              Refund Date *
                            </label>
                            <Flatpickr
                              id="refund_date"
                              name="refund_date"
                              placeholder="dd-mm-yyyy"
                              className={`form-control ${
                                refundDetailsValidation.touched.refund_date &&
                                refundDetailsValidation.errors.refund_date
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={refundDetailsValidation.values.refund_date}
                              onChange={(date) => {
                                const formattedDate = format(
                                  date[0],
                                  "yyyy-MM-dd"
                                ); // Format the date
                                refundDetailsValidation.setFieldValue(
                                  "refund_date",
                                  formattedDate
                                ); // Corrected field name
                              }}
                              options={{
                                dateFormat: "Y-m-d",
                              }}
                            />
                            {refundDetailsValidation.touched.refund_date &&
                              refundDetailsValidation.errors.refund_date && (
                                <div className="invalid-feedback">
                                  {refundDetailsValidation.errors.refund_date}
                                </div>
                              )}
                          </div>
                        </Col>

                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="refundDetailsValidationCustom02">
                              Refund Amount *
                            </Label>
                            <Input
                              name="refund_amount"
                              placeholder=" Please Enter Refund Amount"
                              type="number"
                              className="form-control"
                              id="refundDetailsValidationCustom02"
                              onChange={refundDetailsValidation.handleChange}
                              onBlur={refundDetailsValidation.handleBlur}
                              value={
                                refundDetailsValidation.values.refund_amount ||
                                ""
                              }
                              invalid={
                                refundDetailsValidation.touched.refund_amount &&
                                refundDetailsValidation.errors.refund_amount
                                  ? true
                                  : false
                              }
                            />
                            {refundDetailsValidation.touched.refund_amount &&
                            refundDetailsValidation.errors.refund_amount ? (
                              <FormFeedback type="invalid">
                                {refundDetailsValidation.errors.refund_amount}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="refundDetailsValidationCustom02">
                              Reference No *
                            </Label>
                            <Input
                              name="reference_number"
                              placeholder=" Please Enter Reference No"
                              type="text"
                              className="form-control"
                              id="refundDetailsValidationCustom02"
                              onChange={refundDetailsValidation.handleChange}
                              onBlur={refundDetailsValidation.handleBlur}
                              value={
                                refundDetailsValidation.values
                                  .reference_number || ""
                              }
                              invalid={
                                refundDetailsValidation.touched
                                  .reference_number &&
                                refundDetailsValidation.errors.reference_number
                                  ? true
                                  : false
                              }
                            />
                            {refundDetailsValidation.touched.reference_number &&
                            refundDetailsValidation.errors.reference_number ? (
                              <FormFeedback type="invalid">
                                {
                                  refundDetailsValidation.errors
                                    .reference_number
                                }
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xl="12 " className=" text-center">
                          <Button
                            color="primary"
                            type="submit"
                            className="px-4"
                          >
                            Save
                          </Button>
                          <Button
                            color="danger"
                            type="submit"
                            className="ms-2 px-4"
                            onClick={() => {
                              setRefundModal(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* Refund Details   Order Popup End */}

        {/* Refund Paid Details Popup Start */}

        <Modal
          isOpen={refundPaidModal}
          toggle={() => {
            togglerefundPaidModal();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">
              <b className="fs-4">Refund Paid Details</b>
            </h5>
            <button
              type="button"
              onClick={() => {
                setrefundPaidModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Row>
              <Col xl="12">
                <Card>
                  <CardBody>
                    <Form
                      className="needs-validation"
                      onSubmit={(e) => {
                        e.preventDefault();
                        refundDetailsValidation.handleSubmit();
                        return false;
                      }}
                    >
                      <Row>
                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="refundDetailsValidationCustom01">
                              Order No :
                            </Label>
                            <Input
                              name="order_id"
                              placeholder="Choose the cancel_reason"
                              type="text"
                              className="form-control"
                              id="refundDetailsValidationCustom01"
                              disabled={true}
                              value={orderDetails?.order?.order_id}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="refundDetailsValidationCustom01">
                              Refund Mode *
                            </Label>
                            <Input
                              name="order_id"
                              placeholder="Choose the cancel_reason"
                              type="select"
                              className="form-control"
                              id="refundDetailsValidationCustom01"
                              disabled={true}
                              value={orderDetails?.order?.refund_mode}
                            >
                              {" "}
                              <option value={orderDetails?.order?.refund_mode}>
                                {orderDetails?.order?.refund_mode}
                              </option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <div className="mb-3">
                            <Label htmlFor="refundDetailsValidationCustom01">
                              Refund Date *
                            </Label>
                            <Input
                              name="order_id"
                              placeholder="Choose the cancel_reason"
                              type="text"
                              className="form-control"
                              id="refundDetailsValidationCustom01"
                              disabled={true}
                              value={orderDetails?.order?.refund_date}
                            />
                          </div>
                        </Col>

                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="refundDetailsValidationCustom02">
                              Refund Amount *
                            </Label>
                            <Input
                              name="order_id"
                              placeholder="Choose the cancel_reason"
                              type="text"
                              className="form-control"
                              id="refundDetailsValidationCustom01"
                              disabled={true}
                              value={orderDetails?.order?.refund_amount}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="refundDetailsValidationCustom02">
                              Reference No *
                            </Label>
                            <Input
                              name="order_id"
                              placeholder="Choose the cancel_reason"
                              type="text"
                              className="form-control"
                              id="refundDetailsValidationCustom01"
                              disabled={true}
                              value={orderDetails?.order?.reference_number}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col xl="12 " className=" text-center">
                          <Button
                            color="danger"
                            type="submit"
                            className="ms-2 px-4"
                            onClick={() => {
                              setrefundPaidModal(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* Refund Paid Details Popup End */}

        {/* Deliver Order Popup Start */}

        <Modal
          isOpen={deliverOrderModal}
          toggle={() => {
            deliverOrderToggle();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0"></h5>
            <button
              type="button"
              onClick={() => {
                setdeliverOrderModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p className="fs-4 text-primary my-3">
              Do you want to Deliver order?
            </p>

            <div className="text-center mt-4">
              <Button
                color="primary"
                className="px-4"
                onClick={deliverOrderSuccessFully}
              >
                Yes
              </Button>
              <Button
                color="danger"
                className="ms-2 px-4"
                onClick={() => {
                  setdeliverOrderModal(false);
                }}
              >
                No
              </Button>
            </div>
          </div>
        </Modal>

        {/* Deliver Order Popup End */}

        {/* Order Attempt Detail Popup Start */}

        <Modal
          isOpen={orderAttemptModal}
          toggle={() => {
            orderAttemptToggle();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Attempt Detail</h5>
            <button
              type="button"
              onClick={() => {
                setorderAttemptModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Row>
              <Col xl="12">
                <Card>
                  <CardBody>
                    <Form
                      className="needs-validation"
                      onSubmit={(e) => {
                        e.preventDefault();
                        attemptDetailValidation.handleSubmit();
                        return false;
                      }}
                    >
                      <Row>
                        {/* Add hidden input for order_id */}
                        <Input
                          type="hidden"
                          name="order_id"
                          value={attemptDetailValidation.values.order_id}
                        />
                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="refundDetailsValidationCustom01">
                              Order No :
                            </Label>
                            <Input
                              name="order_id"
                              placeholder="Choose the cancel_reason"
                              type="text"
                              className="form-control"
                              id="refundDetailsValidationCustom01"
                              disabled={true}
                              onChange={refundDetailsValidation.handleChange}
                              onBlur={refundDetailsValidation.handleBlur}
                              value={
                                refundDetailsValidation.values.order_id || ""
                              }
                              invalid={
                                refundDetailsValidation.touched.order_id &&
                                refundDetailsValidation.errors.order_id
                                  ? true
                                  : false
                              }
                            />
                            {refundDetailsValidation.touched.order_id &&
                            refundDetailsValidation.errors.order_id ? (
                              <FormFeedback type="invalid">
                                {refundDetailsValidation.errors.order_id}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="attemptDetailValidationCustom01">
                              Choose the cancel reason *
                            </Label>
                            <Input
                              name="reason"
                              placeholder="Choose the cancel reason"
                              type="select"
                              className="form-control"
                              id="attemptDetailValidationCustom01"
                              onChange={attemptDetailValidation.handleChange}
                              onBlur={attemptDetailValidation.handleBlur}
                              value={
                                attemptDetailValidation.values.reason || ""
                              }
                              invalid={
                                attemptDetailValidation.touched.reason &&
                                attemptDetailValidation.errors.reason
                                  ? true
                                  : false
                              }
                            >
                              <option value="" disabled>
                                Select Reason
                              </option>
                              {reasonsArray.map((item, index) => (
                                <option key={index} value={item.key}>
                                  {item.value}
                                </option>
                              ))}
                            </Input>
                            {attemptDetailValidation.touched.reason &&
                            attemptDetailValidation.errors.reason ? (
                              <FormFeedback type="invalid">
                                {attemptDetailValidation.errors.reason}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <div className="mb-3">
                            <label htmlFor="resechedule" className="form-label">
                              Reschedule On *
                            </label>
                            <Flatpickr
                              id="resechedule"
                              name="resechedule"
                              placeholder="dd-mm-yyyy"
                              className={`form-control ${
                                attemptDetailValidation.touched.resechedule &&
                                attemptDetailValidation.errors.resechedule
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={attemptDetailValidation.values.resechedule}
                              onChange={(date) => {
                                const formattedDate = format(
                                  date[0],
                                  "yyyy-MM-dd"
                                ); // Format the date
                                attemptDetailValidation.setFieldValue(
                                  "resechedule",
                                  formattedDate
                                ); // Corrected field name
                              }}
                              options={{
                                dateFormat: "Y-m-d",
                                minDate: "today", // Restrict to today or earlier
                              }}
                            />
                            {attemptDetailValidation.touched.resechedule &&
                              attemptDetailValidation.errors.resechedule && (
                                <div className="invalid-feedback">
                                  {attemptDetailValidation.errors.resechedule}
                                </div>
                              )}
                          </div>
                        </Col>
                      </Row>

                      <Row className=" text-center">
                        <Col xl="12">
                          <Button
                            color="primary"
                            className="px-5"
                            type="submit"
                          >
                            Submit form
                          </Button>
                          <Button
                            color="danger"
                            className="px-5 ms-2"
                            onClick={() => {
                              setorderAttemptModal(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* Order Attempt Detail Popup End */}
      </div>
    </>
  );
};

export default CartOrderDetailsById;

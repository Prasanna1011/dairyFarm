import axios from "axios";
import {
  API_CART_ORDER_REFUND,
  API_HUB_ALLOCATE_HUB,
  API_HUB_CANCEL_SUBSCRIPTION_ORDER,
  API_HUB_CHANGE_ORDER_STATUS,
  API_HUB_NEW_USER_VERIFY,
  API_HUB_PAUSE_SUBSCRIPTION_ORDER,
  API_HUB_WISE_ALLOCATED_DELIVERIES,
  API_SUBSCRIPTION_ALLOCATE_DELIVERY_BOY,
  API_SUBSCRIPTION_ORDER_CONINUE_WITH_SAME_ORDER,
  API_SUBSCRIPTION_ORDER_DATA_GET,
  API_SUBSCRIPTION_ORDER_DATA_GET_BY_ID,
  API_SUBSCRIPTION_ORDER_STATUS_DATA_GET_BY_ID,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { format } from "date-fns";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
  Row,
  Table,
  Modal,
  Label,
  Input,
  FormFeedback,
  Form,
  FormGroup,
} from "reactstrap";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { error } from "toastr";

const ViewSubscriptionOrders = () => {
  const [subscriptionOrderData, setSubscriptionOrderData] = useState([]);
  const [createTaskData, setCreateTaskData] = useState([]);

  const [allocateHubModal, setallocateHubModal] = useState(false);
  const [candelSubscriptionOrderModal, setcandelSubscriptionOrderModal] =
    useState(false);

  const [pauseOrderModalPopup, setpauseOrderModalPopup] = useState(false);
  const [expireOrdermodal, setexpireOrdermodal] = useState(false);
  const [newUserVerifyModal, setnewUserVerifyModal] = useState(false);
  const [orderStatusByIdData, setOrderStatusByIdData] = useState([]);
  const [refundModal, setRefundModal] = useState(false);
  const [refundPaidModal, setrefundPaidModal] = useState(false);
  const [orderStatusModal, setorderStatusModal] = useState(false);
  const [deliveryBoyForAllocate, setDeliveryBoyForAllocate] = useState([]);
  const [
    selectedDeliveryBoyIdForAllocateDeliveryBoy,
    setselectedDeliveryBoyIdForAllocateDeliveryBoy,
  ] = useState(null);
  const [renewOrderPopup, setrenewOrderPopup] = useState(false);
  const [continueWithSameOrderModal, setcontinueWithSameOrderModal] =
    useState(false);

  const [paymentMode, setPaymentMode] = useState("Offline");

  const [allocateOrderModal, setallocateOrderModal] = useState(false);

  function allocateOrderToggle() {
    setallocateOrderModal(!allocateOrderModal);
  }
  const { order, items, customer, customer_address } = subscriptionOrderData;

  function continueWithSameOrdercontinueWithSameOrderToggle() {
    setcontinueWithSameOrderModal(!continueWithSameOrderModal);
  }
  function togglerefundPaidModal() {
    setrefundPaidModal(!refundPaidModal);
  }
  function toggleRefundModal() {
    setRefundModal(!refundModal);
  }
  function renewOrderToggle() {
    setrenewOrderPopup(!renewOrderPopup);
  }

  function orderStatusToggle() {
    setorderStatusModal(!orderStatusModal);
  }

  function newUserVerifytoggle() {
    setnewUserVerifyModal(!newUserVerifyModal);
  }

  function expireOrderToggleModal() {
    setexpireOrdermodal(!expireOrdermodal);
  }

  function togglepauseModalPopup() {
    setpauseOrderModalPopup(!pauseOrderModalPopup);
  }

  function toggleAllocateHubModal() {
    setallocateHubModal(!allocateHubModal);
  }
  function toggleCancelSubscriptionOrder() {
    setcandelSubscriptionOrderModal(!candelSubscriptionOrderModal);
  }
  const { id } = useParams();

  const navigate = useNavigate();
  // Local storage token
  const { config } = GetAuthToken();

  const orderCancelReasons = [
    { id: "Order placed by mistake", name: "Order placed by mistake" },
    {
      id: "Products not of good quality",
      name: "Products not of good quality",
    },
    {
      id: "Not satisfied with the service",
      name: "Not satisfied with the service",
    },
    { id: "Relocating from the city", name: "Relocating from the city" },
    { id: "Other", name: "Other" },
  ];
  // Refund Details form validation
  const refundDetailsValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      order_id: subscriptionOrderData?.order?.order_id || "",
      refund_mode: "",
      refund_date: "",
      refund_amount: subscriptionOrderData?.order?.refund_amount || "",
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

  const getSubscriptionOrderData = async () => {
    try {
      const { data } = await axios.get(
        `${API_SUBSCRIPTION_ORDER_DATA_GET_BY_ID}${id}/`,
        config
      );
      console.log("data", data);
      setSubscriptionOrderData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // show date in format dd/mm/yyyy
  const formattedDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };
  const orderStatusData = async () => {
    try {
      const { data } = await axios.get(
        `${API_SUBSCRIPTION_ORDER_STATUS_DATA_GET_BY_ID}${order?.order_id}`,
        config
      );
      console.log("data", data);
      setOrderStatusByIdData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Create Task Get Data Start

  const getCreateTaskData = async () => {
    try {
      const { data } = await axios.get(
        `${API_HUB_NEW_USER_VERIFY}${order?.order_id}/`,
        config
      );
      setCreateTaskData(data);

      console.log("data", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Create Task Get Data End
  // Allocate HUB Api call Start

  const allocateHub = async () => {
    try {
      const postData = {
        hub_id: order?.hub?.id, // Replace with the actual hub_id
        order_id: order?.order_id,
      };
      const { data } = await axios.post(
        `${API_HUB_ALLOCATE_HUB}`,
        postData,
        config
      );
      toggleAllocateHubModal();
      navigate("/subscription-orders");
      console.log("data", data);
      toast.success(`HUB Allocated successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error(`Something Went Wrong`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error("Error :", error);
    }
  };

  // Allocate HUB Api call End

  // cancel order start
  const handleCancelOrder = async () => {
    try {
      const postData = {
        order_status: "Expired",
        order_id: order?.order_id,
      };
      const { data } = await axios.post(
        `${API_HUB_CHANGE_ORDER_STATUS}`,
        postData,
        config
      );
      expireOrderToggleModal();
      navigate("/subscription-orders");
      console.log("data", data);
      toast.success(`Expired successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error(`Something Went Wrong`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error("Error :", error);
    }
  };
  // cancel order End

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      cancel_reason: "",
      order_id: subscriptionOrderData?.order?.order_id || "",
    },
    validationSchema: Yup.object({
      cancel_reason: Yup.string().required("Please Enter Your First Name"),
      order_id: Yup.string().required(""),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          API_HUB_CANCEL_SUBSCRIPTION_ORDER,
          values,
          config
        );
        toggleCancelSubscriptionOrder();
        navigate("/subscription-orders");
        toast.success(`Order Cancelled successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        console.log("error", error);
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

  // pause order validation start
  const pauseOrdervalidation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      order_id: subscriptionOrderData?.order?.order_id || "",
      pause_from: "",
      pause_to: "",
      pause_reason: "",
    },
    validationSchema: Yup.object({
      order_id: Yup.string().required(""),
      pause_from: Yup.date()
        .min(new Date(), "Only Future date is allowed.")
        .required(" Pause from date is required"),
      pause_to: Yup.date()
        .min(new Date(), "Only Future date is allowed.")
        .required(" Pause To date is required"),

      pause_reason: Yup.string().required("Please Enter Pause Reason"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          API_HUB_PAUSE_SUBSCRIPTION_ORDER,
          values,
          config
        );
        togglepauseModalPopup();
        navigate("/subscription-orders");
        toast.success(`Order paused successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        console.log("error", error);
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

  //  Pause Reason Validation start
  const newUSerVerifyValidation = useFormik({
    enableReinitialize: true,

    initialValues: {
      task_type: "",
      customer_name:
        `${subscriptionOrderData.order?.customer?.first_name}${subscriptionOrderData.order?.customer?.last_name}` ||
        "",
      hub_name: `${subscriptionOrderData.order?.hub?.name}` || "",
      comment: "",
    },
    validationSchema: Yup.object({
      task_type: Yup.string().required("Please Select Task Type"),
      customer_name: Yup.string().required("Please Enter Customer Name"),
      hub_name: Yup.string().required("Please Enter Pause Reason"),
      comment: Yup.string(),
    }),
    onSubmit: async (values) => {
      console.log(values);
      try {
        const { data } = await axios.post(
          `${API_HUB_NEW_USER_VERIFY}${order?.order_id}/`,
          values,
          config
        );
        toast.success(data.message ,{
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        navigate("/subscription-orders");
        newUserVerifytoggle();
      } catch (error) {
        console.log("error", error);
        toast.error(error.message, {
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
  const handlePayContinueWithSameOrder = async () => {
    try {
      const orderId = order?.order_id;
      const amount = order?.pb_discount;

      const response = await axios.post(
        API_SUBSCRIPTION_ORDER_CONINUE_WITH_SAME_ORDER,
        { order_id: orderId, amount: amount },
        config
      );

      toast.success(` Order Renewed successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      navigate("/subscription-orders");
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Something went wrong`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };
  const handleGetAllocateDeliveryBoysData = async () => {
    try {
      const { data } = await axios.get(
        `${API_HUB_WISE_ALLOCATED_DELIVERIES}${order?.hub?.id}`,
        config
      );
      setDeliveryBoyForAllocate(data);
      console.log("setDeliveryBoyForAllocate", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Common toast options
  const toastOptions = {
    position: "top-center",
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const handleSubmitAllocateNewOrder = async () => {
    try {
      const payload = {
        delivery_boy_id: selectedDeliveryBoyIdForAllocateDeliveryBoy,
        order_id: order?.order_id,
      };
      const { data } = await axios.post(
        API_SUBSCRIPTION_ALLOCATE_DELIVERY_BOY,
        payload,
        config
      );
      toast.success(`Subscription Order Updated Successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      allocateOrderToggle();
      console.log("Response:", data);
      navigate("/subscription-orders");
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Something went wrong`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    getSubscriptionOrderData();
    getCreateTaskData();
    orderStatusData();
  }, []);

  useEffect(() => {
    // console.log("subscriptionOrderData", subscriptionOrderData);
  }, [subscriptionOrderData]); // Add subscriptionOrderData as a dependency

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Order Detail</h3>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <h5 className="me-3">Order Status</h5>
                    {order?.order_status === "New" && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          orderStatusToggle();
                          orderStatusData();
                        }}
                      >
                        {order?.order_status}
                        <Badge className="bg-primary ms-2">
                          <span className="fas fa-info bg-primary"></span>
                        </Badge>
                      </button>
                    )}
                    {order?.order_status === "Active" && (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                          orderStatusToggle();
                          orderStatusData();
                        }}
                      >
                        {order?.order_status}
                        <Badge className="bg-success ms-2">
                          <span className="fas fa-check bg-success"></span>
                        </Badge>
                      </button>
                    )}
                    {order?.order_status === "Renewal" && (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                          orderStatusToggle();
                          orderStatusData();
                        }}
                      >
                        {order?.order_status}
                        <Badge className="bg-success ms-2">
                          <span className="fas fa-info bg-success"></span>
                        </Badge>
                      </button>
                    )}

                    {order?.order_status === "Expired" && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          orderStatusToggle();
                          orderStatusData();
                        }}
                      >
                        {order?.order_status}
                        <Badge className="bg-danger ms-2">
                          <span className="fas fa-exclamation bg-danger"></span>
                        </Badge>
                      </button>
                    )}
                    {order?.order_status === "Paused" && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          orderStatusToggle();
                          orderStatusData();
                        }}
                      >
                        {order?.order_status}
                        <Badge className="bg-primary ms-2">
                          <span className="fas fa-info bg-primary"></span>
                        </Badge>
                      </button>
                    )}
                    {order?.order_status === "Cancelled" && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          orderStatusToggle();
                          orderStatusData();
                        }}
                      >
                        {order?.order_status}
                        <Badge className="bg-danger ms-2">
                          <span className="fas fa-exclamation bg-danger"></span>
                        </Badge>
                      </button>
                    )}
                    {order?.order_status === "Upcoming" && (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                          orderStatusToggle();
                          orderStatusData();
                        }}
                      >
                        {order?.order_status}
                        <Badge className="bg-success ms-2">
                          <span className="fas fa-info bg-success"></span>
                        </Badge>
                      </button>
                    )}
                  </div>
                  <div>
                    <Link to="/subscription-orders">
                      <Button className=" float-end me-3  px-5" color="danger">
                        <span className="fas fa-arrow-left me-2"></span> Back
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <Card className="p-4">
                <div>
                  <h5>Order #{order?.order_id}</h5>
                  <p>
                    Ordered on :
                    <b>
                      {order?.created_at
                        ? format(new Date(order?.created_at), "dd-MM-yyyy")
                        : "---"}
                    </b>
                  </p>
                  <p>
                    Expired on :{" "}
                    <b>
                      {order?.expired_at
                        ? format(new Date(order?.expired_at), "dd-MM-yyyy")
                        : "---"}
                    </b>
                  </p>
                </div>
                <div>
                  <p>
                    Customer : <b>{order?.customer?.first_name}</b>
                    {""}
                    <b> {order?.customer?.last_name}</b>
                  </p>
                  <p>
                    Contact : <b>{order?.customer?.contact_no}</b>
                  </p>
                  <p>
                    Pincode :{" "}
                    <b>
                      {order?.customer_address?.pincode?.code} ({" "}
                      {order?.customer_address?.area?.area_name})
                    </b>{" "}
                  </p>

                  <p>
                    Status : <b> {order?.customer?.customer_status}</b>{" "}
                  </p>
                </div>

                <div className="border-top pt-2">
                  Delivery Address:
                  <br />
                  <b>{order?.customer_address?.full_address}</b>
                </div>
              </Card>
            </Col>
            <Col md="8">
              <Row>
                <Card>
                  <Col lg={12}>
                    <Card>
                      <CardBody>
                        <div className="table-responsive">
                          <Table className="table table-striped mb-0">
                            <thead>
                              <tr>
                                <th>Product Name</th>
                                <th>Unit Rate (INR)</th>
                                <th>Tax Rate</th>
                                <th>CGST</th>
                                <th>SGST</th>
                                <th>Planned Qty.</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subscriptionOrderData?.items?.map((product) => (
                                <tr key={product.id}>
                                  <td>{product.product_name}</td>
                                  <td>{product.product_rate}</td>
                                  <td>{product.tax_name}</td>
                                  <td>{product.cgst}</td>
                                  <td>{product.sgst}</td>
                                  <td>
                                    {product.qty_day1 + product.qty_day2} {""}*{" "}
                                    {order.subscription_duration}
                                  </td>
                                  <td>{product.with_tax_amount}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Row className="p-4">
                    <Col md="12">
                      <div className="d-flex justify-content-between">
                        <div>
                          <p>
                            Appointment Time : <b>{order?.appointment_time}</b>
                          </p>
                        </div>
                        <div className="flex-end">
                          <p>
                            Order Total : <b> ₹ {order?.pb_discount}</b>{" "}
                          </p>
                          <p>
                            Discount Amount :
                            <b>
                              {" "}
                              ₹{" "}
                              {order?.discount_amount !== null
                                ? order?.discount_amount
                                : "00.00"}
                            </b>
                          </p>

                          <p>
                            TOTAL PAYABLE AMOUNT :{" "}
                            <b> ₹ {order?.pa_discount}</b>
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
                <Card className="p-4">
                  <Row>
                    <Col md="12">
                      <div className="d-flex justify-content-between">
                        <div>
                          <p>Delivery Frequency</p>
                          <h6>{order?.delivery_frequency}</h6>
                        </div>
                        <div>
                          <p>Order Duration</p>
                          <h6>{order?.subscription_duration}</h6>
                        </div>
                        <div>
                          <p>Delivery Pattern</p>
                          <h6>{order?.delivery_pattern}</h6>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
                <Card className="p-4">
                  <Row>
                    <Col md="12">
                      <div className="d-flex justify-content-between">
                        <div>
                          <p>Payment Mode</p>
                          <h6>{order?.payment_mode}</h6>
                        </div>
                        <div>
                          <p>Amount Paid</p>
                          <h6>{order?.amount_paid}</h6>
                        </div>
                        <div>
                          <p>Coupon Code</p>
                          <h6>{order?.coupon_code}</h6>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
                {order?.is_allocated === true ? (
                  <>
                    <Card className="p-4">
                      <Row>
                        <Col md="12">
                          <div className="d-flex justify-content-between">
                            <div>
                              <p>Allocated hub</p>
                              <h6>{order?.hub?.name}</h6>
                            </div>
                            <div>
                              <p>Delivery Boy</p>
                              <h6>{order?.hub?.delivery_boy}</h6>
                            </div>
                            <div>
                              <p>Activated on</p>
                              <h6></h6>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </>
                ) : (
                  ""
                )}
                <Card className="p-4">
                  <Row>
                    <Col md="12" className="d-flex justify-content-end ms-2">
                      {/*   New User Verify*/}
                      {order?.task_status === null &&
                      order?.order_status === "New" ? (
                        <>
                          <Button
                            color="primary"
                            className=""
                            onClick={() => {
                              newUserVerifytoggle();
                              getCreateTaskData();
                            }}
                          >
                            {/* New User Verify */}
                            {order?.customer?.customer_status === "New"
                              ? "New User Verify"
                              : "Cash Collection"}
                          </Button>
                        </>
                      ) : null}

                      {/*   Cash Collection Verify*/}
                      {order?.customer?.customer_status === "New" &&
                      order?.amount_paid !== null &&
                      order?.task_status ===  "Completed" &&
                      order?.order_status === "Paused" ? (
                        <>
                          <Button
                            color="primary"
                            className=""
                            onClick={() => {
                              newUserVerifytoggle();
                              getCreateTaskData();
                            }}
                          >
                            Existing User Verify
                          </Button>
                        </>
                      ) : null}

                      {/*     Verification Pending*/}
                      {order?.customer?.customer_status === "New" &&
                      order?.task_status === "Pending" &&
                      order?.order_status === "New" ? (
                        <>
                          <Button color="light" className="ms-2">
                            Verification Pending{" "}
                          </Button>
                        </>
                      ) : null}

                      {/*     Verification Pending for Existing user verification*/}
                      {order?.customer?.customer_status === "New" &&
                      order?.task_status === "Pending" &&
                      order?.amount_paid !== null &&
                      order?.order_status === "Paused" ? (
                        <>
                          <Button color="light" className="ms-2">
                            Verification Pending{" "}
                          </Button>
                        </>
                      ) : null}

                      {/*   Cash Collection Pending */}
                      {(order?.order_status === "New" &&
                        order?.customer?.customer_status === "Active" &&
                        order?.amount_paid === null &&
                        order?.task_status === "Pending") ||
                      order?.task_status === "Attempted" ? (
                        <>
                          <Button color="light" className="ms-2">
                            Cash Collection Pending
                          </Button>
                        </>
                      ) : null}

                      {/* Allocate Hub */}

                      {(order?.order_status === "New" &&
                        order?.customer?.customer_status === "Approved") ||
                      (order?.customer?.customer_status === "Active" &&
                        order?.amount_paid !== null &&
                        order?.is_allocated === false) ? (
                        <button
                          type="button"
                          onClick={() => {
                            toggleAllocateHubModal();
                          }}
                          className="btn btn-primary ms-2"
                          data-toggle="modal"
                          data-target=".bs-example-modal-lg"
                        >
                          Allocate Hub
                        </button>
                      ) : null}

                      {/* allocate Order */}
                      {(order?.order_status === "New" &&
                        order?.customer?.customer_status === "Active") ||
                      (order?.customer?.customer_status === "Scheduling" &&
                        order?.amount_paid !== null &&
                        order?.is_allocated === true) ? (
                        <button
                          type="button"
                          className="btn btn-primary ms-2"
                          data-toggle="modal"
                          data-target=".bs-example-modal-lg"
                          onClick={() => {
                            handleGetAllocateDeliveryBoysData();
                            allocateOrderToggle();
                          }}
                        >
                          Allocate Order
                        </button>
                      ) : null}

                      {/*  */}

                      {order?.order_status === "Active" &&
                      order?.customer?.customer_status === "Active" ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary "
                            data-toggle="modal"
                            data-target=".bs-example-modal-lg"
                            onClick={() => {
                              togglepauseModalPopup();
                            }}
                          >
                            Pause Order
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary ms-2 "
                            data-toggle="modal"
                            data-target=".bs-example-modal-lg"
                            onClick={() => {
                              renewOrderToggle();
                            }}
                          >
                            Renew Order
                          </button>
                          <button
                            type="button"
                            className="btn btn-light ms-2"
                            data-toggle="modal"
                            data-target=".bs-example-modal-lg"
                            onClick={() => {
                              expireOrderToggleModal();
                            }}
                          >
                            Expired Order
                          </button>
                        </>
                      ) : null}

                      {/*   Cancel Order */}
                    
                      <Button
                        className="btn btn-danger ms-2"
                        onClick={() => {
                          toggleCancelSubscriptionOrder();
                        }}
                      >
                        Cancel Order
                      </Button>
                        {/*   Cancel Order */}


                      {subscriptionOrderData?.order?.refund_completed ===
                      false ? (
                        <Button
                          className="px-4 ms-2"
                          color="primary"
                          onClick={() => {
                            toggleRefundModal();
                          }}
                        >
                          Refund Amount
                        </Button>
                      ) : subscriptionOrderData?.order?.refund_completed ===
                        true ? (
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
                </Card>
              </Row>
            </Col>
          </Row>
        </Container>

        {/* Allocate Hub Modal Start */}

        <div>
          <Modal
            size="lg"
            isOpen={allocateHubModal}
            toggle={() => {
              toggleAllocateHubModal();
            }}
            centered
          >
            <div className="modal-header">
              <h3 className="modal-title mt-0" id="myExtraLargeModalLabel">
                Allocate Hub
              </h3>
              <button
                onClick={() => {
                  setallocateHubModal(false);
                }}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Row>
                <Col md="3" className="fs-5">
                  Customer Address :{" "}
                </Col>
                <Col md="9">
                  <p className="fs-5">
                    {order?.customer_address?.full_address}
                  </p>{" "}
                </Col>
                <Col md="3" className="fs-5">
                  Delivery Pincode :{" "}
                </Col>
                <Col md="9">
                  <p className="fs-5">
                    {order?.customer_address?.pincode?.code}
                  </p>
                </Col>
                <Col md="3" className="fs-5 border-bottom">
                  Delivery Area :{" "}
                </Col>
                <Col md="9" className="border-bottom ">
                  <p className="fs-5">{order?.area_name}</p>
                </Col>
                <Col md="3" className="fs-5 mt-3">
                  Hub :{" "}
                </Col>
                <Col md="9" className="mt-3">
                  <p className="fs-5">{order?.area_name}</p>
                </Col>
                <Col md="3" className="fs-5">
                  Order No. :
                </Col>
                <Col md="9">
                  <p className="fs-5">{order?.order_id}</p>
                </Col>
                <Col md="12 d-flex justify-content-center">
                  <button
                    className="btn btn-primary px-4"
                    onClick={allocateHub}
                  >
                    Submit
                  </button>
                  <button
                    className="btn btn-danger ms-2 px-4"
                    onClick={() => {
                      setallocateHubModal(false);
                    }}
                  >
                    Cancel
                  </button>
                </Col>
              </Row>
            </div>
          </Modal>
        </div>

        {/* Allocate Hub Modal End */}

        {/* Cance Subscription order Popup Start */}

        <Modal
          isOpen={candelSubscriptionOrderModal}
          toggle={() => {
            toggleCancelSubscriptionOrder();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Details</h5>
            <button
              type="button"
              onClick={() => {
                setcandelSubscriptionOrderModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <CardBody className="w-100">
              <Form
                className="needs-validation"
                onSubmit={validation.handleSubmit}
              >
                <Row className=" w-100">
                  <Input
                    type="hidden"
                    name="order_id"
                    value={validation.values.cancel_reason || ""}
                  />
                  <Col md="12">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom01">
                        Select Cancelled Reason
                      </Label>
                      <Input
                        name="cancel_reason"
                        type="select"
                        className="form-control"
                        id="validationCustom01"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cancel_reason || ""}
                        invalid={
                          validation.touched.cancel_reason &&
                          validation.errors.cancel_reason
                        }
                      >
                        <option value="" disabled>
                          Select Cancelled Reason
                        </option>
                        {orderCancelReasons.map((reason) => (
                          <option key={reason.id} value={reason.name}>
                            {reason.name}
                          </option>
                        ))}
                      </Input>
                      {validation.touched.cancel_reason &&
                      validation.errors.cancel_reason ? (
                        <FormFeedback type="invalid">
                          {validation.errors.cancel_reason}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                </Row>

                <div className="d-flex justify-content-center">
                  <Button color="primary" type="submit">
                    Submit form
                  </Button>

                  <Button
                    className="ms-2 px-4"
                    color="danger"
                    onClick={() => {
                      setcandelSubscriptionOrderModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </CardBody>
          </div>
        </Modal>

        {/* Cance Subscription order Popup End */}

        {/* Pause order popup start */}

        <Modal
          isOpen={pauseOrderModalPopup}
          toggle={() => {
            togglepauseModalPopup();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Pause Duration</h5>
            <button
              type="button"
              onClick={() => {
                setpauseOrderModalPopup(false);
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
                <Form
                  className="needs-validation"
                  onSubmit={(e) => {
                    e.preventDefault();
                    pauseOrdervalidation.handleSubmit();
                    return false;
                  }}
                >
                  <Row>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="pauseOrdervalidationCustom01">
                          From
                        </Label>
                        <Flatpickr
                          id="pause_from"
                          name="pause_from"
                          placeholder="dd-mm-yyyy"
                          className={`form-control ${
                            pauseOrdervalidation.touched.pause_from &&
                            pauseOrdervalidation.errors.pause_from
                              ? "is-invalid"
                              : ""
                          }`}
                          value={pauseOrdervalidation.values.pause_from}
                          onChange={(date) => {
                            const formattedDate = format(date[0], "yyyy-MM-dd"); // Format the date
                            pauseOrdervalidation.setFieldValue(
                              "pause_from",
                              formattedDate
                            );
                          }}
                          options={{
                            dateFormat: "Y-m-d",
                          }}
                        />
                        {pauseOrdervalidation.touched.pause_from &&
                        pauseOrdervalidation.errors.pause_from ? (
                          <FormFeedback type="invalid">
                            {pauseOrdervalidation.errors.pause_from}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="pauseOrdervalidationCustom01">To</Label>
                        <Flatpickr
                          id="pause_to"
                          name="pause_to"
                          placeholder="dd-mm-yyyy"
                          className={`form-control ${
                            pauseOrdervalidation.touched.pause_to &&
                            pauseOrdervalidation.errors.pause_to
                              ? "is-invalid"
                              : ""
                          }`}
                          value={pauseOrdervalidation.values.pause_to}
                          onChange={(date) => {
                            const formattedDate = format(date[0], "yyyy-MM-dd"); // Format the date
                            pauseOrdervalidation.setFieldValue(
                              "pause_to",
                              formattedDate
                            );
                          }}
                          options={{
                            dateFormat: "Y-m-d",
                          }}
                        />
                        {pauseOrdervalidation.touched.pause_to &&
                        pauseOrdervalidation.errors.pause_to ? (
                          <FormFeedback type="invalid">
                            {pauseOrdervalidation.errors.pause_to}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="border-bottom">
                    <Col md="12">
                      <FormGroup className="mb-3">
                        <Label htmlFor="pauseOrdervalidationCustom03">
                          Pause Reason
                        </Label>
                        <Input
                          name="pause_reason"
                          placeholder="Enter Pause Reason"
                          type="text"
                          className="form-control"
                          onChange={pauseOrdervalidation.handleChange}
                          onBlur={pauseOrdervalidation.handleBlur}
                          value={pauseOrdervalidation.values.pause_reason || ""}
                          invalid={
                            pauseOrdervalidation.touched.pause_reason &&
                            pauseOrdervalidation.errors.pause_reason
                              ? true
                              : false
                          }
                        />
                        {pauseOrdervalidation.touched.pause_reason &&
                        pauseOrdervalidation.errors.pause_reason ? (
                          <FormFeedback type="invalid">
                            {pauseOrdervalidation.errors.pause_reason}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md="12 " className="d-flex justify-content-end">
                      <Button color="primary" type="submit">
                        Submit form
                      </Button>
                      <Button
                        className="ms-2 px-4"
                        color="danger"
                        onClick={() => {
                          setpauseOrderModalPopup(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* Pause order popup End */}

        {/* Expore order Popup start */}

        <Modal
          isOpen={expireOrdermodal}
          toggle={() => {
            expireOrderToggleModal();
          }}
          centered
        >
          <div className="modal-body">
            <h5>Do you want to Expire order ?</h5>
          </div>
          <div className=" d-flex justify-content-center mb-4">
            <Button color="primary px-4" onClick={handleCancelOrder}>
              Yes
            </Button>
            <Button color="danger px-4 ms-2">No</Button>
          </div>
        </Modal>

        {/* Expore order Popup End */}

        {/* new user verify popup Start */}

        <Modal
          size="lg"
          isOpen={newUserVerifyModal}
          toggle={() => {
            newUserVerifytoggle();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">New User Verify</h5>
            <button
              type="button"
              onClick={() => {
                setnewUserVerifyModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form
              className="needs-validation"
              onSubmit={(e) => {
                e.preventDefault();
                newUSerVerifyValidation.handleSubmit();
                return false;
              }}
            >
              <Row>
                <Col md="6">
                  <Row className="">
                    <Col md="12">
                      <FormGroup className="mb-3">
                        <Label htmlFor="newUSerVerifyValidationCustom03">
                          Task Type
                        </Label>
                        <Input
                          name="task_type"
                          placeholder="Select Task Type"
                          type="select"
                          className="form-control"
                          onChange={newUSerVerifyValidation.handleChange}
                          onBlur={newUSerVerifyValidation.handleBlur}
                          value={newUSerVerifyValidation.values.task_type || ""}
                          invalid={
                            newUSerVerifyValidation.touched.task_type &&
                            newUSerVerifyValidation.errors.task_type
                              ? true
                              : false
                          }
                        >
                          <option value="" disabled>
                            Select Task Type
                          </option>
                          <option value={createTaskData?.task_type}>
                            {createTaskData?.task_type}
                          </option>
                        </Input>
                        {newUSerVerifyValidation.touched.task_type &&
                        newUSerVerifyValidation.errors.task_type ? (
                          <FormFeedback type="invalid">
                            {newUSerVerifyValidation.errors.task_type}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup className="mb-3">
                        <Label htmlFor="newUSerVerifyValidationCustom03">
                          Customer Name
                        </Label>
                        <Input
                          name="customer_name"
                          placeholder="Enter Pause Reason"
                          type="text"
                          className="form-control"
                          onChange={newUSerVerifyValidation.handleChange}
                          onBlur={newUSerVerifyValidation.handleBlur}
                          value={
                            newUSerVerifyValidation.values.customer_name || ""
                          }
                          invalid={
                            newUSerVerifyValidation.touched.customer_name &&
                            newUSerVerifyValidation.errors.customer_name
                              ? true
                              : false
                          }
                          disabled={true}
                        />
                        {newUSerVerifyValidation.touched.customer_name &&
                        newUSerVerifyValidation.errors.customer_name ? (
                          <FormFeedback type="invalid">
                            {newUSerVerifyValidation.errors.customer_name}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup className="mb-3">
                        <Label htmlFor="newUSerVerifyValidationCustom03">
                          HUB Name
                        </Label>
                        <Input
                          name="hub_name"
                          placeholder="Enter Pause Reason"
                          type="text"
                          className="form-control"
                          onChange={newUSerVerifyValidation.handleChange}
                          onBlur={newUSerVerifyValidation.handleBlur}
                          value={newUSerVerifyValidation.values.hub_name || ""}
                          invalid={
                            newUSerVerifyValidation.touched.hub_name &&
                            newUSerVerifyValidation.errors.hub_name
                              ? true
                              : false
                          }
                          disabled={true}
                        />
                        {newUSerVerifyValidation.touched.hub_name &&
                        newUSerVerifyValidation.errors.hub_name ? (
                          <FormFeedback type="invalid">
                            {newUSerVerifyValidation.errors.hub_name}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup className="mb-3">
                        <Label htmlFor="newUSerVerifyValidationCustom03">
                          Comment if any
                        </Label>
                        <Input
                          name="comment"
                          placeholder="Enter Pause Reason"
                          type="textarea"
                          className="form-control"
                          onChange={newUSerVerifyValidation.handleChange}
                          onBlur={newUSerVerifyValidation.handleBlur}
                          value={newUSerVerifyValidation.values.comment || ""}
                          invalid={
                            newUSerVerifyValidation.touched.comment &&
                            newUSerVerifyValidation.errors.comment
                              ? true
                              : false
                          }
                        />
                        {newUSerVerifyValidation.touched.comment &&
                        newUSerVerifyValidation.errors.comment ? (
                          <FormFeedback type="invalid">
                            {newUSerVerifyValidation.errors.comment}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md="6" className="border-start">
                  <h5 className="border-bottom pb-3 ms-2 ">
                    <b>Customer Detail</b>
                  </h5>
                  <div className="mt-4 ">
                    <p>
                      <span className="fas fa-location-arrow me-1"></span>
                      <span>Area : </span>{" "}
                      <span>
                        <b>{order?.customer_address?.area?.area_name}</b>
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="fas fa-phone me-1"></span>
                      <span>Contact : </span>{" "}
                      <span>
                        <b>{order?.customer?.contact_no}</b>
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="fas fa-map-marker-alt me-1"></span>
                      <span>Address : </span>{" "}
                      <span>
                        <b>{order?.customer_address?.full_address}</b>
                      </span>
                    </p>
                  </div>
                </Col>
              </Row>
              <Button color="primary" type="submit">
                Submit form
              </Button>
            </Form>
          </div>
        </Modal>

        {/* new user verify popup End */}

        {/* Order Status popup Details Start*/}

        <Modal
          isOpen={orderStatusModal}
          toggle={() => {
            orderStatusToggle();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Status Info</h5>
            <button
              type="button"
              onClick={() => {
                setorderStatusModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body ">
            <div className="table-responsive w-100">
              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Updated By</th>
                  </tr>
                </thead>
                <tbody>
                  {orderStatusByIdData.map((item, index) => (
                    <tr key={item?.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{formattedDate(item?.created_at)}</td>
                      <td>{item?.status}</td>
                      <td>{item?.updated_by}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal>

        {/* Order Status popup Details End*/}

        {/* Renew Order Popup Start */}

        <Modal
          isOpen={renewOrderPopup}
          toggle={() => {
            renewOrderToggle();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">
              Edit order Or continue with same order
            </h5>
            <button
              type="button"
              onClick={() => {
                setrenewOrderPopup(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h5 className="text-primary text-center">
              Do you want to renew with same order details or edit order
              details?
            </h5>

            <div className="mt-4">
              <Link to={`/subscription-orders-Edit/${order?.order_id}`}>
                <Button color="primary">Edit Order </Button>
              </Link>
              <Button
                color="danger"
                className="ms-2"
                onClick={() => {
                  continueWithSameOrdercontinueWithSameOrderToggle();
                  setrenewOrderPopup(false);
                }}
              >
                Continue With Same Order
              </Button>
            </div>
          </div>
        </Modal>

        {/* Renew Order Popup End */}

        {/* Continue With same order Start */}

        <Modal
          isOpen={continueWithSameOrderModal}
          toggle={() => {
            continueWithSameOrdercontinueWithSameOrderToggle();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Center Modal</h5>
            <button
              type="button"
              onClick={() => {
                setcontinueWithSameOrderModal(false);
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
              <Col md="6">
                <h5>Order Amount:</h5>{" "}
              </Col>
              <Col md="6 text-end ">
                <h5 className="me-3">₹{order?.pa_discount}.00</h5>{" "}
              </Col>
              <Col md="6 " className="mt-2">
                <h5>Current Wallet Amount</h5>
              </Col>
              <Col md="6 text-end" className="mt-2">
                <h5 className="me-3">
                  ₹
                  {order?.wallet_amount === null
                    ? "00.00"
                    : order?.wallet_amount}
                </h5>
              </Col>
              <Col md="12" className="mt-2">
                <FormGroup className="">
                  <Input
                    name="payment_mode"
                    placeholder="Payment Mode"
                    type="select"
                    className="form-control"
                    id="payment_mode"
                    onChange={(e) => setPaymentMode(e.target.value)}
                    value={paymentMode}
                  >
                    {/* Placeholder option */}
                    <option value="Offline">Cash Collection</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="12" className="mt-2">
                <FormGroup className="">
                  <Label for="payment_receivable">Payment Receivable</Label>
                  <Input
                    name="payment_receivable"
                    placeholder="Enter payment amount"
                    type="text"
                    className="form-control"
                    id="payment_receivable"
                    disabled
                    value={order?.pa_discount}
                  />
                </FormGroup>
              </Col>
              <Col md="12" className="d-flex justify-content-center">
                <Button color="info" onClick={handlePayContinueWithSameOrder}>
                  Pay Now
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* Continue With same order End */}

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
                              value={subscriptionOrderData?.order?.order_id}
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
                              value={subscriptionOrderData?.order?.refund_mode}
                            >
                              {" "}
                              <option
                                value={
                                  subscriptionOrderData?.order?.refund_mode
                                }
                              >
                                {subscriptionOrderData?.order?.refund_mode}
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
                              value={subscriptionOrderData?.order?.refund_date}
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
                              value={
                                subscriptionOrderData?.order?.refund_amount
                              }
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
                              value={
                                subscriptionOrderData?.order?.reference_number
                              }
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

        {/* Allocate Order Popup to allocate Delivery Boy Startr */}

        <Modal
          size="lg"
          isOpen={allocateOrderModal}
          toggle={() => {
            allocateOrderToggle();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Allocate New Orders</h5>
            <button
              type="button"
              onClick={() => {
                setallocateOrderModal(false);
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
              <Col md="4">
                <p className="fs-5 ">Customer Name :</p>
              </Col>
              <Col md="8">
                <h6 className="fs-5">{order?.customer?.first_name}</h6>
              </Col>
              <Col md="4">
                <p className="fs-5">Order No. :</p>
              </Col>
              <Col md="8">
                <h6 className="fs-5"> {order?.order_id}</h6>
              </Col>
              <Col md="4">
                <p className="fs-5">Customer Address :</p>
              </Col>
              <Col md="8">
                <h6 className="fs-5">
                  <b>{order?.customer_address?.full_address}</b>
                </h6>
              </Col>

              <Col md="4">
                <p className="fs-5">Delivery Area :</p>
              </Col>
              <Col md="8">
                <h6 className="fs-5">
                  {order?.customer_address?.area?.area_name} ({" "}
                  {order?.customer_address?.pincode?.code} )
                </h6>
              </Col>
            </Row>
            <Row className=" border-top w-100">
              <Col lg={12}>
                <CardBody className="py-3">
                  <CardTitle className="h4">Assign Delivery Boy</CardTitle>
                  <div
                    className="table-responsive mt-3"
                    style={{ overflow: "auto" }}
                  >
                    <Table className="table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Delivery Boy</th>
                          <th>Current Deliveries</th>
                          <th>Order Expired Soon</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveryBoyForAllocate?.results
                          ?.filter(
                            (item) =>
                              item.delivery_boy.job_type === "Delivery Boy"
                          )
                          .map((item) => (
                            <tr
                              key={item.delivery_boy?.delivery_boy_id}
                              onClick={() =>
                                setselectedDeliveryBoyIdForAllocateDeliveryBoy(
                                  item.delivery_boy?.delivery_boy_id
                                )
                              }
                              className={
                                selectedDeliveryBoyIdForAllocateDeliveryBoy ===
                                item.delivery_boy?.delivery_boy_id
                                  ? "table-primary"
                                  : ""
                              }
                            >
                              <th scope="row">
                                {item?.delivery_boy?.first_name}{" "}
                                {item.delivery_boy.last_name}
                              </th>
                              <td>{item?.orders}</td>
                              <td>{item?.expiring_orders}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                  <Row className="mt-3 text-center ">
                    <Col md="12">
                      <Button
                        color="primary"
                        className="px-4"
                        onClick={handleSubmitAllocateNewOrder}
                      >
                        Submit
                      </Button>
                      <Button color="danger" className="ms-2 px-4" onClick={() => {
                setallocateOrderModal(false);
              }}>
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* Allocate Order Popup to allocate Delivery Boy End */}
      </div>
    </>
  );
};

export default ViewSubscriptionOrders;

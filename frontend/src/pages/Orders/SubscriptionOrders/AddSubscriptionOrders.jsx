import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
  CardTitle,
  Table,
  Modal,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  API_CUSTOMERS_REGISTER_GET_POST,
  API_DELIVERY_FREQUENCY_GET,
  API_DELIVERY_PATTERN_GET_POST,
  API_PRODUCT_POST_GET,
  API_SUBSCRIPTION_OFFER_APPLY,
  API_SUBSCRIPTION_ORDER_ADD,
  API_TRIAL_PLAN_AND_SUBSCRIPTION_GET,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { toast } from "react-toastify";

const AddSubscriptionOrders = () => {
  const [paymentDetailPopup, setpaymentDetailPopup] = useState(false);
  const [customresDetails, setCustomresDetails] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deliveryFrequency, setDeliveryFrequency] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState([]);
  const [addSubscriptionDataById, setAddSubscriptionDataById] = useState([]);
  const [selectedSubscriptionPlanItem, setSelectedSubscriptionPlanItem] =
    useState([]);
  const [selectedSubscriptionDurationDay, setSelectedSubscriptionDurationDay] =
    useState([]);
  const [selectedSubscriptionDuration, setSelectedSubscriptionDuration] =
    useState("");
  const [selectedDeliveryFrequency, setSelectedDeliveryFrequency] =
    useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deliveryPattern, setDeliveryPattern] = useState([]);
  const [products, setProducts] = useState([]);
  const [dayOneIncDec, setDayOneIncDec] = useState(0);
  const [dayTwoIncDec, setDayTwoIncDec] = useState(0);
  const [selectedProductIDs, setSelectedProductIDs] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [calculatedPrices, setCalculatedPrices] = useState([]);
  const [OfferAppliedPries, setOfferAppliedPries] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  console.log("selectedSubscriptionPlanItem", selectedSubscriptionPlanItem);

  // Local storage token
  const { config, first_name, last_name } = GetAuthToken();
  const navigate = useNavigate();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      customer_id: "",
      delivery_frequency: "",
      subscription_duration: "",
      delivery_pattern: "",
      payment_mode: "",
      subscription_type: "",
      appointment_time: "",
      created_by: "",
      order_type: "",
      selected_product: "",
      qty_day1: 0,
      qty_day2: 0,
    },
    validationSchema: Yup.object({
      customer_id: Yup.string().required("Please Select Customer"),
      payment_mode: Yup.string().required("Please Select Payment Mode"),
      delivery_frequency: Yup.string().required(
        "Please Select Delivery Frequency"
      ),
      subscription_duration: Yup.string().required(
        "Please Select Subscription Duration"
      ),
      delivery_pattern: Yup.string().required("Please Select Delivery Pattern"),
      appointment_time: Yup.string().required("Please Select Time"),
      selected_product: Yup.string().required("Please Select Product"),
      qty_day1: Yup.number().required("Please Add Qty").min(0),
      qty_day2: Yup.number().required("Please Add Qty").min(0),
    }),
    onSubmit: async (values) => {
      // Handle form submission here
      // console.log("values", values);
    },
  });

  const appoinmentTime = [
    { id: "10:00am to 12:30pm", time: "10:00am to 12:30pm" },
    { id: "1:30pm to 4:00pm", time: "1:30pm to 4:00pm" },
  ];

  const getCustomersData = async () => {
    const { data } = await axios.get(API_CUSTOMERS_REGISTER_GET_POST, config);
    setCustomresDetails(data.data);
  };

  const getDeliveryFrequencyData = async () => {
    const { data } = await axios.get(API_DELIVERY_FREQUENCY_GET, config);
    setDeliveryFrequency(data.data);
  };

  const getDeliveryPatternData = async () => {
    const { data } = await axios.get(API_DELIVERY_PATTERN_GET_POST, config);
    setDeliveryPattern(data.data);
  };

  const getProductsData = async () => {
    const { data } = await axios.get(API_PRODUCT_POST_GET, config);
    setProducts(data.data);
  };
  function tog_standard() {
    setpaymentDetailPopup(!paymentDetailPopup);
  }

  // const getSubscriptionPlanData = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       API_TRIAL_PLAN_AND_SUBSCRIPTION_GET,
  //       config
  //     );
  //     setSubscriptionPlan(data.data.subscription_plan);
  //     console.log("setSubscriptionPlan", data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const getSubscriptionPlanData = async () => {
    try {
      const { data } = await axios.get(
        API_TRIAL_PLAN_AND_SUBSCRIPTION_GET,
        config
      );

      let filteredPlans = [];

      if (selectedDeliveryFrequency == "Daily") {
        // Include trial_plan only if selectedDeliveryFrequency is "Daily"
        filteredPlans = [
          ...data.data.trial_plan.filter((item) => item.is_active === true),
          ...data.data.subscription_plan.filter(
            (item) => item.is_active === true
          ),
        ];
      } else {
        // If selectedDeliveryFrequency is not "Daily", only include subscription_plan
        filteredPlans = data.data.subscription_plan.filter(
          (item) => item.is_active === true
        );
      }

      console.log("Selected Delivery Frequency:", selectedDeliveryFrequency);
      console.log("Filtered Plans:", filteredPlans);
      console.log("Filtered Plans:", filteredPlans);

      setSubscriptionPlan(filteredPlans);
      console.log("setSubscriptionPlan", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRemoveProduct = (productId) => {
    setAddSubscriptionDataById((prevData) =>
      prevData.filter((item) => item.selected_product !== productId)
    );
  };

  const handleDeliveryFrequencyChange = (event) => {
    setSelectedDeliveryFrequency(event.target.value);
    setAddSubscriptionDataById([]); // Reset the state to an empty array
    validation.handleChange(event); // Handle the formik change event if needed
  };

  const handleSubscriptionDurationChange = (event) => {
    setAddSubscriptionDataById([]);
    validation.handleChange(event);
    setSelectedSubscriptionDuration(event.target.value);

    const selectedValue = String(event.target.value);
    const selectedPlanItem = subscriptionPlan.find(
      (item) => String(item.days) === selectedValue
    );

    setSelectedSubscriptionPlanItem(selectedPlanItem);
  };

  const incrementDayOneIncDec = () => {
    setDayOneIncDec(dayOneIncDec + 1);
    validation.setFieldValue("qty_day1", String(dayOneIncDec + 1));
  };

  const decrementDayOneIncDec = () => {
    if (dayOneIncDec > 0) {
      setDayOneIncDec(dayOneIncDec - 1);
      validation.setFieldValue("qty_day1", String(dayOneIncDec - 1));
    }
  };

  const incrementDayTwoIncDec = () => {
    setDayTwoIncDec(dayTwoIncDec + 1);
    validation.setFieldValue("qty_day2", String(dayTwoIncDec + 1));
  };

  const decrementDayTwoIncDec = () => {
    if (dayTwoIncDec > 0) {
      setDayTwoIncDec(dayTwoIncDec - 1);
      validation.setFieldValue("qty_day2", String(dayTwoIncDec - 1));
    }
  };
  const togglePaymentDetailPopup = () => {
    setpaymentDetailPopup(!paymentDetailPopup);
  };

  const handleAddProduct = () => {
    const selectedProductId = validation.values.selected_product;
    const qtyDay1 = parseInt(validation.values.qty_day1, 10);
    const qtyDay2 = parseInt(validation.values.qty_day2, 10);

    // Check if at least one of qty_day1 or qty_day2 is greater than 0
    if (selectedProductId && (qtyDay1 > 0 || qtyDay2 > 0)) {
      const existingProductIndex = addSubscriptionDataById.findIndex(
        (item) => item.selected_product === selectedProductId
      );

      // Check if the selected product already exists in the array
      if (existingProductIndex !== -1) {
        const updatedData = [...addSubscriptionDataById];
        updatedData[existingProductIndex].qty_day1 += qtyDay1;
        updatedData[existingProductIndex].qty_day2 += qtyDay2;
        setAddSubscriptionDataById(updatedData);
      } else {
        // Add a new product to the array
        setAddSubscriptionDataById([
          ...addSubscriptionDataById,
          {
            ...validation.values,
            qty_day1: qtyDay1,
            qty_day2: qtyDay2,
          },
        ]);
      }
    } else {
      toast.error(`Qty must be greater than 0`, {
        position: "top-center",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    // Filter products based on selectedProductIDs and update selectedProducts state
    const filteredProducts = products.filter((item) =>
      selectedProductIDs.includes(item.id)
    );
    setSelectedProducts(filteredProducts);
  }, [selectedProductIDs, products]);

  useEffect(() => {
    if (addSubscriptionDataById && addSubscriptionDataById.length > 0) {
      setSelectedSubscriptionDurationDay(
        subscriptionPlan.find(
          (actualDay) =>
            actualDay.id == addSubscriptionDataById[0]?.subscription_duration
        )
      );
    }
  }, [addSubscriptionDataById, subscriptionPlan]);

  const handleSubmitSubscriptionCartProducts = async () => {
    const formattedData = {
      customer_id: addSubscriptionDataById[0]?.customer_id,
      delivery_frequency: addSubscriptionDataById[0]?.delivery_frequency,
      coupon_code: couponCode || "",
      subscription_duration: parseInt(
        addSubscriptionDataById[0]?.subscription_duration
      ),
      delivery_pattern: validation.values.delivery_pattern,
      payment_mode: validation.values.payment_mode,
      products: addSubscriptionDataById.map((item) => ({
        product_id: parseInt(item?.selected_product),
        qty_day1: parseInt(item?.qty_day1),
        qty_day2: parseInt(item?.qty_day2),
      })),
      subscription_type: selectedSubscriptionPlanItem.type,
      appointment_time: validation.values.appointment_time,
      created_by: `${first_name} ${last_name}`,
    };

    try {
      const { data } = await axios.post(
        API_SUBSCRIPTION_ORDER_ADD,
        formattedData,
        config
      );
      togglePaymentDetailPopup();
      navigate("/subscription-orders");
      toast.success(`Subscription order created successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
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
  };

  // calculations
  const totalQty =
    selectedDeliveryFrequency === "Alternate"
      ? addSubscriptionDataById
          .map(
            (item) =>
              (parseInt(item.subscription_duration) / 2) *
              (parseInt(item.qty_day1) + parseInt(item.qty_day2))
          )
          .reduce((acc, qty) => acc + qty, 0)
      : selectedDeliveryFrequency === "Daily"
      ? addSubscriptionDataById
          .map(
            (item) =>
              parseInt(item.subscription_duration) *
              (parseInt(item.qty_day1) + parseInt(item.qty_day2))
          )
          .reduce((acc, qty) => acc + qty, 0)
      : 0; // Default value or handle other cases

  const formattedTotalQty = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(totalQty);

  // Now you can use the formattedTotalQty variable in your component

  // Now you can use the `totalQty` variable in your component

  useEffect(() => {
    getCustomersData();
    getDeliveryFrequencyData();
    getDeliveryPatternData();
    getProductsData();
  }, []);

  useEffect(() => {
    getSubscriptionPlanData();
  }, [selectedDeliveryFrequency]);

  useEffect(() => {
    const calculatePrices = () => {
      const prices = addSubscriptionDataById.map((item) => {
        const price =
          selectedDeliveryFrequency == "Alternate"
            ? (((item.qty_day1 + item.qty_day2) *
                parseInt(selectedSubscriptionDuration, 10)) /
                2) *
              ((item.selected_product &&
                products?.find(
                  (productName) => productName?.id == item?.selected_product
                )?.product_rate) ||
                0)
            : selectedDeliveryFrequency == "Daily"
            ? item.qty_day1 *
              parseInt(selectedSubscriptionDuration, 10) *
              ((item.selected_product &&
                products?.find(
                  (productName) => productName?.id == item?.selected_product
                )?.product_rate) ||
                0)
            : 0;

        return price;
      });

      setCalculatedPrices(prices);
    };

    calculatePrices();
  }, [
    selectedDeliveryFrequency,
    selectedSubscriptionDuration,
    addSubscriptionDataById,
    products,
  ]);

  // Calculate the total whenever calculatedPrices changes
  const totalPrice = calculatedPrices.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const handleApplyCoupon = async () => {
    const couponData = {
      coupon_code: couponCode,
      customer_id: addSubscriptionDataById[0]?.customer_id,
      order_type:
        selectedSubscriptionPlanItem.type === "subscription"
          ? "Subscription Orders"
          : "Trial Orders",

      amount: totalPrice,
    };

    try {
      const { data } = await axios.post(
        API_SUBSCRIPTION_OFFER_APPLY,
        couponData,
        config
      );
      setOfferAppliedPries(data);

      toast.success(`Coupan is Applicable`, {
        position: "top-center",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      // If the API call is successful, set isCouponApplied to true
      setIsCouponApplied(true);
    } catch (error) {
      console.error(error);
      console.log("error", error?.response?.data?.error);
      const errorMessage = error?.response?.data?.error;

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };
  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Create Subscription Order</h3>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Form
          className="needs-validation"
          onSubmit={validation.handleSubmit} // Corrected the onSubmit handler
          encType="multipart/form-data"
        >
          <Row>
            <Col md="4">
              <Card>
                <CardBody>
                  <h4 className="fw-bold">Customer Details</h4>

                  <Row>
                    <Col md="12">
                      <FormGroup className="mb-3">
                        <Label htmlFor="customer_id">Select Customer</Label>
                        <Input
                          name="customer_id"
                          placeholder="Select customer_id"
                          type="select"
                          className="form-control"
                          id="customer_id"
                          onChange={(event) => {
                            validation.handleChange(event); // Handle formik's handleChange
                            const selectedId = event.target.value;
                            const selectedCustomer = customresDetails.find(
                              (item) => item.customer.customer_id === selectedId
                            );
                            setSelectedCustomer(selectedCustomer);
                          }}
                          onBlur={validation.handleBlur}
                          value={validation.values.customer_id || ""}
                          invalid={
                            validation.touched.customer_id &&
                            validation.errors.customer_id
                              ? true
                              : false
                          }
                        >
                          <option value="">Select Customer</option>
                          {customresDetails.map((item) => (
                            <option
                              key={item?.customer?.customer_id}
                              value={item?.customer?.customer_id}
                            >
                              {item?.customer?.first_name}{" "}
                              {item?.customer?.last_name} - (
                              {item?.customer?.contact_no})
                            </option>
                          ))}
                        </Input>
                        {validation.touched.customer_id &&
                        validation.errors.customer_id ? (
                          <FormFeedback type="invalid">
                            {validation.errors.customer_id}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      {selectedCustomer ? (
                        <div>
                          <p className="mb-0 pb-0 mt-3">
                            <span className="fas fa-phone-alt me-2"></span>
                            Contact:
                          </p>
                          <p className="mt-0 pt-0 ms-4 fs-5">
                            {selectedCustomer?.customer?.contact_no}
                          </p>
                          <div className="w-100 border"></div>
                          <p className="mb-0 pb-0 mt-3">
                            <span className="fas fa-map-marker-alt me-2"></span>
                            Pincode:
                          </p>
                          <p className="mt-0 pt-0 ms-4 fs-5">
                            {selectedCustomer?.addresses[0]?.pincode} (
                            {selectedCustomer?.addresses[0]?.area})
                          </p>
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col md="8">
              <Card>
                <CardBody>
                  <h4 className="fw-bold">Subscription Details</h4>
                </CardBody>

                <Row className="p-4">
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="delivery_frequency">
                        Delivery Frequency *
                      </Label>
                      <Input
                        name="delivery_frequency"
                        type="select"
                        className="form-control"
                        id="delivery_frequency"
                        onChange={handleDeliveryFrequencyChange} // Use the custom handler
                        onBlur={validation.handleBlur}
                        value={validation.values.delivery_frequency || ""}
                        invalid={
                          validation.touched.delivery_frequency &&
                          validation.errors.delivery_frequency
                            ? true
                            : false
                        }
                      >
                        <option value="">Select Delivery Frequency</option>
                        {deliveryFrequency &&
                          Object.keys(deliveryFrequency).map((key) => {
                            return deliveryFrequency[key].map((item) => {
                              return item.is_active ? (
                                <option key={item.id} value={item.day_pattern}>
                                  {item.day_pattern}
                                </option>
                              ) : null;
                            });
                          })}
                      </Input>
                      {validation.touched.delivery_frequency &&
                      validation.errors.delivery_frequency ? (
                        <FormFeedback type="invalid">
                          {validation.errors.delivery_frequency}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="subscription_duration">
                        Subscription Duration *
                      </Label>
                      <Input
                        name="subscription_duration"
                        placeholder="Select"
                        type="select"
                        className="form-control"
                        id="subscription_duration"
                        onChange={handleSubscriptionDurationChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.subscription_duration || ""}
                        invalid={
                          validation.touched.subscription_duration &&
                          validation.errors.subscription_duration
                            ? true
                            : false
                        }
                      >
                        <option value="">Select Subscription Duration</option>
                        {subscriptionPlan.map((item) => (
                          <option key={item.id} value={item.days}>
                            <b>{item.days}</b>
                          </option>
                        ))}
                      </Input>
                      {validation.touched.subscription_duration &&
                      validation.errors.subscription_duration ? (
                        <FormFeedback type="invalid">
                          {validation.errors.subscription_duration}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="delivery_pattern">
                        Delivery Pattern *
                      </Label>
                      <Input
                        name="delivery_pattern"
                        placeholder="Select"
                        type="select"
                        className="form-control"
                        id="delivery_pattern"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.delivery_pattern || ""}
                        invalid={
                          validation.touched.delivery_pattern &&
                          validation.errors.delivery_pattern
                            ? true
                            : false
                        }
                      >
                        <option value="">Select Delivery Pattern</option>
                        {deliveryPattern
                          .filter((item) => item.is_active === true)
                          .map((item) => (
                            <option key={item.id} value={item.delivery_pattern}>
                              <b>{item.delivery_pattern}</b>
                            </option>
                          ))}
                      </Input>
                      {validation.touched.delivery_pattern &&
                        validation.errors.delivery_pattern && (
                          <FormFeedback type="invalid">
                            {validation.errors.delivery_pattern}
                          </FormFeedback>
                        )}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="selected_product">Select Product *</Label>
                      <Input
                        name="selected_product"
                        placeholder="Select"
                        type="select"
                        className="form-control"
                        id="selected_product"
                        onChange={(e) => {
                          validation.handleChange(e);
                          setSelectedProductId(e.target.value);
                        }}
                        onBlur={validation.handleBlur}
                        value={validation.values.selected_product || ""}
                        invalid={
                          validation.touched.selected_product &&
                          validation.errors.selected_product
                            ? true
                            : false
                        }
                      >
                        <option value="">Select Product</option>
                        {products
                          .filter(
                            (item) => item.product_classification === "Saleable"
                          )
                          .map((item) => (
                            <option key={item.id} value={item.id}>
                              <b>{item.product_name}</b>
                            </option>
                          ))}
                      </Input>
                      {validation.touched.selected_product &&
                      validation.errors.selected_product ? (
                        <FormFeedback type="invalid">
                          {validation.errors.selected_product}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <Row className="d-flex align-items-center">
                      <Col md="3">
                        <Label htmlFor="qty_day1">Qty. Day 1:</Label>
                      </Col>
                      <Col className="d-flex ps-0" md="9">
                        <Button
                          color="link"
                          className="btn btn-link waves-effect waves-light ps-0"
                          onClick={decrementDayOneIncDec}
                        >
                          <span className="bx bx-minus fs-4 text-primary ps-0"></span>
                        </Button>
                        <div className="w-25 ps-0">
                          <FormGroup className="mb-3">
                            <Input
                              name="qty_day1"
                              placeholder="0"
                              type="text"
                              className="form-control text-center border-0 fs-5 ps-0"
                              id="qty_day1"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.qty_day1}
                              invalid={
                                validation.touched.qty_day1 &&
                                validation.errors.qty_day1
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.qty_day1 &&
                            validation.errors.qty_day1 ? (
                              <FormFeedback type="invalid">
                                {validation.errors.qty_day1}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </div>
                        <Button
                          color="link"
                          className="btn btn-link waves-effect waves-light ps-0"
                          onClick={incrementDayOneIncDec}
                        >
                          <span className="bx bx-plus fs-4 text-primary ps-0"></span>
                        </Button>
                      </Col>
                    </Row>
                  </Col>

                  {/* Day Two */}
                  {validation.values.delivery_frequency === "Alternate" && (
                    <Col md="6">
                      <Row className="d-flex align-items-center">
                        <Col md="3">
                          <Label htmlFor="qty_day2">Qty. Day 2:</Label>
                        </Col>
                        <Col className="d-flex ps-0" md="9">
                          <Button
                            color="link"
                            className="btn btn-link waves-effect waves-light ps-0"
                            onClick={decrementDayTwoIncDec}
                          >
                            <span className="bx bx-minus fs-4 text-primary ps-0"></span>
                          </Button>
                          <div className="w-25 ps-0">
                            <FormGroup className="mb-3">
                              <Input
                                name="qty_day2"
                                placeholder="0"
                                type="text"
                                className="form-control text-center border-0 fs-5 ps-0"
                                id="qty_day2"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.qty_day2}
                                invalid={
                                  validation.touched.qty_day2 &&
                                  validation.errors.qty_day2
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.qty_day2 &&
                              validation.errors.qty_day2 ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.qty_day2}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </div>
                          <Button
                            color="link"
                            className="btn btn-link waves-effect waves-light ps-0"
                            onClick={incrementDayTwoIncDec}
                          >
                            <span className="bx bx-plus fs-4 text-primary ps-0"></span>
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  )}
                </Row>

                <Button
                  className="float-end w-25"
                  color="primary"
                  onClick={handleAddProduct}
                  type="submit"
                >
                  Add
                </Button>
              </Card>
            </Col>
          </Row>

          {addSubscriptionDataById.length > 0 && (
            <Row>
              <Col xl="12">
                <Card>
                  <CardBody>
                    <div className="table-responsive">
                      <Table className="table mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th>Product</th>
                            <th>Qty day 1</th>
                            <th>
                              {addSubscriptionDataById.map((item) => (
                                <>
                                  {item.delivery_frequency === "Daily"
                                    ? ""
                                    : "Qty day 2"}
                                </>
                              ))}
                            </th>

                            <th>Rate</th>
                            <th>Total Rate</th>
                            <th>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(addSubscriptionDataById) &&
                            addSubscriptionDataById.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  {item.selected_product
                                    ? (
                                        products?.find(
                                          (productName) =>
                                            productName?.id ==
                                            item?.selected_product
                                        ) || {}
                                      ).product_name || ""
                                    : ""}
                                </td>
                                <td>{item.qty_day1}</td>
                                <td>
                                  {item.delivery_frequency === "Daily"
                                    ? ""
                                    : item.qty_day2}
                                </td>
                                <td>
                                  ₹{" "}
                                  {item.selected_product
                                    ? (
                                        products?.find(
                                          (productName) =>
                                            productName?.id ==
                                            item?.selected_product
                                        ) || {}
                                      ).product_rate || ""
                                    : ""}
                                </td>

                                <td>
                                  <b>
                                    {selectedDeliveryFrequency ===
                                    "Alternate" ? (
                                      <>
                                        ₹{" "}
                                        {(((item.qty_day1 + item.qty_day2) *
                                          parseInt(
                                            selectedSubscriptionDuration,
                                            10
                                          )) /
                                          2) *
                                          ((item.selected_product &&
                                            products?.find(
                                              (productName) =>
                                                productName?.id ==
                                                item?.selected_product
                                            )?.product_rate) ||
                                            0)}{" "}
                                      </>
                                    ) : selectedDeliveryFrequency ===
                                      "Daily" ? (
                                      <>
                                        ₹{" "}
                                        {item.qty_day1 *
                                          parseInt(
                                            selectedSubscriptionDuration,
                                            10
                                          ) *
                                          ((item.selected_product &&
                                            products?.find(
                                              (productName) =>
                                                productName?.id ==
                                                item?.selected_product
                                            )?.product_rate) ||
                                            0)}{" "}
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </b>
                                </td>

                                <td>
                                  <Button
                                    className="btn btn-danger btn-sm ms-1"
                                    color="danger"
                                    onClick={() =>
                                      handleRemoveProduct(item.selected_product)
                                    }
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
                <Card className="p-4 ">
                  {addSubscriptionDataById.length > 0 && (
                    <Row>
                      <Col md="8">
                        <Row>
                          <Col md="10">
                            <div>
                              <label className="form-label">Apply Coupon</label>
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Enter Your Coupon"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                disabled={isCouponApplied}
                              />
                              <div className="valid-feedback">Looks good!</div>
                              <div className="invalid-feedback">
                                Please choose a username.
                              </div>
                            </div>
                          </Col>
                          <Col md="2" className="">
                            <div className="mt-4">
                              {/* <Button
                                color="light"
                                className="px-4"
                                onClick={handleApplyCoupon}
                                disabled={isCouponApplied}
                              >
                                Apply
                              </Button> */}

                              {isCouponApplied === true ? (
                                <>
                                  <Button
                                    color="light"
                                    className="text-danger"
                                    onClick={() => {
                                      setIsCouponApplied(false);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    color="light"
                                    className="px-4"
                                    onClick={handleApplyCoupon}
                                    disabled={isCouponApplied}
                                  >
                                    Apply
                                  </Button>
                                </>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col md="4">
                        <Card className="mt-3 shadow-none">
                          <CardBody>
                            <div className="d-flex justify-content-center">
                              <div>
                                <div>
                                  {/* Display total quantity */}
                                  <h5>Total Qty.: {totalQty}</h5>
                                </div>

                                {/* Display total quantity */}
                                <h5>
                                  {" "}
                                  Total Amount :{""} {totalPrice}
                                </h5>
                                {isCouponApplied === true &&
                                OfferAppliedPries.length !== 0 ? (
                                  <>
                                    <h5>
                                      Discount (
                                      {OfferAppliedPries?.discount_rate}%) :{" "}
                                      {OfferAppliedPries?.discount}
                                    </h5>
                                    <h5>
                                      Total Payable :{" "}
                                      {OfferAppliedPries?.pa_discount}
                                    </h5>
                                  </>
                                ) : (
                                  ""
                                )}
                                {}
                                {/* Display total price */}
                              </div>
                              <div></div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md="12">
                        <Button
                          className=" float-end me-3 px-5"
                          color="primary"
                          data-toggle="modal"
                          data-target="#myModal"
                          onClick={() => {
                            togglePaymentDetailPopup();
                          }}
                        >
                          Save
                        </Button>

                        <Link to="/subscription-orders">
                          <Button
                            className=" float-end me-3  px-5"
                            color="danger"
                          >
                            Cancel
                          </Button>
                        </Link>
                      </Col>
                    </Row>
                  )}
                </Card>
              </Col>
            </Row>
          )}
        </Form>
      </Container>

      {/* modal start */}
      <Col lg={6}>
        <div>
          <Modal
            isOpen={paymentDetailPopup}
            toggle={() => {
              tog_standard();
            }}
          >
            <div className="modal-header">
              <h4 className="modal-title mt-0" id="myModalLabel">
                Payment Details
              </h4>
              <button
                type="button"
                onClick={() => {
                  setpaymentDetailPopup(false);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body ">
              <Row className=" p-0 m-0">
                <Col md="10" className="text-start  mt-3  ">
                  <h5>Order Amount :</h5>
                </Col>
                <Col md="2" className="mt-3">
                  {/* <h5>₹{totalPrice}</h5> */}
                  {isCouponApplied === true &&
                  OfferAppliedPries.length !== 0 ? (
                    <h5>₹{OfferAppliedPries?.pa_discount}</h5>
                  ) : (
                    <h5>₹{totalPrice}</h5>
                  )}
                </Col>

                <Col md="10" className=" text-start mt-3">
                  <h5>Current Wallet Amount :</h5>
                </Col>
                <Col md="2" className="mt-3">
                  {" "}
                  Pending
                </Col>

                <Col md="12" className="mt-3">
                  <FormGroup className="mb-3 ">
                    <Input
                      name="appointment_time"
                      placeholder="Select Order Type"
                      type="select"
                      className="form-control"
                      id="appointment_time"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.appointment_time || ""}
                      invalid={
                        validation.touched.appointment_time &&
                        validation.errors.appointment_time
                      }
                    >
                      {/* Placeholder option */}
                      <option value="">Select Time</option>

                      {/* Add a return statement in the mapping function */}
                      {appoinmentTime.map((item) => (
                        <option key={item.id} value={item.id}>
                          <b>{item.time}</b>
                        </option>
                      ))}
                    </Input>
                    {validation.touched.appointment_time &&
                    validation.errors.appointment_time ? (
                      <FormFeedback type="invalid">
                        {validation.errors.appointment_time}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col md="12" className="mt-3">
                  <FormGroup className="mb-3 ">
                    <Input
                      name="payment_mode"
                      placeholder="Payment Mode"
                      type="select"
                      className="form-control"
                      id="payment_mode"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.payment_mode || ""}
                      invalid={
                        validation.touched.payment_mode &&
                        validation.errors.payment_mode
                      }
                      defaultValue="Offline"
                    >
                      {/* Placeholder option */}
                      <option value="">Select Mode</option>
                      <option value="Offline">Cash Collection</option>
                    </Input>
                    {validation.touched.payment_mode &&
                    validation.errors.payment_mode ? (
                      <FormFeedback type="invalid">
                        {validation.errors.payment_mode}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col md="10" className=" text-start mt-3 ">
                  <h5 className="fw-lighter">Payment Receivable :</h5>
                </Col>
                <Col md="2" className="mt-3  ">
                  {" "}
                  {isCouponApplied === true &&
                  OfferAppliedPries.length !== 0 ? (
                    <h5>₹{OfferAppliedPries?.pa_discount}</h5>
                  ) : (
                    <h5> ₹{totalPrice}</h5>
                  )}
                </Col>
              </Row>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => {
                  tog_standard();
                }}
                className="btn btn-secondary "
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary "
                onClick={handleSubmitSubscriptionCartProducts}
              >
                Save changes
              </button>
            </div>
          </Modal>
        </div>
      </Col>

      {/* modal End */}
    </div>
  );
};

export default AddSubscriptionOrders;

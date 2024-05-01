import {
  API_CUSTOMERS_REGISTER_GET_POST,
  API_DELIVERY_FREQUENCY_GET,
  API_DELIVERY_PATTERN_GET_POST,
  API_PRODUCT_POST_GET,
  API_SUBSCRIPTION_OFFER_APPLY,
  API_SUBSCRIPTION_ORDER_ADD,
  API_SUBSCRIPTION_ORDER_DATA_GET_BY_ID,
  API_TRIAL_PLAN_AND_SUBSCRIPTION_GET,
} from "customhooks/All_Api/Apis";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { toast } from "react-toastify";
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
const EditSubscriptionOrders = () => {
  const [subscriptionOrderData, setSubscriptionOrderData] = useState([]);
  const [subscriptionOrderedProducts, setSubscriptionOrderedProducts] =
    useState([]);
  const [paymentDetailPopup, setpaymentDetailPopup] = useState(false);
  const [customresDetails, setCustomresDetails] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deliveryFrequency, setDeliveryFrequency] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState([]);
  const [addSubscriptionDataById, setAddSubscriptionDataById] = useState([]);
  const [deliveryPattern, setDeliveryPattern] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dayOneIncDec, setDayOneIncDec] = useState(0);
  const [dayTwoIncDec, setDayTwoIncDec] = useState(0);
  const [selectedProductIDs, setSelectedProductIDs] = useState([]);
  const [mergedProductsData, setMergedProductsData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedSubscriptionPlanItem, setSelectedSubscriptionPlanItem] =
    useState([]);
  const [selectedSubscriptionDurationDay, setSelectedSubscriptionDurationDay] =
    useState([]);
  const [selectedSubscriptionDuration, setSelectedSubscriptionDuration] =
    useState("");
  const [selectedDeliveryFrequency, setSelectedDeliveryFrequency] =
    useState("");
  const [calculatedPrices, setCalculatedPrices] = useState([]);
  const [OfferAppliedPries, setOfferAppliedPries] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Local storage token
  const { config, first_name, last_name } = GetAuthToken();
  const { id } = useParams();
  const navigate = useNavigate();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      customer_id: subscriptionOrderData?.order?.customer?.customer_id || "",
      delivery_frequency:
        subscriptionOrderData?.order?.delivery_frequency || "",
      subscription_duration:
        subscriptionOrderData?.order?.subscription_duration || "",
      delivery_pattern: subscriptionOrderData?.order?.delivery_pattern || "",
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
      qty_day2: Yup.string().required("Please Add Qty").min(0),
    }),
    onSubmit: async (values) => {
      // Handle form submission here
    },
  });

  // const getSubscriptionOrderData = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `${API_SUBSCRIPTION_ORDER_DATA_GET_BY_ID}${id}/`,
  //       config
  //     );
  //     setSubscriptionOrderData(data);
  //     setSubscriptionOrderedProducts(data.items);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const getSubscriptionOrderData = async () => {
    try {
      const { data } = await axios.get(
        `${API_SUBSCRIPTION_ORDER_DATA_GET_BY_ID}${id}/`,
        config
      );

      // Destructuring relevant data from the API response
      const { items, order } = data;

      // Transforming and extracting specific keys from each item in the 'items' array
      const transformedData = items.map((item) => ({
        appointment_time: item.appointment_time || "",
        created_by: item.created_by || "",
        customer_id: order?.customer?.customer_id || "",
        delivery_frequency: order.delivery_frequency || "",
        delivery_pattern: order.delivery_pattern || "",
        order_type: order.order_type || "",
        payment_mode: order.payment_mode || "",
        qty_day1: item.qty_day1 || 0,
        qty_day2: item.qty_day2 || 0,
        selected_product: item?.product?.id || "",
        subscription_duration: order?.subscription_duration || 0,
        subscription_type: order.subscription_type || "",
      }));

      // Setting the state with the transformed data
      setSubscriptionOrderData(data);

      // setSubscriptionOrderedProducts(transformedData);
      setAddSubscriptionDataById(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCustomersData = async () => {
    const { data } = await axios.get(API_CUSTOMERS_REGISTER_GET_POST, config);
    setCustomresDetails(data.data);
  };

  const getDeliveryFrequencyData = async () => {
    const { data } = await axios.get(API_DELIVERY_FREQUENCY_GET, config);
    setDeliveryFrequency(data.data);
  };
  const togglePaymentDetailPopup = () => {
    setpaymentDetailPopup(!paymentDetailPopup);
  };

  const getSubscriptionPlanData = async () => {
    try {
      const response = await axios.get(
        API_TRIAL_PLAN_AND_SUBSCRIPTION_GET,
        config
      );
      setSubscriptionPlan(response.data.data.subscription_plan);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const sortedSubscriptionPlan = subscriptionPlan.sort(
    (a, b) => a.days - b.days
  );

  const getDeliveryPatternData = async () => {
    const { data } = await axios.get(API_DELIVERY_PATTERN_GET_POST, config);
    setDeliveryPattern(data.data);
  };
  function tog_standard() {
    setpaymentDetailPopup(!paymentDetailPopup);
  }
  const getProductsData = async () => {
    const { data } = await axios.get(API_PRODUCT_POST_GET, config);
    setProducts(data.data);
  };
  const handleDeliveryFrequencyChange = (event) => {
    setSelectedDeliveryFrequency(event.target.value);
    setAddSubscriptionDataById([]); // Reset the state to an empty array
    validation.handleChange(event); // Handle the formik change event if needed
  };

  useEffect(() => {
    console.log("selectedSubscriptionPlanItem", selectedSubscriptionPlanItem);
  }, [selectedSubscriptionPlanItem]);

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

  // console.log(
  //   "subscriptionOrderData",
  //   subscriptionOrderData?.order?.subscription_type
  // );
  // console.log("subscriptionPlan", subscriptionPlan);

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

  // calculations
  const totalQty =
    validation.values.delivery_frequency === "Alternate"
      ? addSubscriptionDataById
          .map(
            (item) =>
              (parseInt(item.subscription_duration) / 2) *
              (parseInt(item.qty_day1) + parseInt(item.qty_day2))
          )
          .reduce((acc, qty) => acc + qty, 0)
      : validation.values.delivery_frequency === "Daily"
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

  const subscripTionDaysForOrder =
    validation.values.delivery_frequency == "Alternate"
      ? selectedSubscriptionDurationDay?.days / 2
      : selectedSubscriptionDurationDay?.days;

  const totalQtyForDays = totalQty * subscripTionDaysForOrder;

  const handleRemoveProductSubscription = (indexToRemove) => {
    // Filter out the item with the specified index
    const updatedMergedProductsData = addSubscriptionDataById.filter(
      (_, index) => index !== indexToRemove
    );

    // Update the state with the new array
    setAddSubscriptionDataById(updatedMergedProductsData);
  };

  useEffect(() => {
    getSubscriptionOrderData();
    getCustomersData();
    getDeliveryFrequencyData();
    getSubscriptionPlanData();
    getDeliveryPatternData();
    getProductsData();
  }, []);

  const appoinmentTime = [
    { id: "10:00am to 12:30pm", time: "10:00am to 12:30pm" },
    { id: "1:30pm to 4:00pm", time: "1:30pm to 4:00pm" },
  ];

  const handleSubmitSubscriptionCartProducts = async () => {
    const formattedData = {
      customer_id: addSubscriptionDataById[0]?.customer_id,
      delivery_frequency: addSubscriptionDataById[0]?.delivery_frequency,
      order_id: subscriptionOrderData?.order?.order_id,
      coupon_code: couponCode || "",
      subscription_duration: parseInt(
        addSubscriptionDataById[0]?.subscription_duration
      ),
      delivery_pattern: addSubscriptionDataById[0]?.delivery_pattern,
      payment_mode: validation.values.payment_mode,
      products: addSubscriptionDataById.map((item) => ({
        product_id: parseInt(item?.selected_product),
        qty_day1: parseInt(item?.qty_day1),
        qty_day2: parseInt(item?.qty_day2),
      })),
      subscription_type:
        selectedSubscriptionPlanItem?.type || selectedSubscriptionPlanItem,
      appointment_time: validation.values.appointment_time,
      created_by: `${first_name} ${last_name}`,
    };

    try {
      const { data } = await axios.post(
        API_SUBSCRIPTION_ORDER_ADD,
        formattedData,
        config
      );
      navigate("/subscription-orders");
      toast.success(`Subscription order Renewd successfully`, {
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
  console.log();
  useEffect(() => {
    const calculatePrices = () => {
      // console.log("products:", products);

      const prices = addSubscriptionDataById.map((item) => {
        const price =
          validation.values.delivery_frequency === "Alternate"
            ? (((item.qty_day1 + item.qty_day2) *
                parseInt(validation.values.subscription_duration, 10)) /
                2) *
              ((item.selected_product &&
                products?.find(
                  (productName) => productName?.id == item?.selected_product
                )?.product_rate) ||
                0)
            : validation.values.delivery_frequency === "Daily"
            ? item.qty_day1 *
              parseInt(validation.values.subscription_duration, 10) *
              ((item.selected_product &&
                products?.find(
                  (productName) => productName?.id === item?.selected_product
                )?.product_rate) ||
                0)
            : 0;

        return price;
      });

      setCalculatedPrices(prices);
      console.log("Calculated Prices:", prices);
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
      console.log(error);
      toast.error("Coupan is not Applicable", {
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
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Edit Subscription Order</h3>
                  <Link to="">
                    <Button className="px-4" color="primary">
                      Create
                    </Button>
                  </Link>
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
                                (item) =>
                                  item.customer.customer_id === selectedId
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
                            disabled="true"
                          >
                            <option value="">Select Customer</option>
                            {customresDetails.map((item) => (
                              <option
                                key={item.customer.customer_id}
                                value={item.customer.customer_id}
                              >
                                {item.customer.first_name}{" "}
                                {item.customer.last_name} - (
                                {item.customer.contact_no})
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
                        <div>
                          <p className="mb-0 pb-0 mt-3">
                            <span className="fas fa-phone-alt me-2"></span>
                            Contact :{" "}
                          </p>
                          <p className="mt-0 pt-0 ms-4 ">
                            <b>
                              {
                                subscriptionOrderData?.order?.customer
                                  ?.contact_no
                              }
                            </b>
                          </p>
                          <div className="w-100 border"></div>
                          <p className="mb-0 pb-0 mt-3">
                            <span className="fas fa-map-marker-alt me-2"></span>
                            Pincode :{" "}
                          </p>
                          <p className="mt-0 pt-0 ms-4 ">
                            {" "}
                            <b>
                              {
                                subscriptionOrderData?.order?.customer_address
                                  ?.pincode?.code
                              }{" "}
                              (
                              {
                                subscriptionOrderData?.order?.customer_address
                                  ?.area?.area_name
                              }
                              )
                            </b>
                          </p>
                        </div>
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
                          onChange={handleDeliveryFrequencyChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.delivery_frequency || ""}
                          invalid={
                            validation.touched.delivery_frequency &&
                            validation.errors.delivery_frequency
                              ? true
                              : false
                          }
                        >
                          <option value="" disabled>
                            Select Delivery Frequency
                          </option>
                          {deliveryFrequency &&
                            Object.keys(deliveryFrequency).map((key) => {
                              return deliveryFrequency[key].map((item) => {
                                return item.is_active ? (
                                  <option
                                    key={item.id}
                                    value={item.day_pattern}
                                  >
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
                          subscription Duration *
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
                          <option value="" disabled>
                            Select subscription Duration
                          </option>

                          {sortedSubscriptionPlan.map((item) => (
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
                              <option
                                key={item.id}
                                value={item.delivery_pattern}
                              >
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
                        <Label htmlFor="selected_product">
                          Select Product *
                        </Label>
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
                              (item) =>
                                item.product_classification === "Saleable" &&
                                item.is_active === true
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
            <Card>
              <Row>
                <Col lg={12}>
                  <Card>
                    <CardBody>
                      <div className="table-responsive">
                        <Table className="table mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Product Name</th>
                              <th>Qty day 1</th>
                              <th>
                                {addSubscriptionDataById.map((item, index) => (
                                  <React.Fragment key={index}>
                                    {item.delivery_frequency !== "Daily" && (
                                      <th>Qty day 2</th>
                                    )}
                                  </React.Fragment>
                                ))}
                              </th>
                              <th>Rate</th>
                              <th>Total Rate</th>
                              <th>Remove</th>
                            </tr>
                          </thead>
                          <tbody>
                            {addSubscriptionDataById?.map((item, index) => {
                              // Find the corresponding product using the selected_product ID
                              const product = products.find(
                                (product) => product.id == item.selected_product
                              );

                              return (
                                <tr key={index}>
                                  <th scope="row">{product?.product_name}</th>
                                  <td>{item?.qty_day1}</td>
                                  <td>
                                    {item?.delivery_frequency === "Daily"
                                      ? ""
                                      : item.qty_day2}
                                  </td>
                                  <td>₹ {product?.product_rate}</td>
                                  {/* <td>
                                  
                                    <b>
                                      ₹{" "}
                                      {(item?.qty_day1 + item?.qty_day2) *
                                        validation.values
                                          .subscription_duration *
                                        product?.product_rate}
                                    </b>
                                  </td> */}
                                  <td>
                                    {validation.values.delivery_frequency ===
                                    "Daily" ? (
                                      <b>
                                        ₹{" "}
                                        {item?.qty_day1 *
                                          validation.values
                                            .subscription_duration *
                                          product?.product_rate}
                                      </b>
                                    ) : validation.values.delivery_frequency ===
                                      "Alternate" ? (
                                      <>
                                        <b>
                                          ₹{" "}
                                          {(item?.qty_day1 + item?.qty_day2) *
                                            (validation.values
                                              .subscription_duration /
                                              2) *
                                            product?.product_rate}
                                        </b>
                                      </>
                                    ) : (
                                      "" // Provide a default case or leave it empty based on your requirement
                                    )}
                                  </td>

                                  <td>
                                    <Button
                                      className="btn btn-danger btn-sm ms-1"
                                      color="danger"
                                      onClick={() =>
                                        handleRemoveProductSubscription(index)
                                      }
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>

                  {/* ///////////////////////////////////////////////// */}
                  <Card className="p-4 ">
                    {addSubscriptionDataById.length > 0 && (
                      <Row>
                        <Col md="8">
                          <Row>
                            <Col md="10">
                              <div>
                                <label className="form-label">
                                  Apply Coupon
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  placeholder="Enter Your Coupon"
                                  value={couponCode}
                                  onChange={(e) =>
                                    setCouponCode(e.target.value)
                                  }
                                  disabled={isCouponApplied}
                                />
                                <div className="valid-feedback">
                                  Looks good!
                                </div>
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
                                    <h5>Total Qty. : {totalQty}</h5>
                                  </div>

                                  {/* Display total quantity */}
                                  <h5>
                                    {" "}
                                    Total Amount :{""}
                                    {totalPrice}
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
                  {/* ///////////////////////////////////////////////// */}
                </Col>
              </Row>
            </Card>
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
                    <h5>
                      ₹
                      {subscriptionOrderData?.order?.wallet_amount === null
                        ? "00.00"
                        : subscriptionOrderData?.order?.wallet_amount}
                    </h5>
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
                        <option value="">Select Payment Mode</option>
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
    </>
  );
};

export default EditSubscriptionOrders;

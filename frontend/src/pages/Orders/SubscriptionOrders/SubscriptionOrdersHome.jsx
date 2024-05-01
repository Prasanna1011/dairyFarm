import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Table,
  Label,
  Input,
  Modal,
  FormFeedback,
  FormGroup,
  Form,
} from "reactstrap";

import classnames from "classnames";
import { TablePagination } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css"; // Import the styles
import { format } from "date-fns";
import {
  API_HUB_ADD_GET,
  API_HUB_MANAGE_TASK_GET,
  API_SUBSCRIPTION_EXCEL_DOWNLOAD,
  API_SUBSCRIPTION_ORDER_CANCEL_GET,
  API_SUBSCRIPTION_ORDER_DATA_GET,
  API_SUBSCRIPTION_REQUEST_TO_CANCEL_GET_PUT,
} from "customhooks/All_Api/Apis";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
function SubscriptionOrders() {
  const [page, setPage] = useState(0);
  const [pagePending, setPagePending] = useState(0); // Pagination state for first tab
  const [pageSizePending, setPageSizePending] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptionOrderData, setSubscriptionOrderData] = useState([]);
  const [manageTaskData, setManageTaskData] = useState([]);
  const [subscriptionCancelData, setSubscriptionCancelData] = useState([]);
  const [viewCancelRequestData, setviewCancelRequestData] = useState([]);
  const [customActiveTab, setcustomActiveTab] = useState("new");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDateFrom, setSelectedDateFrom] = useState("");
  const [selectedDateTo, setSelectedDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHub, setSelectedHub] = useState("");
  const [hubListData, setHubListData] = useState("");
  const [viewCancelRequestModal, setviewCancelRequestModal] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState(null);

  const [confirmCancelModal, setconfirmCancelModal] = useState(false);

  const [exportFileModal, setexportFileModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [exportEXCEL, setExportEXCEL] = useState([]);

  console.log("exportEXCEL", exportEXCEL);
  const exportStatusArray = [
    { key: "Active", value: "Active" },
    { key: "Renewal", value: "Renewal" },
    { key: "Expired", value: "Expired" },
    { key: "Paused", value: "Paused" },
    { key: "Cancelled", value: "Cancelled" },
    { key: "Upcoming", value: "Upcoming" },
  ];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'new'; 
  useEffect(() => {
    setcustomActiveTab(initialTab);
  }, [initialTab]);
  function exportFileToggle() {
    setexportFileModal(!exportFileModal);
  }

  // Local storage token
  const { config, first_name, last_name } = GetAuthToken();
  function confirmCancelToggle() {
    setconfirmCancelModal(!confirmCancelModal);
  }

  const handleStatusChange = (selectedValue) => {
    if (selectedValue === "Accepted") {
      confirmCancelToggle();
    }
  };

  console.log("selectedOrderData", selectedOrderData);

  function viewCancelRequestToggle() {
    setviewCancelRequestModal(!viewCancelRequestModal);
  }

  const orderCancelRequest = [
    { key: "Rejected", value: "Reject Request" },
    { key: "Accepted", value: "Accept Request and Cancel Order" },
  ];

  const getSubscriptionOrderData = async () => {
    try {
      const selectFrom = selectedDateFrom
        ? format(selectedDateFrom, "yyyy-MM-dd")
        : "";
      const selectTo = selectedDateTo
        ? format(selectedDateTo, "yyyy-MM-dd")
        : "";

    
      const { data } = await axios.get(
        `${API_SUBSCRIPTION_ORDER_DATA_GET}?hub_id=${selectedHub}&customer_or_order_id=${searchTerm}&from_date=${selectFrom}&to_date=${selectTo}&order_status=${customActiveTab}`,
        {
          ...config,
          params: {
            page:pagePending +1,
            page_size: pageSizePending,
          },
    
        }
      );
      console.log("data", data);
      setSubscriptionOrderData(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Call the function with empty dates to fetch data when the component is opened
    getSubscriptionOrderData(pagePending, pageSizePending);
  }, [
    customActiveTab,
    selectedDateFrom,
    selectedDateTo,
    searchTerm,
    selectedHub,
    pagePending,  pageSizePending,customActiveTab, selectedHub, searchTerm
  ]);

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  // Pagenation Start
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getCancelSubscriptionOrderData = async () => {
    const { data } = await axios.get(API_SUBSCRIPTION_ORDER_CANCEL_GET,  config);
    console.log("getCancelSubscriptionOrderData", data);
    setSubscriptionCancelData(data?.results);
  };

  // Pagenation End


  const handleNoButtonClick = () => {
    validation.setFieldValue("status", ""); // Reset the dropdown value
    confirmCancelToggle();
    // Add any additional logic you need here
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: "",
      status: "",
    },
    validationSchema: Yup.object({
      id: Yup.string().required("Please Select Order No."),
      status: Yup.string().required("Please Select Status."),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.put(
          API_SUBSCRIPTION_REQUEST_TO_CANCEL_GET_PUT,
          values,
          config
        );
        viewCancelRequestToggle();
        toast.success(`Order Canceled Successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        console.error("error", error);

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

  const getHubList = async () => {
    const { data } = await axios.get(API_HUB_ADD_GET, config);
    console.log(data.data);
    setHubListData(data.data);
  };
  const getviewCancelRequestData = async () => {
    const { data } = await axios.get(
      API_SUBSCRIPTION_REQUEST_TO_CANCEL_GET_PUT,
      config
    );
    console.log(data.data);
    setviewCancelRequestData(data);
  };

  const exportValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: "",
      from_date: "",
      to_date: "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Please Select Status."),
      from_date: Yup.string().when(["status"], {
        is: (val) => val === "Expired",
        then: () => Yup.string().required("Interview link is required"),
        otherwise: () => Yup.string(),
      }),

      to_date: Yup.string().when(["status"], {
        is: (val) => val === "Expired",
        then: () => Yup.string().required("Interview link is required"),
        otherwise: () => Yup.string(),
      }),
    }),
    onSubmit: async (values) => {
      console.log("values", values);

      try {
        const response = await axios.get(
          `${API_SUBSCRIPTION_EXCEL_DOWNLOAD}${selectedStatus}&from_date=${values?.from_date}&to_date=${values?.to_date}`,
          config,
          {
            responseType: "blob",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const blob = new Blob([response.data], { type: "application/csv" });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "cartOrderSales_Report.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.log("Error downloading file:", error);
      }
    },
  });

  useEffect(() => {
    getHubList();
  }, [subscriptionOrderData]);

  useEffect(() => {
    getviewCancelRequestData(pagePending, pageSizePending);
  }, [pagePending,  pageSizePending,]);

  return (
    <>
      <Col xl={12}>
        <Card style={{ marginTop: "100px" }}>
          <CardBody className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="me-3">Subscription Orders</h3>
            </div>
            <div className="d-flex align-items-center">
              <div className="me-3">
                <Link to="/subscription-orders-add">
                  <Button color="primary me-1">Create</Button>
                </Link>
              </div>
              <div className="me-3">
                <Button
                  color="primary"
                  onClick={() => {
                    exportFileToggle();
                  }}
                >
                  Export
                </Button>
              </div>
              <div className="me-3">
                <label htmlFor="datepickerFrom" className="form-label">
                  Orders From
                </label>
                <Flatpickr
                  id="datepickerFrom"
                  value={selectedDateFrom}
                  placeholder="dd-mm-yy"
                  onChange={(dates) => {
                    const selectedDate = dates[0];
                    setSelectedDateFrom(selectedDate);
                  }}
                  options={{
                    dateFormat: "d-m-Y",
                  }}
                  className="form-control"
                />
              </div>
              <div className="me-3">
                <label htmlFor="datepickerTo" className="form-label">
                  Orders To
                </label>
                {selectedDateFrom ? (
                  <Flatpickr
                    id="datepickerTo"
                    value={selectedDateTo}
                    placeholder="dd-mm-yy"
                    onChange={(dates) => {
                      const selectedDate = dates[0];
                      setSelectedDateTo(selectedDate);
                    }}
                    options={{
                      dateFormat: "d-m-Y",
                    }}
                    className="form-control"
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="dd-mm-yy"
                    disabled
                  />
                )}
              </div>
              <div className="me-3">
                <Label htmlFor="formrow-email-Input">Select HUB</Label>
                <Input
                  type="select"
                  className="form-control"
                  id="formrow-email-Input"
                  placeholder=""
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                >
                  <option value="">Select HUB</option>
                  {hubListData &&
                    hubListData?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </Input>
              </div>
              <div className="">
                <Label htmlFor="formrow-email-Input">
                  Search Customer/Orders
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="formrow-email-Input"
                  placeholder="Search Customer/Orders"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <div className="">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Nav tabs className="nav-tabs-custom nav-justified">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "new", // new
                        })}
                        onClick={() => {
                          toggleCustom("new");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">New </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "active", // Active
                        })}
                        onClick={() => {
                          toggleCustom("active");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-user"></i>
                        </span>
                        <span className="d-none d-sm-block">Active</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "renewal", // Renewal
                        })}
                        onClick={() => {
                          toggleCustom("renewal");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-envelope"></i>
                        </span>
                        <span className="d-none d-sm-block">Renewal</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "expired", // Expired
                        })}
                        onClick={() => {
                          toggleCustom("expired");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-cog"></i>
                        </span>
                        <span className="d-none d-sm-block">Expired</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "paused", //Paused
                        })}
                        onClick={() => {
                          toggleCustom("paused");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-cog"></i>
                        </span>
                        <span className="d-none d-sm-block">Paused</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "cancelled", //Cancelled
                        })}
                        onClick={() => {
                          toggleCustom("cancelled");
                          getCancelSubscriptionOrderData();
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-cog"></i>
                        </span>
                        <span className="d-none d-sm-block">Cancelled</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "upcoming", //Upcomming
                        })}
                        onClick={() => {
                          toggleCustom("upcoming");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-cog"></i>
                        </span>
                        <span className="d-none d-sm-block">Upcomming</span>
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent
                    activeTab={customActiveTab}
                    className="p-3 text-muted"
                  >
                    <TabPane tabId="new">
                      <Row>
                        <Col sm="12">
                          <Card>
                            <CardBody>
                              <div className="table-responsive">
                                <Table className="table mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Order No.</th>
                                      <th>Customer</th>
                                      <th>Area</th>
                                      <th>Plan Duration </th>
                                      <th>Ordered On</th>
                                      <th>Payment Method</th>
                                      <th>Customer Status</th>
                                      <th>Created By</th>
                                    </tr>
                                  </thead>

                                  <tbody className="">
                                    {subscriptionOrderData &&
                                      subscriptionOrderData
                                        ?.filter(
                                          (item) => item.order_status === "New"
                                        )
                                        .map((item, index) => (
                                          <tr key={index}>
                                            <td>
                                              <Link
                                                to={`/subscription-orders-view/${item.order_id}`}
                                              >
                                                {item.order_id}
                                              </Link>
                                            </td>
                                            <td>
                                              {item.customer.first_name}{" "}
                                              {item.customer.last_name} <br />
                                              {item.customer.contact_no}
                                            </td>
                                            <td>{item.area_name}</td>
                                            <td>
                                              {item.subscription_duration} Days{" "}
                                              <br />
                                              {item.delivery_frequency}
                                            </td>
                                            <td>
                                              {item.created_at !== null
                                                ? format(
                                                    new Date(item.created_at),
                                                    "dd-MM-yyyy"
                                                  )
                                                : "---"}
                                            </td>
                                            <td>{item.payment_mode}</td>
                                            <td>
                                              {item?.customer
                                                ?.customer_status === "New" ? (
                                                <Badge
                                                  pill
                                                  className="badge-soft-primary font-size-12 px-4 py-1"
                                                >
                                                  New
                                                </Badge>
                                              ) : item?.customer
                                                  ?.customer_status ===
                                                "Active" ? (
                                                <Badge
                                                  pill
                                                  className="badge-soft-success font-size-12 px-4 py-1"
                                                >
                                                  Active
                                                </Badge>
                                              ) : item?.customer
                                                  ?.customer_status ===
                                                "Approved" ? (
                                                <Badge
                                                  pill
                                                  className="badge-soft-info font-size-12 px-4 py-1"
                                                >
                                                  Approved
                                                </Badge>
                                              ) :item?.customer
                                              ?.customer_status ===
                                            "Scheduling" ? (
                                            <Badge
                                              pill
                                              className="badge-soft-warning font-size-12 px-4 py-1"
                                            >
                                              Scheduling
                                            </Badge>
                                          ) : null}
                                            </td>
                                            <td>{item.created_by}</td>
                                          </tr>
                                        ))}
                                  </tbody>
                                </Table>
                              </div>
                            </CardBody>
                            <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={subscriptionOrderData?.length}
                                  rowsPerPage={pageSizePending}
                                  page={pagePending}
                                  onPageChange={(event, newPage) =>
                                    setPagePending(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSizePending(+event.target.value);
                                    setPagePending(0);
                                  }}
                                />
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="active">
                      <Row>
                        <Col sm="12">
                          <Card>
                            <CardBody>
                              <div className="table-responsive">
                                <Table className="table mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Order No.</th>
                                      <th>Customer</th>
                                      <th>Area</th>
                                      <th>Plan Duration </th>
                                      <th>Start Date</th>
                                      <th>Delivered Qty</th>
                                      <th>Current Ballance ( INR )</th>
                                      <th>Created By</th>
                                    </tr>
                                  </thead>

                                  <tbody className="">
                                    {subscriptionOrderData
                                      ?.filter(
                                        (item) => item.order_status === "Active"
                                      )
                                      .map((item, index) => (
                                        <tr key={index}>
                                          <td>
                                            <Link
                                              to={`/subscription-orders-view/${item.order_id}`}
                                            >
                                              {item.order_id}
                                            </Link>
                                          </td>
                                          <td>
                                            {item.customer.first_name}{" "}
                                            {item.customer.last_name} <br />
                                            {item.customer.contact_no}
                                          </td>
                                          <td>{item.area_name}</td>
                                          <td>
                                            {item.subscription_duration} Days{" "}
                                            <br />
                                            {item.delivery_frequency}
                                          </td>
                                          <td>
                                            {item?.activated_on !== null
                                              ? format(
                                                  new Date(item.activated_on),
                                                  "dd-MM-yyyy"
                                                )
                                              : "---"}
                                          </td>
                                          <td>{item?.delivered_qty} </td>
                                          <td>
                                            {item.wallet_amount === null
                                              ? "₹00.00"
                                              : `₹${item.wallet_amount}`}
                                          </td>
                                          <td>{item?.created_by}</td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </Table>
                              </div>
                            </CardBody>
                            <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={subscriptionOrderData?.length}
                                  rowsPerPage={pageSizePending}
                                  page={pagePending}
                                  onPageChange={(event, newPage) =>
                                    setPagePending(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSizePending(+event.target.value);
                                    setPagePending(0);
                                  }}
                                />
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="renewal">
                      <Row>
                        <Card>
                          <CardBody>
                            <div className="table-responsive">
                              <Table className="table mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th>Order No.</th>
                                    <th>Customer</th>
                                    <th>Area</th>
                                    <th>Plan Duration </th>
                                    <th>Estimated Renewal</th>
                                    <th>Deliverd Qty</th>
                                    <th>Current Wallet Ballance ( INR )</th>
                                    <th>Created By</th>
                                  </tr>
                                </thead>

                                <tbody className="">
                                  {subscriptionOrderData?.map((item, index) => (
                                    <tr key={index}>
                                      <th>
                                        <Link
                                          to={`/subscription-orders-view/${item.order_id}`}
                                        >
                                          {item.order_id}
                                        </Link>
                                      </th>
                                      <td>
                                        {item.customer.first_name}{" "}
                                        {item.customer.last_name} <br />
                                        {item.customer.contact_no}
                                      </td>
                                      <td>{item.area_name}</td>
                                      <td>
                                        {item.subscription_duration} Days <br />
                                        {item.delivery_frequency}
                                      </td>
                                      <td>
                                        {item.delivery_end_date !== null
                                          ? format(
                                              new Date(item.delivery_end_date),
                                              "dd-MM-yyyy"
                                            )
                                          : "---"}
                                      </td>
                                      <td>{item.delivered_qty}</td>
                                      <td>
                                        {item.wallet_amount === null
                                          ? "₹00.00"
                                          : `₹${item.wallet_amount}`}
                                      </td>
                                      <td>{item.created_by}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </CardBody>
                          <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={subscriptionOrderData?.length}
                                  rowsPerPage={pageSizePending}
                                  page={pagePending}
                                  onPageChange={(event, newPage) =>
                                    setPagePending(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSizePending(+event.target.value);
                                    setPagePending(0);
                                  }}
                                />
                        </Card>
                      </Row>
                    </TabPane>
                    <TabPane tabId="expired">
                      <Row>
                        <Col sm="12">
                          <Card>
                            <CardBody>
                              <div className="table-responsive">
                                <Table className="table mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Order No.</th>
                                      <th>Customer</th>
                                      <th>Area</th>
                                      <th>Plan Duration </th>
                                      <th>Expired On</th>
                                      <th>Delivered Qty</th>
                                      <th> Ballance After Expiry ( INR )</th>
                                      <th>Refund</th>
                                      <th>Created By</th>
                                    </tr>
                                  </thead>

                                  <tbody className="">
                                    {subscriptionOrderData
                                      ?.filter(
                                        (item) =>
                                          item.order_status === "Expired"
                                      )
                                      .map((item, index) => (
                                        <tr key={index}>
                                          <td>
                                            <Link
                                              to={`/subscription-orders-view/${item.order_id}`}
                                            >
                                              {item.order_id}
                                            </Link>
                                          </td>
                                          <td>
                                            {item.customer.first_name}{" "}
                                            {item.customer.last_name} <br />
                                            {item.customer.contact_no}
                                          </td>
                                          <td>{item.area_name}</td>
                                          <td>
                                            {item.subscription_duration} Days{" "}
                                            <br />
                                            {item.delivery_frequency}
                                          </td>
                                          <td>
                                            {item.expired_at !== null
                                              ? format(
                                                  new Date(item.expired_at),
                                                  "dd-MM-yyyy"
                                                )
                                              : "---"}
                                          </td>
                                          <td>{item?.delivered_qty}</td>
                                          <td>
                                            {item.wallet_amount === null
                                              ? "₹00.00"
                                              : `₹${item.wallet_amount}`}
                                          </td>
                                          <td>{item.refund_amount}</td>
                                          <td>{item.created_by}</td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </Table>
                              </div>
                            </CardBody>
                            <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={subscriptionOrderData?.length}
                                  rowsPerPage={pageSizePending}
                                  page={pagePending}
                                  onPageChange={(event, newPage) =>
                                    setPagePending(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSizePending(+event.target.value);
                                    setPagePending(0);
                                  }}
                                />
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="paused">
                      <Row>
                        <Card>
                          <CardBody>
                            <div className="table-responsive">
                              <Table className="table mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th>Order No.</th>
                                    <th>Customer</th>
                                    <th>Area</th>
                                    <th>Plan Duration </th>
                                    <th>Paused Duration</th>
                                    <th>Delivered Qty</th>
                                    <th>Last Wallet Ballance ( INR )</th>
                                    <th>Created By</th>
                                  </tr>
                                </thead>
                                <tbody className="">
                                  {subscriptionOrderData
                                    ?.filter(
                                      (item) => item.order_status === "Paused"
                                    )
                                    .map((item, index) => (
                                      <tr key={index}>
                                        <td>
                                          <Link
                                            to={`/subscription-orders-view/${item.order_id}`}
                                          >
                                            {item.order_id}
                                          </Link>
                                        </td>
                                        <td>
                                          {item.customer.first_name}{" "}
                                          {item.customer.last_name} <br />
                                          {item.customer.contact_no}
                                        </td>
                                        <td>{item.area_name}</td>
                                        <td>
                                          {item.subscription_duration} Days{" "}
                                          <br />
                                          <p>{item.delivery_frequency}</p>
                                        </td>
                                        <td>
                                          {item.pause_from} To
                                          {item.pause_to}
                                        </td>
                                        <td>{item?.delivered_qty} </td>
                                        <td>
                                          {item.wallet_amount === null
                                            ? "₹00.00"
                                            : `₹${item.wallet_amount}`}
                                        </td>
                                        <td>{item.created_by}</td>
                                      </tr>
                                    ))}
                                </tbody>
                              </Table>
                            </div>
                          </CardBody>
                          <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={subscriptionOrderData?.length}
                                  rowsPerPage={pageSizePending}
                                  page={pagePending}
                                  onPageChange={(event, newPage) =>
                                    setPagePending(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSizePending(+event.target.value);
                                    setPagePending(0);
                                  }}
                                />
                        </Card>
                      </Row>
                    </TabPane>
                    <TabPane tabId="cancelled">
                      <Row>
                        <div>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              viewCancelRequestToggle();
                            }}
                          >
                            Request to cancel order
                            <Badge className="bg-success ms-2 px-2 fs-6">
                              {viewCancelRequestData.length}
                            </Badge>
                          </button>
                        </div>
                        <Card>
                          <CardBody>
                            <div className="table-responsive">
                              <Table className="table mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th>Order No.</th>
                                    <th>Customer</th>
                                    <th>Area</th>
                                    <th>Plan Duration </th>
                                    <th>Cancelled On</th>
                                    <th>Delivered Qty.</th>
                                    <th>Request Status</th>
                                    <th>Refund</th>
                                    <th>Created By</th>
                                  </tr>
                                </thead>

                                <tbody className="">
                                  {subscriptionCancelData.map((item, index) => (
                                    <tr key={index}>
                                      <th>
                                        <Link
                                          to={`/subscription-orders-view/${item?.order?.order_id}`}
                                        >
                                          {item?.order?.order_id}
                                        </Link>
                                      </th>
                                      <td>
                                        {item?.order?.customer?.first_name}{" "}
                                        {item?.order?.customer?.last_name}{" "}
                                        <br />
                                        {item?.order?.customer?.contact_no}
                                      </td>
                                      <td>{item?.order?.area_name}</td>
                                      <td>
                                        {item?.order?.subscription_duration}{" "}
                                        Days <br />
                                        {item?.order?.delivery_frequency}
                                      </td>

                                      <td>
                                        {item.cancelled_on !== null
                                          ? format(
                                              new Date(item.cancelled_on),
                                              "dd-MM-yyyy"
                                            )
                                          : "---"}
                                      </td>
                                      <td>{item?.order?.delivered_qty}</td>
                                      <td>{item?.current_status}</td>
                                      <td>
                                        {item?.refund_completed === null ? (
                                          "-"
                                        ) : item?.refund_completed === true ? (
                                          <>
                                            <Link
                                              to={`/cart-orders-view/${item.order_id}`}
                                            >
                                              <span className="fas fa-check-circle text-success fs-4"></span>
                                            </Link>
                                          </>
                                        ) : (
                                          <>
                                            <Link
                                              to={`/cart-orders-view/${item.order_id}`}
                                            >
                                              <span className="far fa-money-bill-alt fs-4 text-primary"></span>
                                            </Link>
                                          </>
                                        )}
                                      </td>
                                      <td>{item?.created_by}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </CardBody>
                          <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={subscriptionOrderData?.length}
                                  rowsPerPage={pageSizePending}
                                  page={pagePending}
                                  onPageChange={(event, newPage) =>
                                    setPagePending(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSizePending(+event.target.value);
                                    setPagePending(0);
                                  }}
                                />
                        </Card>
                      </Row>
                    </TabPane>
                    <TabPane tabId="upcoming">
                      <Row>
                        <Card>
                          <CardBody>
                            <div className="table-responsive">
                              <Table className="table mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th>Order No.</th>
                                    <th>Customer</th>
                                    <th>Area</th>
                                    <th>Plan Duration </th>
                                    <th>Renewed On</th>
                                    <th>Payment Status</th>
                                    <th>Created By</th>
                                  </tr>
                                </thead>

                                <tbody className="">
                                  {subscriptionOrderData
                                    ?.filter(
                                      (item) => item.order_status === "Upcoming"
                                    )
                                    .map((item, index) => (
                                      <tr key={index}>
                                        <td>
                                          <Link
                                            to={`/subscription-orders-view/${item.order_id}`}
                                          >
                                            {item.order_id}
                                          </Link>
                                        </td>
                                        <td>
                                          {item.customer.first_name}{" "}
                                          {item.customer.last_name} <br />
                                          {item.customer.contact_no}
                                        </td>
                                        <td>{item.area_name}</td>
                                        <td>
                                          {item.subscription_duration} Days{" "}
                                          <br />
                                          {item.delivery_frequency}
                                        </td>
                                        <td>
                                          {item.created_at !== null
                                            ? format(
                                                new Date(item.created_at),
                                                "dd-MM-yyyy"
                                              )
                                            : "---"}
                                        </td>
                                        <td>
                                          <td>{item.payment_mode}</td>{" "}
                                        </td>

                                        <td>{item.created_by}</td>
                                      </tr>
                                    ))}
                                </tbody>
                              </Table>
                            </div>
                          </CardBody>
                          <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={subscriptionOrderData?.length}
                                  rowsPerPage={pageSizePending}
                                  page={pagePending}
                                  onPageChange={(event, newPage) =>
                                    setPagePending(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSizePending(+event.target.value);
                                    setPagePending(0);
                                  }}
                                />
                        </Card>
                      </Row>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Request to cancel order modal start */}

      <Modal
        isOpen={viewCancelRequestModal}
        toggle={() => {
          viewCancelRequestToggle();
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Request Details</h5>
          <button
            type="button"
            onClick={() => {
              setviewCancelRequestModal(false);
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
            <Form
              className="needs-validation"
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
              <Row>
                <Col md="12" className="border-bottom">
                  <FormGroup className="mb-3 ">
                    <Label htmlFor="validationCustom01">Order No.</Label>
                    <Input
                      name="id"
                      placeholder=" Order No"
                      type="select"
                      className="form-control"
                      id="validationCustom01"
                      onChange={(e) => {
                        validation.handleChange(e);
                        const selectedOrderId = e.target.value;
                        const selectedData = viewCancelRequestData.find(
                          (item) => String(item.id) === selectedOrderId
                        );
                        setSelectedOrderData(selectedData || null);
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.id || ""}
                      invalid={
                        validation.touched.id && validation.errors.id
                          ? true
                          : false
                      }
                    >
                      <option value="">Select Option</option>
                      {viewCancelRequestData.map((item, index) => (
                        <option value={item.id} key={index}>
                          {item?.order?.order_id}
                        </option>
                      ))}
                    </Input>

                    {validation.touched.id && validation.errors.id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.id}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>

                {selectedOrderData !== null && (
                  <Col className="py-3">
                    <div className="d-flex flex-column">
                      <p className="d-flex ">
                        <span className="me-3 w-50">Cancel Reason</span>
                        <span className="w-50">
                          <b> {selectedOrderData?.cancel_reason}</b>
                        </span>
                      </p>
                      <p className="d-flex">
                        <span className="me-3 w-50">Customer</span>
                        <span className="w-50">
                          <b> {selectedOrderData?.customer_name}</b>
                        </span>
                      </p>
                      <p className="d-flex">
                        <span className="me-3 w-50">Description</span>
                        <span className="w-50">
                          <b> {selectedOrderData?.description}</b>
                        </span>
                      </p>
                      <p className="d-flex">
                        <span className="me-3 w-50">Ordered placed on</span>
                        <span className="w-50">
                          <b>
                            {" "}
                            {selectedOrderData?.order?.created_at !== null
                              ? format(
                                  new Date(
                                    selectedOrderData?.order?.created_at
                                  ),
                                  "dd-MM-yyyy"
                                )
                              : "---"}
                          </b>
                        </span>
                      </p>
                      <p className="d-flex">
                        <span className="me-3 w-50">Current Status</span>
                        <span className=" w-50">
                          <b> {selectedOrderData?.current_status}</b>
                        </span>
                      </p>
                      <p className="d-flex">
                        <span className="me-3 w-50 ">
                          Current Wallet Balance
                        </span>
                        <span className=" w-50">
                          <b> {selectedOrderData?.wallet_amount}</b>
                        </span>
                      </p>
                    </div>
                  </Col>
                )}

                {selectedOrderData !== null && (
                  <Col md="12" className="border-top pt-2">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom02">Action :</Label>
                      <Input
                        name="status"
                        placeholder="Last name"
                        type="select"
                        className="form-control"
                        id="validationCustom02"
                        onChange={(e) => {
                          validation.handleChange(e);
                          handleStatusChange(e.target.value);
                        }}
                        onBlur={validation.handleBlur}
                        value={validation.values.status || ""}
                        invalid={
                          validation.touched.status && validation.errors.status
                            ? true
                            : false
                        }
                      >
                        <option value="" disabled>
                          Select Option
                        </option>
                        {orderCancelRequest.map((item) => (
                          <option value={item.key} key={item.key}>
                            {item.value}
                          </option>
                        ))}
                      </Input>
                      {validation.touched.status && validation.errors.status ? (
                        <FormFeedback type="invalid">
                          {validation.errors.status}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                )}
              </Row>

              <Row>
                <div className="text-center">
                  <Button color="primary" type="submit">
                    Submit form
                  </Button>
                  <Button color="danger" className="ms-2">
                    Cancel
                  </Button>
                </div>
              </Row>
            </Form>
          </Col>
        </div>
      </Modal>

      {/* Request to cancel order modal End */}

      {/* Confirmation Cancel Orde Start  */}

      <Modal
        isOpen={confirmCancelModal}
        toggle={() => confirmCancelToggle()}
        centered
      >
        {/* Your modal content goes here */}
        <div className="modal-header">
          <h5 className="modal-title mt-0">Confirmation</h5>
          <button
            type="button"
            onClick={() => confirmCancelToggle()}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <h5 className="text-primary">
            Are you sure want to cancel this order ?
          </h5>

          <div className="text-center mt-3">
            <Button
              color="primary"
              className="px-4"
              onClick={() => confirmCancelToggle()}
            >
              Yes
            </Button>
            <Button
              color="danger"
              className="ms-2 px-4"
              onClick={handleNoButtonClick}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Cancel Orde End */}

      {/* Export File Modal Start */}

      <Modal
        className="w-100"
        isOpen={exportFileModal}
        toggle={() => {
          exportFileToggle();
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0"></h5>
          <button
            type="button"
            onClick={() => {
              setexportFileModal(false);
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
            className="needs-validation w-100"
            onSubmit={(e) => {
              e.preventDefault();
              exportValidation.handleSubmit();
              return false;
            }}
          >
            <Row>
              <Col md="12">
                <FormGroup className="mb-3">
                  <Label htmlFor="exportValidation">Status</Label>
                  <Input
                    name="status"
                    placeholder="Select Status"
                    type="select"
                    className="form-control"
                    id="exportValidation"
                    onChange={(e) => {
                      // Update the selected status in the state
                      setSelectedStatus(e.target.value);
                      exportValidation.handleChange(e);
                      // Add any additional logic based on the selected status
                    }}
                    onBlur={exportValidation.handleBlur}
                    value={selectedStatus}
                    invalid={
                      exportValidation.touched.status &&
                      exportValidation.errors.status
                    }
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    {exportStatusArray?.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.value}
                      </option>
                    ))}
                  </Input>
                  {exportValidation.touched.status &&
                    exportValidation.errors.status && (
                      <FormFeedback type="invalid">
                        {exportValidation.errors.status}
                      </FormFeedback>
                    )}
                </FormGroup>
              </Col>
            </Row>

            {exportValidation?.values?.status === "Expired" ? (
              <Row>
                <Col md="6">
                  <div className="mb-3">
                    <label htmlFor="from_date" className="form-label">
                      From Date *
                    </label>
                    <Flatpickr
                      id="from_date"
                      name="from_date"
                      placeholder="dd-mm-yyyy"
                      className={`form-control ${
                        exportValidation.touched.from_date &&
                        exportValidation.errors.from_date
                          ? "is-invalid"
                          : ""
                      }`}
                      value={exportValidation.values.from_date}
                      onChange={(date) => {
                        const formattedDate = format(date[0], "yyyy-MM-dd");
                        exportValidation.setFieldValue(
                          "from_date",
                          formattedDate
                        );
                      }}
                      options={{
                        dateFormat: "Y-m-d",
                        maxDate: new Date().toISOString().split("T")[0],
                      }}
                    />
                    {exportValidation.touched.from_date &&
                      exportValidation.errors.from_date && (
                        <div className="invalid-feedback">
                          {exportValidation.errors.from_date}
                        </div>
                      )}
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <label htmlFor="to_date" className="form-label">
                      To Date *
                    </label>
                    <Flatpickr
                      id="to_date"
                      name="to_date"
                      placeholder="dd-mm-yyyy"
                      className={`form-control ${
                        exportValidation.touched.to_date &&
                        exportValidation.errors.to_date
                          ? "is-invalid"
                          : ""
                      }`}
                      value={exportValidation.values.to_date}
                      onChange={(date) => {
                        const formattedDate = format(date[0], "yyyy-MM-dd");
                        exportValidation.setFieldValue(
                          "to_date",
                          formattedDate
                        );
                      }}
                      options={{
                        dateFormat: "Y-m-d",
                        maxDate: new Date().toISOString().split("T")[0],
                      }}
                    />

                    {exportValidation.touched.to_date &&
                      exportValidation.errors.to_date && (
                        <div className="invalid-feedback">
                          {exportValidation.errors.to_date}
                        </div>
                      )}
                  </div>
                </Col>
              </Row>
            ) : (
              ""
            )}

            <Row>
              <Col xl="12" className="text-center mt-4">
                <Button color="primary" type="submit" className="px-4">
                  Submit form
                </Button>
                <Button
                  color="danger"
                  className="ms-2 px-4"
                  onClick={() => {
                    setexportFileModal(false);
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>

      {/* Export File Modal End */}
    </>
  );
}

export default SubscriptionOrders;

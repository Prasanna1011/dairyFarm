import React, { useState, useRef, useEffect } from "react";
import qs from "qs";
import { Link, useParams } from "react-router-dom";
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
  Table,
  Modal,
  CardTitle,
  CardText,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  UncontrolledCollapse,
} from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import classnames from "classnames";
import { TablePagination } from "@mui/material";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_DELIVERY_BOYS_POST_GET,
  API_HUB_GET_BY_ID_AND_UPDATE,
  API_HUB_GET_BY_ID_AND_UPDATE_NEW,
  API_HUB_MANAGE_TASK_GET,
  API_HUB_MANAGE_TASK_GET_BY_HUB,
  API_HUB_MANAGE_TASK_GET_BY_TASK_NO,
  API_HUB_MANAGE_TASK_TASK_ASSIGN,
  API_HUB_MANAGE_TASK_TASK_UNASSIGN,
  API_HUB_TRANSFER_DELIVERY_TO_OTHER_DELIVERY_BOY,
  API_HUB_WISE_ALLOCATED_DELIVERIES,
  API_HUB_WISE_DELIVERYBOY_DELIVERIES_GET,
} from "customhooks/All_Api/Apis";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { format } from "date-fns";
import { toast } from "react-toastify";
const HubDetails = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [hubData, setHubData] = useState([]);
  const [allocatedDeliveries, setAllocatedDeliveries] = useState([]);
  const [modal_fullscreen, setmodal_fullscreen] = useState(false);
  const [hudDetailsModalPopup, sethudDetailsModalPopup] = useState(false);
  const [allDeliveryBoys, setAllDeliveryBoys] = useState([]);
  const [manageTaskData, setManageTaskData] = useState([]);
  const [manageTaskByHubData, setManageTaskByHubData] = useState([]);
  const [hubDataNew, setHubDataNew] = useState([]);
  const [deAllocateTaskByIdForPopupDataTicket, setDeAllocateTaskByIdForPopupDataTicket] = useState([]);
  const [assignTaskByIdForPopupData, setAssignTaskByIdForPopupData] = useState(
    []
  );

  const [error, setError] = useState(null);
  const [TaskDetailByTaskNo, setTaskDetailByTaskNo] = useState([]);

  const [
    allocatedDeliveriesByIDOfDeliveryBoy,
    setAllocatedDeliveriesByIDOfDeliveryBoy,
  ] = useState([]);

  const [transfroDeliveryModal, settransfroDeliveryModal] = useState(false);
  const [selectedAllocatedDeliveryItem, setSelectedAllocatedDeliveryItem] =
    useState([]);
  const [
    deliveryBoyDeliveriesByIDWithHUBId,
    setDeliveryBoyDeliveriesByIDWithHUBId,
  ] = useState([]);

  const [selectedTransferType, setSelectedTransferType] = useState("");

  const [assignModal, setassignModal] = useState(false);

  const [page1, setPage1] = useState(0); // Pagination state for first tab
  const [pageSize1, setPageSize1] = useState(5);
  const [totalPages1, setTotalPages1] = useState(0);
  const [page2, setPage2] = useState(0); // Pagination state for second tab
  const [pageSize2, setPageSize2] = useState(5);


  const [deAllocateTaskModal, setdeAllocateTaskModal] = useState(false);
  const [taskDetailbTaskNoModal, settaskDetailbTaskNoModal] = useState(false);

  function tog_taskDetailByTaskNo() {
    settaskDetailbTaskNoModal(!taskDetailbTaskNoModal);
  }

  function assignModalTogle() {
    setassignModal(!assignModal);
  }
  function toggleDeallocate() {
    setdeAllocateTaskModal(!deAllocateTaskModal);
  }

  const { id } = useParams();
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  //   popup Start
  function tog_hubData() {
    sethudDetailsModalPopup(!hudDetailsModalPopup);
  }
  function transferDeliveryPopupToggle() {
    settransfroDeliveryModal(!transfroDeliveryModal);
  }
  //   popup End

  const [customActiveTab, setcustomActiveTab] = useState("1");

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    // const searchData = deliveryBoysData.filter((item) => {
    //   // const searchString = `${item.city} ${item.activated_on}   ${item.deactivated_on}`; // Add more properties as needed
    //   return searchString.toLowerCase().includes(searchQuery.toLowerCase());
    // });
    // setFilteredData(searchData);
  };

  // Search Filter End
  // Pagenation Start
  // Pagenation Start

  // Function to handle page change for the first tab
  const handleChangePage1 = (event, newPage) => {
    setPage1(newPage);
  };

  // Function to handle page change for the second tab
  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  // Function to handle rows per page change for the first tab
  const handleChangeRowsPerPage1 = (event) => {
    setPageSize1(+event.target.value);
    setPage1(0); // Reset page to 0 when changing rows per page
  };

  // Function to handle rows per page change for the second tab
  const handleChangeRowsPerPage2 = (event) => {
    setPageSize2(+event.target.value);
    setPage2(0); // Reset page to 0 when changing rows per page
  };

  // Pagenation End
  // Pagenation End

  // get data of manage task start
  const getManageTaskData = async () => {
    try {
      const { data } = await axios.get(`${API_HUB_MANAGE_TASK_GET}`, {
        ...config,
        params: {
          page: page1 + 1,
          page_size: pageSize1,
        },
      });
      setManageTaskData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log("manageTaskData", manageTaskData);
  // get data of manage task end

  // get data of manage task by HUB Id start
  const getManageTaskByHubData = async () => {
    try {
      const { data } = await axios.get(
        `${API_HUB_MANAGE_TASK_GET_BY_HUB}${id}&status=`,
        {
          ...config,
          params: {
            page: page2 + 1, // Increment page by 1 to match 1-indexed API pages
            page_size: pageSize2,
          },
        }
      );
      setManageTaskByHubData(data);
    } catch (error) {
      console.error("Error fetching manage task data by HUB:", error);
    }
  };

  console.log("manageTaskData", manageTaskData);
  // get data of manage task end

  //   Fetch Data ById of HUB  Start
  const FetchHubByIdtData = async () => {
    try {
      const { data } = await axios.get(
        `${API_HUB_GET_BY_ID_AND_UPDATE}${id}`,
        config
      );
      FetchHubByIdForAllocatedDeliveriestData();
      setHubData(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const FetchHubByIdtDataNew = async () => {
    try {
      const { data } = await axios.get(
        `${API_HUB_GET_BY_ID_AND_UPDATE_NEW}${id}`,
        config
      );
      FetchHubByIdForAllocatedDeliveriestData();
      setHubDataNew(data);
      console.log("dataaaaaaaaaaaaa", data);
    } catch (error) {
      console.log(error);
    }
  };

  //   Fetch Data ById of HUB  End

  //   Fetch Data ById of HUB  Start
  const FetchHubByIdForAllocatedDeliveriestData = async () => {
    try {
      const { data } = await axios.get(
        `${API_HUB_WISE_ALLOCATED_DELIVERIES}${id}`,
        config
      );
      setAllocatedDeliveries(data);
      console.log("setAllocatedDeliveries", data);
    } catch (error) {
      console.log(error);
    }
  };
  //   Fetch Data ById of HUB  Start
  const getAssignTaskByIdForPopupData = async (taskId) => {
    try {
      const { data } = await axios.get(
        `${API_HUB_MANAGE_TASK_TASK_ASSIGN}${taskId}`,
        config
      );
      console.log("API_HUB_MANAGE_TASK_TASK_ASSIGN", data);
      setAssignTaskByIdForPopupData(data);
    } catch (error) {
      console.log(error);
    }
  };

  //   Fetch Data ById of HUB  End

  //   Fetch Deliveryboy Delivery Orders Start

  function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const todayFormatted = getFormattedDate();

  //   Fetch Data ById of HUB  End

  //   Fetch All Delivery Boys Start
  const FetcAllDeliveryBoys = async () => {
    try {
      const { data } = await axios.get(`${API_DELIVERY_BOYS_POST_GET}`, config);
      setAllDeliveryBoys(data.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  //    Fetch All Delivery Boys End
  const getTaskByTaskNo = async (taskNo) => {
    try {
      const { data } = await axios.get(`${API_HUB_MANAGE_TASK_GET_BY_TASK_NO}${taskNo}`, config)
      setTaskDetailByTaskNo(data.data)

    } catch (error) {

    }
  }

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      transfer_type: "",
      from_date: "",
      to_date: "",
      shareOrderTo: "",
    },
    validationSchema: Yup.object({
      transfer_type: Yup.string()
        .oneOf(["Temporary", "Permanently"], "Please select Permanently Status")
        .required("Share Orders is required"),
      from_date: Yup.date()
        .min(new Date(), "Only Future date is allowed.")
        .required(" Transfer from date is required"),
      to_date: Yup.date().min(new Date(), "Only Future date is allowed."),
      shareOrderTo: Yup.string().required("Please Select Delivery Boy"),
    }),

    onSubmit: async (values) => {
      // Assuming you have selectedData and other necessary values in state
      const selectedOrders = selectedData.map((item) => item.order_id);

      // Create the data object in the required format
      const postData = {
        transfer_type: values?.transfer_type,
        from_date: values?.from_date,
        to_date: values?.to_date,
        orders: selectedOrders,
        from_delivery_boy:
          selectedAllocatedDeliveryItem?.delivery_boy?.delivery_boy_id, // Replace this with the actual value
        to_delivery_boy: values?.shareOrderTo,
      };

      try {
        // Now you can send the postData to your API using axios or any other method
        const response = await axios.post(
          API_HUB_TRANSFER_DELIVERY_TO_OTHER_DELIVERY_BOY,
          postData,
          config
        );
        transferDeliveryPopupToggle();
        toast.success(`Delivery Transfered successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        // Handle the response as needed
        console.log("Response:", response.data);
      } catch (error) {
        toast.error(error, {
          position: "top-center",
          autoClose: 4000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });

  // task Assign Validation Start
  // Form validation
  const taskAssignvalidation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      assign_to: "",
      task_id: assignTaskByIdForPopupData?.data?.task_id || "",
    },
    validationSchema: Yup.object({
      assign_to: Yup.string().required(
        "Please Select Delivery Assistant is required."
      ),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.put(
          `${API_HUB_MANAGE_TASK_TASK_ASSIGN}${assignTaskByIdForPopupData?.data?.task_id}`,
          values,
          config
        );
        toast.success(`Task Assigned successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        getManageTaskByHubData();
        assignModalTogle();
      } catch (error) {
        console.log(error);
        toast.error(`Something went Weong`, {
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
    FetchHubByIdtData();
    FetchHubByIdForAllocatedDeliveriestData();
    FetcAllDeliveryBoys();
    getManageTaskData();
    // getManageTaskByHubData();
    FetchHubByIdtDataNew();
  }, []);

  // console.log("selectedAllocatedDeliveryItem", selectedAllocatedDeliveryItem);
  const getDeliveryBoyDeliveries = async (todayFormatted) => {
    try {
      const requestData = {
        delivery_boy_id:
          selectedAllocatedDeliveryItem?.delivery_boy?.delivery_boy_id || "",
        date: todayFormatted || "",
      };

      const { data } = await axios.get(
        API_HUB_WISE_DELIVERYBOY_DELIVERIES_GET,
        {
          params: requestData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: config.headers.Authorization,
          },
        }
      );

      return data;
    } catch (error) {
      console.error("Error during API request:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDeliveryBoyDeliveries(todayFormatted);

        // Handle the data as needed
        setAllocatedDeliveriesByIDOfDeliveryBoy(data); // Corrected state variable
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [
    todayFormatted,
    selectedAllocatedDeliveryItem,
    config.headers.Authorization,
  ]);

  // const getDeliveryBoyDeliveries = async (todayFormatted, configHeaders) => {
  //   try {
  //     const requestData = {
  //       delivery_boy_id:
  //         selectedAllocatedDeliveryItem?.delivery_boy?.delivery_boy_id || "",
  //       date: todayFormatted || "",
  //     };

  //     const { data } = await axios.get(
  //       API_HUB_WISE_DELIVERYBOY_DELIVERIES_GET,
  //       {
  //         params: requestData,
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //           Authorization: configHeaders.Authorization,
  //         },
  //       }
  //     );

  //     return data;
  //   } catch (error) {
  //     console.error("Error during API request:", error);
  //     throw error;
  //   }
  // };

  // const fetchData = async () => {
  //   try {
  //     const data = await getDeliveryBoyDeliveries(
  //       todayFormatted,
  //       config.headers
  //     );

  //     // Handle the data as needed
  //     setAllocatedDeliveries(data); // Assuming setAllocatedDeliveries is your state setter
  //   } catch (error) {
  //     setError(error);
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // Call fetchData whenever needed
  // fetchData();
  //////////////////////////////////////////////////////////////////////

  // /select all checkboxes  Start

  const [selectAll, setSelectAll] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  const handleParentCheckboxChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCheckboxes(
      Array(allocatedDeliveriesByIDOfDeliveryBoy.length).fill(newSelectAll)
    );

    // If "Select All" is checked, store all data in selectedData
    if (newSelectAll) {
      setSelectedData([...allocatedDeliveriesByIDOfDeliveryBoy]);
    } else {
      setSelectedData([]); // If unchecked, clear the selectedData
    }
  };
  const handleChildCheckboxChange = (index) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index] = !newCheckboxes[index];
    setCheckboxes(newCheckboxes);

    // Check if all child checkboxes are checked
    if (newCheckboxes.every((value) => value)) {
      setSelectAll(true);
      setSelectedData([...allocatedDeliveriesByIDOfDeliveryBoy]);
    } else {
      setSelectAll(false);
      setSelectedData([]);
    }
  };
  useEffect(() => {
    setCheckboxes(
      Array(allocatedDeliveriesByIDOfDeliveryBoy.length).fill(false)
    );
  }, [allocatedDeliveriesByIDOfDeliveryBoy]);

  // select all checkboxes  End




  const deAllocateTaskByIdForPopupData = async () => {
    try {
      const payload = {
        "task_id": deAllocateTaskByIdForPopupDataTicket
      }
      const { data } = await axios.post(API_HUB_MANAGE_TASK_TASK_UNASSIGN, payload, config)
      toast.success(data.message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  }


  useEffect(() => {
    getManageTaskData(page1, pageSize1);
  }, [page1, pageSize1]);


  useEffect(() => {
    getManageTaskByHubData(page2, pageSize2);
  }, [page2, pageSize2]);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <div>
                    <h4>{hubData.name}</h4>
                    <p className="fs-7">{hubData.cwh}</p>
                    {hubData.is_active == true ? (
                      <button type="button" className="btn btn-success btn-sm ">
                        <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
                        Active
                      </button>
                    ) : (
                      <button type="button" className="btn btn-danger  btn-sm ">
                        <i className="bx bx-block font-size-16 align-middle me-2"></i>
                        InActive
                      </button>
                    )}
                  </div>

                  <div className="d-flex align-items-center">
                    <Link to={`/hub-list-edit/${id}`}>
                      <Button className="px-3 " color="primary">
                        Edit
                      </Button>
                    </Link>
                    {/* <Link to="/offers-add"> */}
                    <Button className="px-3 ms-2 " color="primary">
                      Delivery Route
                    </Button>
                    {/* </Link> */}
                    {/* <Button className="px-3 ms-2" color="primary">
                      View
                    </Button> */}
                    <Button
                      type="button"
                      onClick={() => {
                        tog_hubData();
                      }}
                      className="px-3 ms-2"
                      color="light"
                      data-toggle="modal"
                      data-target="#myModal"
                    >
                      <i className="bx bx-data"></i>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Hub Details Popup Start */}
          <Row>
            <Col lg={6}>
              <Card>
                <div>
                  <Modal isOpen={hudDetailsModalPopup} toggle={tog_hubData}>
                    <div className="modal-header">
                      <div className="headerDetails">
                        <h5 className="modal-title mt-0" id="myModalLabel">
                          {hubDataNew.name}
                        </h5>
                        <p className="fs-7">{hubData.cwh}</p>
                        <button
                          type="button"
                          className={`btn btn-${hubDataNew.is_active ? "success" : "danger"
                            } btn-sm`}
                        >
                          <i
                            className={`bx ${hubDataNew.is_active
                              ? "bx-check-double"
                              : "bx-block"
                              } font-size-16 align-middle me-2`}
                          />
                          {hubDataNew.is_active ? "Active" : "Inactive"}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          sethudDetailsModalPopup(false);
                        }}
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <h5>
                        <i className="bx bx-user me-1"></i> Hub Manager:
                      </h5>
                      <p className="ps-4">
                        {hubDataNew?.hub_manager?.first_name}{" "}
                        {hubDataNew?.hub_manager?.last_name}
                      </p>
                      <h5>
                        <i className="bx bx-pin me-1"></i> Serving Pincodes:
                      </h5>
                      <ul className="ps-4">
                        {hubDataNew?.assigned_pincodes?.map((item) => (
                          <li key={item.id}>{item.code}</li>
                        ))}
                      </ul>

                      <h5>
                        <i className="bx bx-map-pin me-1"></i> Hub Address:
                      </h5>
                      <p className="ps-4">{hubDataNew?.address}</p>
                      <h5>
                        <i className="bx bx-taxi me-1"></i> Delivery Boys:
                      </h5>
                      <ul className="ps-4">
                        {hubDataNew?.assigned_delivery_boys?.map((item) => (
                          <li key={item.delivery_boy_id}>
                            {item.first_name} {item.last_name}
                          </li>
                        ))}
                      </ul>
                      <h5>
                        <i className="bx bxs-map-alt me-1"></i> Delivery Areas:
                      </h5>
                      <ul className="ps-4">
                        {hubDataNew?.assigned_areas?.map((item) => (
                          <li key={item.id}>{item.area_name}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        onClick={tog_hubData}
                        className="btn btn-danger"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                    </div>
                  </Modal>
                </div>
              </Card>
            </Col>
          </Row>
          {/* Hub Details Popup End */}
          <Col lg={12}>
            <Card>
              <CardBody>
                <Nav tabs className="nav-tabs-custom nav-justified">
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTab === "1",
                      })}
                      onClick={() => {
                        toggleCustom("1");
                      }}
                    >
                      <span className="d-block d-sm-none">
                        <i className="fas fa-home"></i>
                      </span>
                      <span className="d-none d-sm-block">
                        Allocated Deliveries
                      </span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTab === "2",
                      })}
                      onClick={() => {
                        toggleCustom("2");
                        getManageTaskByHubData();
                      }}
                    >
                      <span className="d-block d-sm-none">
                        <i className="far fa-user"></i>
                      </span>
                      <span className="d-none d-sm-block">Manage Task</span>
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent
                  activeTab={customActiveTab}
                  className="p-3 text-muted"
                >
                  <TabPane tabId="1">
                    <Row>
                      <Col sm="12">
                        <Row>
                          <Col xl={12}>
                            <Card className="pb-5">
                              <CardBody>
                                <div className="table-responsive">
                                  <Table className="align-middle">
                                    <thead className="table-light">
                                      <tr>
                                        <th>Delivery Boy</th>
                                        <th>Contact</th>
                                        <th>Area</th>
                                        <th>Order</th>
                                        <th>Order Expired Soon</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {allocatedDeliveries?.results?.map(
                                        (item) => (
                                          <tr key={item.id}>
                                            <td>
                                              {item.delivery_boy.first_name}{" "}
                                              {item.delivery_boy.last_name}
                                            </td>
                                            <td>
                                              {item.delivery_boy.contact_no}
                                            </td>
                                            <td>{item.area}</td>
                                            <td>{item.orders}</td>
                                            <td>{item.expiring_orders}</td>
                                            <td>
                                              <button
                                                type="button"
                                                onClick={async () => {
                                                  transferDeliveryPopupToggle();
                                                  setSelectedAllocatedDeliveryItem(
                                                    item
                                                  );
                                                }}
                                                className="btn btn-light"
                                                data-toggle="modal"
                                                data-target=".bs-example-modal-lg"
                                              >
                                                <span className="fas fa-share"></span>
                                              </button>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </Table>
                                </div>
                              </CardBody>
                              <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={allocatedDeliveries?.results?.length}
                                rowsPerPage={pageSize1}
                                page={page1}
                                onPageChange={handleChangePage1}
                                onRowsPerPageChange={handleChangeRowsPerPage1}
                              />
                            </Card>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col sm="12">
                        <Row>
                          <Col xl={12}>
                            <Card className="pb-5">
                              <CardBody>
                                <div className="table-responsive">
                                  <Table className="align-middle ">
                                    <thead className="table-light">
                                      <tr>
                                        <th>Task No.</th>
                                        <th>Task date</th>
                                        <th>Task Type</th>
                                        <th>Customer</th>
                                        <th>Area</th>
                                        <th>Task Status</th>
                                        <th>Assign To</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {manageTaskByHubData.results &&
                                        manageTaskByHubData.results.map((item) => (
                                          <tr key={item.task_id}>
                                            <td style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => {
                                              getTaskByTaskNo(item.task_id),
                                              tog_taskDetailByTaskNo()
                                            }}>
                                              {item.task_id}
                                            </td>
                                            <td>{item.task_date}</td>
                                            <td>{item.task_type}</td>
                                            <td>
                                              {item.customer.first_name} {item.customer.last_name} <br />
                                              {item.customer.contact_no}
                                            </td>
                                            <td>{item.customer_address.area.area_name}</td>
                                            <td>{item.task_status}</td>
                                            <td>
                                              {item.assign_to ? `${item.assign_to.first_name} ${item.assign_to.last_name}` : "Unassigned"}
                                            </td>
                                            <td>
                                              <td>
                                                <span
                                                  className="far fa-comments fs-5 d-inline "
                                                  id={`commentTooltip_${item.task_id}`}
                                                  style={{ cursor: "pointer" }}
                                                ></span>
                                                <UncontrolledTooltip
                                                  placement="bottom"
                                                  target={`commentTooltip_${item.task_id}`}
                                                  style={{ marginTop: "7px" }}
                                                >
                                                  {item.comment}
                                                </UncontrolledTooltip>

                                                {item.task_status === "Pending" && !item.assign_to && (
                                                  <Button
                                                    className="border-0 ms-2 d-inline"
                                                    color="light"
                                                    onClick={() => {
                                                      assignModalTogle();
                                                      getAssignTaskByIdForPopupData(item.task_id);
                                                    }}
                                                  >
                                                    <span className="fas fa-user-plus"></span>
                                                  </Button>
                                                )}

                                                {item.assign_to === null && item.task_status == "Pending" || item.task_status =="Attempted" && (
                                                  <Button
                                                    className="border-0 ms-2 d-inline"
                                                    color="light"
                                                    onClick={() => {
                                                      toggleDeallocate();
                                                      setDeAllocateTaskByIdForPopupDataTicket(item.task_id)
                                                    }}
                                                  >
                                                    <span className="fas fa-user-slash"></span>
                                                  </Button>
                                                )}
                                                {item.cancel_reason && (
                                                  <div className="d-inline ms-2">
                                                    <span
                                                      className="far fa-sticky-note ms-2 d-inline"
                                                      id={`cancelReasonTooltip_${item.task_id}`}
                                                      style={{ cursor: "pointer" }}
                                                    ></span>
                                                    <UncontrolledTooltip
                                                      placement="bottom"
                                                      target={`cancelReasonTooltip_${item.task_id}`}
                                                      style={{ marginTop: "7px" }}
                                                    >
                                                      cancel reason: {item.cancel_reason}
                                                    </UncontrolledTooltip>
                                                  </div>
                                                )}

                                                {item.completed_at && (
                                                  <div className="d-inline ms-2">
                                                    <span
                                                      className="far fa-clock ms-2 d-inline"
                                                      id={`completedAtTooltip_${item.task_id}`}
                                                      style={{ cursor: "pointer" }}
                                                    ></span>
                                                    <UncontrolledTooltip
                                                      placement="bottom"
                                                      target={`completedAtTooltip_${item.task_id}`}
                                                      style={{ marginTop: "7px" }}
                                                    >
                                                      {item.completed_at}
                                                    </UncontrolledTooltip>
                                                  </div>
                                                )}
                                              </td>

                                            </td>

                                          </tr>
                                        ))}
                                    </tbody>
                                  </Table>

                                </div>
                              </CardBody>
                              <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={manageTaskByHubData?.results?.length}
                                rowsPerPage={pageSize2}
                                page={page2}
                                onPageChange={handleChangePage2}
                                onRowsPerPageChange={handleChangeRowsPerPage2}
                              />
                            </Card>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
          {/* Tabs For data start */}
          <Row></Row>
        </Container>
      </div>
      {/* Popup Start */}
      <Modal
        size="lg"
        isOpen={transfroDeliveryModal}
        toggle={() => {
          transferDeliveryPopupToggle();
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0 text-primary" id="myLargeModalLabel">
            Share Orders of {""}
            {selectedAllocatedDeliveryItem?.delivery_boy?.first_name}{" "}
            {selectedAllocatedDeliveryItem?.delivery_boy?.last_name}
          </h5>
          <button
            onClick={() => {
              settransfroDeliveryModal(false);
            }}
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Col xl="12" className="p-4">
          <Form
            className="needs-validation"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Row>
              <Col xl="12">
                {/* <div className="control-group" id="transfer_typeGroup">
                  <div className="controls d-flex">
                    <Label className="me-5">Share Orders :</Label>
                    <div className="parent d-flex">
                      <FormGroup check className="mb-2">
                        <Input
                          type="radio"
                          id="radioTemporary"
                          name="transfer_type"
                          value={selectedTransferType === "Temporary"}
                          onChange={validation.handleChange || ""}
                          onBlur={validation.handleBlur}
                          className="form-check-input"
                        />
                        <Label
                          check
                          className="form-check-label"
                          htmlFor="radioTemporary"
                        >
                          Temporary
                        </Label>
                      </FormGroup>

                      <FormGroup check className="mb-2 ms-2">
                        <Input
                          type="radio"
                          id="radioPermanently"
                          name="transfer_type"
                          value={selectedTransferType === "Permanently"}
                          onChange={validation.handleChange || ""}
                          onBlur={validation.handleBlur}
                          className="form-check-input"
                        />
                        <Label
                          check
                          className="form-check-label"
                          htmlFor="radioPermanently"
                        >
                          Permanently
                        </Label>
                      </FormGroup>
                    </div>
                  </div>
                  {validation.touched.transfer_type &&
                  validation.errors.transfer_type ? (
                    <FormFeedback type="invalid">
                      {validation.errors.transfer_type}
                    </FormFeedback>
                  ) : null}
                </div> */}
                <div className="control-group" id="transfer_typeGroup">
                  <div className="controls d-flex">
                    <Label className="me-5">Share Orders :</Label>
                    <div className="parent d-flex">
                      <FormGroup check className="mb-2">
                        <Input
                          type="radio"
                          id="radioTemporary"
                          name="transfer_type"
                          value="Temporary"
                          onClick={(e) => {
                            setSelectedTransferType(e.target.value);
                            validation.handleChange(e);
                          }}
                          onBlur={validation.handleBlur}
                          className="form-check-input"
                          checked={selectedTransferType === "Temporary"}
                        />
                        <Label
                          check
                          className="form-check-label"
                          htmlFor="radioTemporary"
                        >
                          Temporary
                        </Label>
                      </FormGroup>

                      <FormGroup check className="mb-2 ms-2">
                        <Input
                          type="radio"
                          id="radioPermanently"
                          name="transfer_type"
                          value="Permanently"
                          onClick={(e) => {
                            setSelectedTransferType(e.target.value);
                            validation.handleChange(e);
                          }}
                          onBlur={validation.handleBlur}
                          className="form-check-input"
                          checked={selectedTransferType === "Permanently"}
                        />
                        <Label
                          check
                          className="form-check-label"
                          htmlFor="radioPermanently"
                        >
                          Permanently
                        </Label>
                      </FormGroup>
                    </div>
                  </div>
                  {validation.touched.transfer_type &&
                    validation.errors.transfer_type ? (
                    <FormFeedback type="invalid">
                      {validation.errors.transfer_type}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col md="12">
                <div className="mb-3">
                  <Row>
                    <Col md="3">
                      <label htmlFor="from_date" className="form-label">
                        Joined On :
                      </label>
                    </Col>
                    <Col md="8" className="">
                      <label htmlFor="from_date" className="form-label">
                        From Date :
                      </label>
                      <Flatpickr
                        id="from_date"
                        name="from_date"
                        placeholder="dd-mm-yyyy"
                        className={`form-control ${validation.touched.from_date &&
                          validation.errors.from_date
                          ? "is-invalid"
                          : ""
                          }`}
                        value={validation.values.from_date}
                        onChange={(date) => {
                          const formattedDate = format(date[0], "yyyy-MM-dd"); // Format the date
                          validation.setFieldValue("from_date", formattedDate);
                        }}
                        options={{
                          dateFormat: "Y-m-d",
                        }}
                      />
                      {validation.touched.from_date &&
                        validation.errors.from_date && (
                          <div className="invalid-feedback">
                            {validation.errors.from_date}
                          </div>
                        )}
                    </Col>
                    <Col md="1"></Col>
                    <Col md="3"></Col>
                    {selectedTransferType === "Permanently" ? null : (
                      <>
                        <Col md="8" className="">
                          <label htmlFor="to_date" className="form-label mt-2">
                            To Date :
                          </label>
                          <Flatpickr
                            id="to_date"
                            name="to_date"
                            placeholder="dd-mm-yyyy"
                            className={`form-control ${validation.touched.to_date &&
                              validation.errors.to_date
                              ? "is-invalid"
                              : ""
                              }`}
                            value={validation.values.to_date}
                            onChange={(date) => {
                              const formattedDate = format(
                                date[0],
                                "yyyy-MM-dd"
                              ); // Format the date
                              validation.setFieldValue(
                                "to_date",
                                formattedDate
                              );
                            }}
                            options={{
                              dateFormat: "Y-m-d",
                            }}
                          />
                          {validation.touched.to_date &&
                            validation.errors.to_date && (
                              <div className="invalid-feedback">
                                {validation.errors.to_date}
                              </div>
                            )}
                        </Col>
                      </>
                    )}
                    <Col md="1"></Col>
                  </Row>
                  <Row className="">
                    <Label for="exampleEmail" className="mt-3" md="3">
                      Share Orders to :
                    </Label>
                    <Col sm="8" className="mt-3">
                      <Input
                        name="shareOrderTo"
                        placeholder="Share Order To"
                        type="select"
                        className="form-control"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.shareOrderTo || ""}
                        invalid={
                          validation.touched.shareOrderTo &&
                            validation.errors.shareOrderTo
                            ? true
                            : false
                        }
                      >
                        <option value="" disabled>
                          Select Delivery Boy
                        </option>
                        {allDeliveryBoys?.map((item) => (
                          <option
                            key={item.delivery_boy_id}
                            value={item.delivery_boy_id}
                          >
                            {item.first_name} {""} {item.last_name}
                          </option>
                        ))}
                      </Input>
                      {validation.touched.shareOrderTo &&
                        validation.errors.shareOrderTo ? (
                        <FormFeedback type="invalid">
                          {validation.errors.shareOrderTo}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={12}>
                      <Card>
                        <CardBody>
                          <div
                            className="table-responsive"
                            style={{ maxHeight: "350px", overflowY: "auto" }}
                          >
                            <Table className="table mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="parentCheckbox"
                                        checked={selectAll}
                                        // onChange={handleParentCheckboxChange}
                                        onClick={handleParentCheckboxChange}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="parentCheckbox"
                                      ></label>
                                    </div>
                                  </th>
                                  <th>Order No.</th>
                                  <th>Customer Name</th>
                                  <th>Area</th>
                                  <th>Shared To</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allocatedDeliveriesByIDOfDeliveryBoy?.map(
                                  (item, index) => (
                                    <tr key={index} className="">
                                      <td>
                                        <div className="form-check">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value=""
                                            id={`id_${item.id}`}
                                            name={`checkbox_${item.id}`}
                                            checked={checkboxes[index] || false}
                                            // onChange={() =>
                                            //   handleChildCheckboxChange(index)
                                            // }
                                            onClick={() =>
                                              handleChildCheckboxChange(index)
                                            }
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor={`id_${item.id}`}
                                          ></label>
                                        </div>
                                      </td>
                                      <td>{item?.order_id}</td>
                                      <td> {item?.customer.first_name}</td>
                                      <td>{item?.area}</td>
                                      <td>{item?.shareTo}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </Table>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            <div className="d-flex justify-content-center">
              <Button color="primary" type="submit">
                Submit form
              </Button>
              <Button
                color="danger"
                className="ms-2"
                onClick={() => {
                  transferDeliveryPopupToggle();
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Col>
      </Modal>
      ;{/* Popup End */}
      {/* Assign Task modal start */}
      <Modal
        size="xl"
        isOpen={assignModal}
        toggle={() => {
          assignModalTogle();
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Assign Task</h5>
          <button
            type="button"
            onClick={() => {
              setassignModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <Row className="w-100 border-bottom pb-4">
            <Col md="6">
              <Row className="mt-2">
                <Col sm="3">Task No : </Col>
                <Col sm="9">
                  <b>{assignTaskByIdForPopupData?.data?.task_id}</b>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm="3">Task Type : </Col>
                <Col sm="9">
                  <b>{assignTaskByIdForPopupData?.data?.task_type}</b>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm="3">Area : </Col>
                <Col sm="9">
                  <b>
                    {" "}
                    {
                      assignTaskByIdForPopupData?.data?.customer_address?.area
                        ?.area_name
                    }
                  </b>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm="3">Address : </Col>
                <Col sm="9">
                  <b>
                    {
                      assignTaskByIdForPopupData?.data?.customer_address
                        ?.full_address
                    }
                  </b>
                </Col>
              </Row>
            </Col>
            <Col md="6">
              <Row className="mt-2">
                <Col sm="3">Customer : </Col>
                <Col sm="9">
                  <b>
                    {assignTaskByIdForPopupData?.data?.customer?.first_name}
                    {assignTaskByIdForPopupData?.data?.customer?.last_name}
                  </b>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm="3">Contact No : </Col>
                <Col sm="9">
                  <b>
                    {assignTaskByIdForPopupData?.data?.customer?.contact_no}
                  </b>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm="3">Cash Collection : </Col>
                <Col sm="9">
                  <b>₹ {assignTaskByIdForPopupData?.data?.amount_due}</b>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm="3">Comments : </Col>
                <Col sm="9">
                  <b>{assignTaskByIdForPopupData?.data?.comment}</b>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3 w-75 ">
            <Col md="12">
              <Card>
                <CardBody>
                  <Form
                    className="needs-validation"
                    onSubmit={(e) => {
                      e.preventDefault();
                      taskAssignvalidation.handleSubmit();
                      return false;
                    }}
                  >
                    <Row>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="taskAssignvalidation">
                            Assign Task to
                          </Label>
                          <Input
                            name="assign_to"
                            placeholder=""
                            type="select"
                            className="form-control"
                            id="taskAssignvalidation"
                            onChange={taskAssignvalidation.handleChange}
                            onBlur={taskAssignvalidation.handleBlur}
                            value={taskAssignvalidation.values.assign_to || ""}
                            invalid={
                              taskAssignvalidation.touched.assign_to &&
                                taskAssignvalidation.errors.assign_to
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Option</option>
                            {assignTaskByIdForPopupData?.delivery_assistants?.map(
                              (item) => (
                                <option
                                  key={item.delivery_boy_id}
                                  value={item.delivery_boy_id}
                                >
                                  {`${item.first_name} ${item.last_name}`}
                                </option>
                              )
                            )}
                          </Input>
                          {taskAssignvalidation.touched.assign_to &&
                            taskAssignvalidation.errors.assign_to ? (
                            <FormFeedback type="invalid">
                              {taskAssignvalidation.errors.assign_to}
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
      {/* Assign Task modal End */}
      {/* deallocate the Delivery boy from this task Start */}
      <Modal
        isOpen={deAllocateTaskModal}
        toggle={() => {
          toggleDeallocate();
        }}
        centered
      >
        <div className="modal-header">
          <button
            type="button"
            onClick={() => {
              setdeAllocateTaskModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body ">
          <h5 className="text-primary">
            Are you sure you want to deallocate the Delivery boy from this task?
          </h5>

          <div className="mt-4">
            <Button color="primary" className="px-3" onClick={() => deAllocateTaskByIdForPopupData()}>
              Yes
            </Button>
            <Button
              color="danger"
              className="ms-2 px-3"
              onClick={() => {
                setdeAllocateTaskModal(false);
              }}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>
      {/* deallocate the Delivery boy from this task End */}

      {/* task detail by task no start */}


      <Modal
        isOpen={taskDetailbTaskNoModal}
        toggle={() => {
          tog_taskDetailByTaskNo();
        }}
        centered
        size="lg"
      >
        <div className="modal-header"><b>Task Details</b>
          <button
            type="button"
            onClick={() => {
              settaskDetailbTaskNoModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
      <Row className="mt-3">
        <Col sm="2">Task No.</Col>
        <Col sm="4"><b>{TaskDetailByTaskNo?.task_id}  </b></Col>
        <Col sm="2">Customer</Col>
        <Col sm="4"><b>{TaskDetailByTaskNo?.customer?.first_name} {TaskDetailByTaskNo?.customer?.last_name}</b></Col>
      </Row>
      <Row className="mt-3">
        <Col sm="2">Task Type</Col>
        <Col sm="4"><b>{TaskDetailByTaskNo?.task_type}</b></Col>
        <Col sm="2">Contact No.</Col>
        <Col sm="4"><b>{TaskDetailByTaskNo?.customer?.contact_no}</b></Col>
      </Row>
      <Row className="mt-3">
        <Col sm="2">Area</Col>
        <Col sm="4"><b>{TaskDetailByTaskNo?.customer_address?.area.area_name}</b></Col>
        <Col sm="2">Cash Collection</Col>
        <Col sm="4"><b>{TaskDetailByTaskNo?.amount_due}</b></Col>
      </Row>
      <Row className="mt-3">
        <Col sm="2">Address</Col>
        <Col sm="4"><b>{TaskDetailByTaskNo?.customer_address?.full_address}</b></Col>
        <Col sm="2">Comments</Col>
        <Col sm="4"><b>{TaskDetailByTaskNo?.comment}</b></Col>
      </Row>
      <Row className="border mt-2"></Row>
      <Row className="mt-2">
      <Col sm="2">Task Status :
</Col>
        <Col sm="4"><b>{TaskDetailByTaskNo?.task_status}</b></Col> 
      </Row>
    </div>


      </Modal>


      {/* task detail by task no Edn */}
    </>
  );
};

export default HubDetails;

import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Modal,
  Row,
  Table,
  UncontrolledTooltip,
} from "reactstrap";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { useEffect } from "react";
import axios from "axios";
import {
  API_CUSTOMERS_REGISTER_GET_POST,
  API_HUB_ADD_GET,
  API_HUB_MANAGE_TASK_GET,
  CANCEL_HUB_TASK_FROM_HEADER,
  GET_ORDER_LIST_FOR_DROPDOWN,
  POST_HUB_TASK_FROM_HEADER,
} from "customhooks/All_Api/Apis";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const NotificationTaskManager = () => {
  const [taskData, setTaskData] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [taskStatus, setTaskStatus] = useState("");
  const [hubId, setHubId] = useState("");
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const [hubListData, setHubListData] = useState();
  const [customerDetails, setCustomresDetails] = useState();
  const [modal_center, setmodal_center] = useState(false);
  const [cancelModalCenter, setCancelModalCenter] = useState(false);
  const [customerOrders, setCustomerOrders] = useState();
  const [cancelTaskId, setCancelTaskId] = useState();
  const { config, first_name, last_name } = GetAuthToken();

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      task_type: "",
      customer_id: "",
      hub_id: "",
      comments: "",
      order_id: "",
    },
    validationSchema: Yup.object({
      task_type: Yup.string().required("Task Type is Required"),
      customer_id: Yup.string().required("Customer is Required"),
      hub_id: Yup.string().required("Hub is Required"),
      order_id: Yup.string().required("Select An Order"),
      comments: Yup.string().notRequired(),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          POST_HUB_TASK_FROM_HEADER,
          values,
          config
        );
        toast.success(`Task Created successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        getTaskData();
        setmodal_center(false);
      } catch (error) {
        toast.error("Something went wrong while creating Task", {
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

  const cancelValidations = useFormik({
    enableReinitialize: true,

    initialValues: {
      cancel_reason: "",
    },
    validationSchema: Yup.object({
      cancel_reason: Yup.string().required("Cancel Reason is Required"),
    }),
    onSubmit: async (values) => {
      const submittionData = {
        ...values,
        task_id: cancelTaskId,
      };
      try {
        const { data } = await axios.post(
          CANCEL_HUB_TASK_FROM_HEADER,
          submittionData,
          config
        );
        toast.success(`Task Cancelled successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setCancelModalCenter(false);
        getTaskData();
      } catch (error) {
        toast.error("Something went wrong while cancelling Task", {
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

  const popupUserInfo =
    customerDetails &&
    customerDetails.filter(
      (eachUerInfo) =>
        eachUerInfo.customer.customer_id === validation.values.customer_id
    );

  const popupUserAddressInfo =
    popupUserInfo &&
    popupUserInfo[0]?.addresses.filter(
      (eachAddress) => eachAddress.is_primary_address == true
    )[0];

  const getTaskData = async () => {
    try {
      const { data } = await axios.get(
        `${API_HUB_MANAGE_TASK_GET}?status=${taskStatus}&hub_id=${hubId}&page=${pageNumber}&page_size=${pageSize}`,
        config
      );
      setTaskData(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      const totalPages = Math.ceil(data.count / pageSize);

      let startPage = Math.max(1, pageNumber - 1);
      let endPage = Math.min(totalPages, startPage + 2);

      if (endPage - startPage < 2) {
        startPage = Math.max(1, endPage - 2);
      }

      setVisiblePageNumbers(
        [...Array(endPage - startPage + 1)].map((_, index) => startPage + index)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHubListData = async () => {
    try {
      const { data } = await axios.get(API_HUB_ADD_GET, config);
      setHubListData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomerListData = async () => {
    try {
      const { data } = await axios.get(API_CUSTOMERS_REGISTER_GET_POST, config);
      setCustomresDetails(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const { data } = await axios.get(
          `${GET_ORDER_LIST_FOR_DROPDOWN}?customer_or_order_id=${validation.values.customer_id}`,
          config
        );
        setCustomerOrders(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (validation.values.customer_id) {
      fetchCustomerOrders();
    }
  }, [validation.values.customer_id]);

  useEffect(() => {
    getTaskData();
    fetchHubListData();
    fetchCustomerListData();
  }, [pageNumber, pageSize, taskStatus, hubId]);

  const handleNextPage = () => {
    if (nextPage) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = e.target.value;
    setPageSize(newSize);
    setPageNumber(1);
  };

  function tog_center() {
    setmodal_center(!modal_center);
  }

  function cancel_tog_center() {
    setCancelModalCenter(!cancelModalCenter);
  }

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Card>
            <div>
              <Modal
                isOpen={modal_center}
                toggle={() => {
                  tog_center();
                }}
                centered
              >
                <div className="modal-header">
                  <h5 className="modal-title mt-0">Create Task</h5>
                  <button
                    type="button"
                    onClick={() => {
                      setmodal_center(false);
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
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <Row>
                      <Col lg={6}>
                        <Input
                          type="select"
                          className="form-control mt-2"
                          name="task_type"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.task_type || ""}
                          invalid={
                            validation.touched.task_type &&
                            validation.errors.task_type
                              ? true
                              : false
                          }
                        >
                          <option value="">Task Type</option>
                          <option value="Others">Others</option>
                        </Input>
                        {validation.touched.task_type &&
                        validation.errors.task_type ? (
                          <FormFeedback type="invalid">
                            {validation.errors.task_type}
                          </FormFeedback>
                        ) : null}
                        <Input
                          type="select"
                          className="form-control mt-2"
                          name="customer_id"
                          onChange={validation.handleChange}
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
                          {customerDetails &&
                            customerDetails.map((eachCustomer, index) => (
                              <option
                                key={index}
                                value={eachCustomer.customer.customer_id}
                              >
                                {eachCustomer.customer.first_name +
                                  " " +
                                  eachCustomer.customer.last_name}
                              </option>
                            ))}
                        </Input>
                        {validation.touched.customer_id &&
                        validation.errors.customer_id ? (
                          <FormFeedback type="invalid">
                            {validation.errors.customer_id}
                          </FormFeedback>
                        ) : null}
                        <Input
                          type="select"
                          className="form-control mt-2"
                          name="order_id"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.order_id || ""}
                          invalid={
                            validation.touched.order_id &&
                            validation.errors.order_id
                              ? true
                              : false
                          }
                        >
                          <option value="">Select Orders</option>
                          {/* {hubListData &&
                                hubListData.map((eachHub, index) => (
                                  <option key={index} value={eachHub.id}>
                                    {eachHub.name}
                                  </option>
                                ))} */}
                          {customerOrders &&
                            customerOrders.map((eachOrder, index) => (
                              <option key={index} value={eachOrder.order_id}>
                                {eachOrder.order_id}
                              </option>
                            ))}
                        </Input>
                        {validation.touched.order_id &&
                        validation.errors.order_id ? (
                          <FormFeedback type="invalid">
                            {validation.errors.order_id}
                          </FormFeedback>
                        ) : null}
                        <Input
                          type="select"
                          className="form-control mt-2"
                          name="hub_id"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.hub_id || ""}
                          invalid={
                            validation.touched.hub_id &&
                            validation.errors.hub_id
                              ? true
                              : false
                          }
                        >
                          <option value="">Select Hub</option>
                          {hubListData &&
                            hubListData.map((eachHub, index) => (
                              <option key={index} value={eachHub.id}>
                                {eachHub.name}
                              </option>
                            ))}
                        </Input>
                        {validation.touched.hub_id &&
                        validation.errors.hub_id ? (
                          <FormFeedback type="invalid">
                            {validation.errors.hub_id}
                          </FormFeedback>
                        ) : null}
                        <Input
                          type="textarea"
                          placeholder="Comment if any"
                          className="form-control mt-2"
                          name="comments"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.comments || ""}
                          invalid={
                            validation.touched.comments &&
                            validation.errors.comments
                              ? true
                              : false
                          }
                        />
                        {validation.touched.comments &&
                        validation.errors.comments ? (
                          <FormFeedback type="invalid">
                            {validation.errors.comments}
                          </FormFeedback>
                        ) : null}
                      </Col>
                      <Col lg={6}>
                        <h5
                          style={{
                            color: "black",
                            fontWeight: "600",
                            marginTop: "6px",
                          }}
                        >
                          Customer Info
                        </h5>
                        <h6>
                          Area :{" "}
                          {popupUserAddressInfo &&
                            popupUserAddressInfo?.pincode}{" "}
                          ({popupUserAddressInfo && popupUserAddressInfo?.area})
                        </h6>
                        <h6>
                          Contact :{" "}
                          {popupUserInfo &&
                            popupUserInfo[0]?.customer?.contact_no}
                        </h6>
                        <h6>
                          Address :{" "}
                          {popupUserAddressInfo &&
                            popupUserAddressInfo?.house_no}{" "}
                          {popupUserAddressInfo &&
                            popupUserAddressInfo?.society}{" "}
                          {popupUserAddressInfo &&
                            popupUserAddressInfo?.landmark}{" "}
                          {popupUserAddressInfo &&
                            popupUserAddressInfo?.city_name}{" "}
                          {popupUserAddressInfo &&
                            popupUserAddressInfo?.pincode}
                        </h6>
                      </Col>
                      <div className="m-2">
                        <button
                          type="submit"
                          className="btn btn-sm btn-primary"
                        >
                          Submit
                        </button>
                      </div>
                    </Row>
                  </Form>
                </div>
              </Modal>
            </div>
          </Card>

          <Card>
            <div>
              <Modal
                isOpen={cancelModalCenter}
                toggle={() => {
                  cancel_tog_center();
                }}
                centered
              >
                <div className="modal-header">
                  <h5 className="modal-title mt-0">Cancel Task</h5>
                  <button
                    type="button"
                    onClick={() => {
                      cancel_tog_center(false);
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
                    onSubmit={(e) => {
                      e.preventDefault();
                      cancelValidations.handleSubmit();
                      return false;
                    }}
                  >
                    <Row>
                      <Col lg={12}>
                        <Input
                          type="text"
                          placeholder="Reason to cancel Task"
                          className="form-control mt-2"
                          name="cancel_reason"
                          onChange={cancelValidations.handleChange}
                          onBlur={cancelValidations.handleBlur}
                          value={cancelValidations.values.cancel_reason || ""}
                          invalid={
                            cancelValidations.touched.cancel_reason &&
                            cancelValidations.errors.cancel_reason
                              ? true
                              : false
                          }
                        />
                        {cancelValidations.touched.cancel_reason &&
                        cancelValidations.errors.cancel_reason ? (
                          <FormFeedback type="invalid">
                            {cancelValidations.errors.cancel_reason}
                          </FormFeedback>
                        ) : null}
                      </Col>
                      <div className="mt-2">
                        <button
                          type="submit"
                          className="btn btn-sm btn-primary"
                        >
                          Submit
                        </button>
                      </div>
                    </Row>
                  </Form>
                </div>
              </Modal>
            </div>
          </Card>

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <div>
                    <h3>Task Allocation</h3>
                  </div>
                  <div className="d-flex">
                    <button className="btn btn-sm btn-secondary me-1">
                      Export
                    </button>
                    <button
                      className="btn btn-sm btn-primary me-1"
                      onClick={() => {
                        tog_center();
                      }}
                    >
                      Create
                    </button>
                    <Input
                      type="select"
                      className="me-1"
                      onChange={(e) => setTaskStatus(e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </Input>
                    <Input
                      type="select"
                      onChange={(e) => setHubId(e.target.value)}
                    >
                      <option value="">Select Hub</option>
                      {hubListData &&
                        hubListData.map((eachHub, index) => (
                          <option key={index} value={eachHub.id}>
                            {eachHub.name}
                          </option>
                        ))}
                    </Input>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
                  <div className="table-responsive">
                    <Table className="align-middle ">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center">Task No.</th>
                          <th className="text-center">Task Date</th>
                          <th className="text-center">Task Type</th>
                          <th className="text-center">Customer</th>
                          <th className="text-center">Order Details</th>
                          <th className="text-center">Allocated To</th>
                          <th className="text-center">Task Status</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taskData &&
                          taskData.map((eachTask, index) => (
                            <tr key={eachTask.task_id}>
                              <td className="text-center">
                                {eachTask.task_id}
                              </td>
                              <td className="text-center">
                                {eachTask.task_date}
                              </td>
                              <td className="text-center">
                                {eachTask.task_type}
                              </td>
                              <td className="text-center">
                                {eachTask.customer.first_name +
                                  " " +
                                  eachTask.customer.last_name}
                              </td>
                              <td className="text-center d-flex flex-column">
                                {eachTask.order_id}
                                <p>₹ {eachTask.amount_due}</p>
                              </td>
                              <td className="text-center">Hub Name Key</td>
                              <td className="text-center">
                                {eachTask.task_status}
                              </td>
                              <td className="text-center">
                                <span
                                  href="#"
                                  id={eachTask.task_id}
                                  style={{
                                    color: "blue",
                                  }}
                                >
                                  <i
                                    className="bx bxs-chat"
                                    style={{ fontSize: "20px" }}
                                  ></i>
                                </span>

                                <UncontrolledTooltip
                                  placement="top"
                                  target={eachTask.task_id}
                                >
                                  {eachTask.comment ? eachTask.comment : "-"}
                                </UncontrolledTooltip>

                                {eachTask.task_status !== "Completed" ? (
                                  <div>
                                    <span
                                      id={eachTask.task_id + 1}
                                      style={{
                                        color: "blue",
                                      }}
                                      onClick={() => {
                                        cancel_tog_center();
                                        setCancelTaskId(eachTask.task_id);
                                      }}
                                    >
                                      <i
                                        className="fas fa-times"
                                        style={{
                                          fontSize: "20px",
                                          margin: "10px",
                                        }}
                                      ></i>
                                    </span>

                                    <UncontrolledTooltip
                                      placement="top"
                                      target={eachTask.task_id + 1}
                                    >
                                      Cancel Task
                                    </UncontrolledTooltip>
                                  </div>
                                ) : (
                                  <div>
                                    <span
                                      id={eachTask.task_id + 1}
                                      style={{
                                        color: "blue",
                                      }}
                                    >
                                      <i
                                        className="far fa-clock"
                                        style={{
                                          fontSize: "20px",
                                          margin: "10px",
                                        }}
                                      ></i>
                                    </span>
                                    <UncontrolledTooltip
                                      placement="top"
                                      target={eachTask.task_id + 1}
                                    >
                                      Task Completed On {eachTask.completed_at}
                                    </UncontrolledTooltip>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <span className=" text-dark ms-4 me-1">Showing</span>
                      <select
                        onChange={(e) => handlePageSizeChange(e)}
                        style={{ height: "20px", marginTop: "4px" }}
                        defaultValue={pageSize}
                      >
                        <option value={5}>5</option>
                        <option value={10} selected>
                          10
                        </option>
                        <option value={15}>15</option>
                        <option value={25}>25</option>
                        <option value={100}>100</option>
                      </select>
                      <span className=" text-dark m-1">Items per page</span>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-primary m-1"
                        onClick={handlePreviousPage}
                      >
                        Previous
                      </button>
                      {visiblePageNumbers.map((page) => (
                        <button
                          key={page}
                          className={`btn btn-sm btn-primary m-1 ${
                            page === pageNumber ? "active" : ""
                          }`}
                          onClick={() => setPageNumber(page)}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        className="btn btn-sm btn-primary m-1 me-4"
                        onClick={handleNextPage}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default NotificationTaskManager;

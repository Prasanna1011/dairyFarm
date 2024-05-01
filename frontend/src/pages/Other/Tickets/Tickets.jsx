import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Tooltip,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import axios from "axios";
import { API_TICKETS_GET, API_TICKETS_RESOLVE } from "customhooks/All_Api/Apis";
import { format } from "date-fns";
import { useFormik, formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { TablePagination } from "@mui/material";
import LoaderPage from "components/Loader/LoaderPage";

const Tickets = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [ticketsData, setTicketsData] = useState([]);
  const [selectedStatusArray, setSelectedStatusArray] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [customerCommentTooltip, setCustomerCommentTooltip] = useState(false);
  const [resolveCommentTooltip, setResolveCommentTooltip] = useState(false);
  const [acknowledgeDateTooltip, setAcknowledgeDateTooltip] = useState(false);
  const [ticketResolvePopup, setTicketResolvePopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [acknowledgePopup, setAcknowledgePopup] = useState(false);
  const [loading, setLoading] = useState(true);

  // Local storage token ticketResolvePopup
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const searchData = ticketsData.filter((item) => {
      const searchString = `${item.city} ${item.activated_on}   ${item.deactivated_on}`; // Add more properties as needed
      return searchString.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredData(searchData);
  };

  // Search Filter End
  // Pagenation Start
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Pagenation End

  console.log("selectedStatusArray", selectedStatusArray);

  const getTicketsData = async () => {
    try {
      const { data } = await axios.get(API_TICKETS_GET, config);
      // console.log(data);
      setTicketsData(data.data);
      setLoading(false)
    } catch (error) {
      console.log("error", error);
    }
  };

  function ticketResolvePopupfun() {
    setTicketResolvePopup(!ticketResolvePopup);
  }

  // console.log("selectedItemId", selectedItemId);

  // resolver Form validdation Start
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      resolve_comment: "",
      status: "Resolved",
    },
    validationSchema: Yup.object({
      resolve_comment: Yup.string().required("Comments are Required"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          `${API_TICKETS_RESOLVE}${selectedItemId}/`,
          values,
          config
        );
        console.log(data);
        ticketResolvePopupfun();
        getTicketsData();
        toast.success(`Ticket Resolved successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        toast.error(`Something went wromg`, {
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

  // Acknowledge Form validation Start
  const acknowledgeValidation = useFormik({
    initialValues: {
      status: "Acknowledge",
      acknowledge_date: new Date(),
    },
    validationSchema: Yup.object({
      acknowledge_date: Yup.date().required("Acknowledgement date is required"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          `${API_TICKETS_RESOLVE}${selectedItemId}/`,
          values,
          config
        );
        setAcknowledgePopup(false);
        getTicketsData();
        toast.success(`Acknowledge Added successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        toast.error(`Something went wromg`, {
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
  // Acknowledge Form validation End

  const handleSelectChange = (e, index, item) => {
    const updatedStatusArray = [...selectedStatusArray];
    updatedStatusArray[index] = e.target.value;

    setSelectedStatusArray(updatedStatusArray);
    setSelectedItemId(item.ticket_id);

    if (e.target.value === "Resolved") {
      setSelectedStatus(e.target.value);
      setTicketResolvePopup(true);
    }

    if (e.target.value === "Acknowledge") {
      setSelectedStatus(e.target.value);
      setAcknowledgePopup(true);
    }
  };
  // Update filteredData when searchQuery changes
  useEffect(() => {
    handleSearch();
  }, [searchQuery, ticketsData]);

  useEffect(() => {
    getTicketsData();
  }, []);
  return (
    <>
      <div className="page-content">
 {
  loading=== true ?(<LoaderPage/>):(<>
         <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Tickets</h3>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/*Search filter  */}

          <div className="d-flex mb-3 justify-content-center">
            <input
              className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded "
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
            />
            {searchQuery.length >= 1 ? (
              <Button
                className="btn btn-sm "
                onClick={() => {
                  const input = searchInputRef.current;
                  if (input) {
                    input.select();
                    document.execCommand("cut");
                  }
                }}
              >
                <i className="fas fa-times"></i>
              </Button>
            ) : (
              <Button className=" btn btn-sm " onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </Button>
            )}
          </div>

          {/*  Search filter*/}

          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
                  <div className="table-responsive">
                    <Table className="align-middle ">
                      <thead className="table-light">
                        <tr>
                          <th>Ticket Id</th>
                          <th>Date & Time</th>
                          <th> Customer Name</th>
                          <th> Reason</th>
                          <th> Status</th>
                          <th>Detail</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {((searchQuery ? filteredData : ticketsData) || []).map(
                          (item, index) => (
                            <tr key={item.ticket_id}>
                              <td>{item.ticket_id}</td>
                              <td>
                                {item.ticket_date
                                  ? format(
                                      new Date(item.ticket_date),
                                      "dd-MM-yyyy"
                                    )
                                  : "---"}
                              </td>
                              <td>
                                {item.customer_name}
                                <br />
                                {item.contact_no}
                              </td>
                              <td>{item.reason}</td>
                              {/* <td>
                                {item.status === "Pending" && (
                                  <select
                                    value={selectedStatusArray[index]}
                                    onChange={(e) => {
                                      const updatedStatusArray = [
                                        ...selectedStatusArray,
                                      ];
                                      updatedStatusArray[index] =
                                        e.target.value;

                                      setSelectedStatusArray(
                                        updatedStatusArray
                                      );
                                      setSelectedItemId(item.ticket_id);

                                      // Open the modal if "Resolved" is selected
                                      if (e.target.value === "Resolved") {
                                        setSelectedStatus(e.target.value);
                                        setTicketResolvePopup(true);
                                      }

                                      // Open the AcknowledgePopup modal if "Acknowledge" is selected
                                      if (e.target.value === "Acknowledge") {
                                        setSelectedStatus(e.target.value);
                                        setAcknowledgePopup(true);
                                      }
                                    }}
                                  >
                                    <option value="">Pending</option>
                                    <option value="Acknowledge">
                                      Acknowledge
                                    </option>
                                    <option value="Resolved">Resolved</option>
                                  </select>
                                )}

                                {item.status === "Acknowledge" && (
                                  <select
                                    value={selectedStatusArray[index]}
                                    onChange={(e) => {
                                      const updatedStatusArray = [
                                        ...selectedStatusArray,
                                      ];
                                      updatedStatusArray[index] =
                                        e.target.value;

                                      setSelectedStatusArray(
                                        updatedStatusArray
                                      );
                                      setSelectedItemId(item.ticket_id);

                                      // Open the modal if "Resolved" is selected
                                      if (e.target.value === "Resolved") {
                                        setSelectedStatus(e.target.value);
                                        setTicketResolvePopup(true);
                                      }

                                      // Handle other conditions if needed
                                    }}
                                  >
                                    <option value="">Acknowledge</option>
                                    <option value="Resolved">Resolved</option>
                                  </select>
                                )}
                                {item.status === "Resolved" && (
                                  // Render "Resolved" directly
                                  <span>Resolved</span>
                                )}
                              </td> */}
                              <td>
                                {item.status === "Pending" && (
                                  <Input
                                    type="select"
                                    value={selectedStatusArray[index]}
                                    onChange={(e) =>
                                      handleSelectChange(e, index, item)
                                    }
                                  >
                                    <option value="">Pending</option>
                                    <option value="Acknowledge">
                                      Acknowledge
                                    </option>
                                    <option value="Resolved">Resolved</option>
                                  </Input>
                                )}

                                {item.status === "Acknowledge" && (
                                  <Input
                                    type="select"
                                    value={selectedStatusArray[index]}
                                    onChange={(e) =>
                                      handleSelectChange(e, index, item)
                                    }
                                  >
                                    <option value="">Acknowledge</option>
                                    <option value="Resolved">Resolved</option>
                                  </Input>
                                )}

                                {item.status === "Resolved" && (
                                  <span>Resolved</span>
                                )}
                              </td>
                              <td>
                                {/* Customer comment */}
                                <button
                                  className="btn btn-light border-0"
                                  id={`TooltipCustomerComment${index}`}
                                  onMouseEnter={() =>
                                    setCustomerCommentTooltip(index)
                                  }
                                  onMouseLeave={() =>
                                    setCustomerCommentTooltip(null)
                                  }
                                >
                                  <span className="bx bxs-message"></span>
                                </button>
                                <Tooltip
                                  placement="bottom"
                                  isOpen={customerCommentTooltip === index}
                                  target={`TooltipCustomerComment${index}`}
                                >
                                  <span>
                                    Customer Comment : {item?.comment}
                                  </span>
                                </Tooltip>

                                {/* Resolve comment */}
                                {item?.resolve_comment?.length > 1 && (
                                  <>
                                    <button
                                      className="btn btn-light border-0 ms-3"
                                      id={`TooltipResolveComment${index}`}
                                      onMouseEnter={() =>
                                        setResolveCommentTooltip(index)
                                      }
                                      onMouseLeave={() =>
                                        setResolveCommentTooltip(null)
                                      }
                                    >
                                      <span className="bx bx-message"></span>
                                    </button>
                                    <Tooltip
                                      placement="bottom"
                                      isOpen={resolveCommentTooltip === index}
                                      target={`TooltipResolveComment${index}`}
                                    >
                                      <span>
                                        Resolved Reason : {item.resolve_comment}
                                      </span>
                                    </Tooltip>
                                  </>
                                )}
                                {item.status !== "Resolved" &&
                                  item.acknowledge_date !== null && (
                                    <>
                                      <button
                                        className="btn btn-light border-0 ms-3"
                                        id={`TooltipAcknowledgeDate${index}`}
                                        onMouseEnter={() =>
                                          setAcknowledgeDateTooltip(index)
                                        }
                                        onMouseLeave={() =>
                                          setAcknowledgeDateTooltip(null)
                                        }
                                      >
                                        <span className="bx bx-calendar"></span>
                                      </button>
                                      <Tooltip
                                        placement="bottom"
                                        isOpen={
                                          acknowledgeDateTooltip === index
                                        }
                                        target={`TooltipAcknowledgeDate${index}`}
                                      >
                                        {format(
                                          new Date(item.acknowledge_date),
                                          "dd-MM-yyyy"
                                        )}
                                      </Tooltip>
                                    </>
                                  )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
                <TablePagination
                  className=" d-flex justfy-content-start"
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  component="div"
                  count={ticketsData?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Col>
          </Row>
        </Container>
  </>)
 }

        {/* Popup for ticket Resolved Start */}

        <div>
          <Modal
            isOpen={ticketResolvePopup}
            toggle={() => {
              ticketResolvePopupfun();
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0">
                {" "}
                Ticket No. :{" "}
                <span className="text-primary">#{selectedItemId}</span>{" "}
              </h5>
              <button
                type="button"
                onClick={() => {
                  setTicketResolvePopup(false);
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
                className="needs-validation w-100 "
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Input
                  type="hidden"
                  name="status"
                  value={validation.values.status || ""}
                />
                <FormGroup className="mb-3 ">
                  <Label htmlFor="validationCustom01">
                    Please mention your comments before resolving the ticket.
                  </Label>
                  <Input
                    name="resolve_comment"
                    placeholder="Enter Comment"
                    type="textarea"
                    className="form-control "
                    id="validationCustom01"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.resolve_comment || ""}
                    invalid={
                      validation.touched.resolve_comment &&
                      validation.errors.resolve_comment
                        ? true
                        : false
                    }
                  />
                  {validation.touched.resolve_comment &&
                  validation.errors.resolve_comment ? (
                    <FormFeedback type="invalid">
                      {validation.errors.resolve_comment}
                    </FormFeedback>
                  ) : null}
                </FormGroup>
                <div className="d-flex justify-content-end">
                  <Button color="primary" type="submit">
                    Submit form
                  </Button>
                  <Button
                    color="danger ms-2"
                    onClick={() => {
                      setTicketResolvePopup(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>
        </div>

        {/* Popup for ticket Resolved End */}

        {/* Popup for Acknowledge Start */}
        <Modal
          isOpen={acknowledgePopup}
          toggle={() => setAcknowledgePopup(!acknowledgePopup)}
          centered
          className="modal-dialog-scrollable"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mt-0">
                Acknowledge Ticket No. :{" "}
                <span className="text-primary">#{selectedItemId}</span>
              </h5>
              <button
                type="button"
                onClick={() => setAcknowledgePopup(false)}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form onSubmit={acknowledgeValidation.handleSubmit}>
                <Input
                  type="hidden"
                  name="status"
                  value={validation.values.status || ""}
                />
                <FormGroup className="mb-3">
                  <Label htmlFor="acknowledge_date">Acknowledge Date</Label>
                  <Flatpickr
                    id="acknowledge_date"
                    name="acknowledge_date"
                    className="form-control"
                    value={acknowledgeValidation.values.acknowledge_date}
                    onChange={(date) =>
                      acknowledgeValidation.setFieldValue(
                        "acknowledge_date",
                        date[0]
                      )
                    }
                  />
                  {acknowledgeValidation.touched.acknowledge_date &&
                    acknowledgeValidation.errors.acknowledge_date && (
                      <div className="text-danger">
                        {acknowledgeValidation.errors.acknowledge_date}
                      </div>
                    )}
                </FormGroup>
                <Button color="primary" type="submit">
                  Submit form
                </Button>
              </Form>
            </div>
          </div>
        </Modal>
        {/* Popup for Acknowledge End */}
      </div>
    </>
  );
};

export default Tickets;

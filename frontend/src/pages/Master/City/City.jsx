import React from "react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import "flatpickr/dist/themes/material_red.css";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import * as yup from "yup";
import { format } from "date-fns";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Label,
  FormGroup,
  Input,
  Form,
  FormFeedback,
  Badge,
  InputGroup,
  Alert,
} from "reactstrap";
import { TablePagination } from "@mui/material";
import LoaderPage from "components/Loader/LoaderPage";
import {
  API_CITY_DATE_UPDATE,
  API_CITY_GE,
  API_CITY_GET_POST,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

const City = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [cityData, setcityData] = useState([]);
  const [modal, setModal] = useState(false);
  const [datePikerDeactivatePopup, setDatePikerDeactivatePopup] =
    useState(false);
  const [datePikerActivatePopup, setDatePikerActivatePopup] = useState(false);
  const [selectedDateIdCalender, setSelectedDateIdCalender] = useState();
  const [selectedCityCalender, setSelectedCityCalender] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // const datePikerPopupToggle = () => setDatePikerPopup(!datePikerPopup);

  // Calculate tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const toggle = () => setModal(!modal);

  // Update the datePikerActivatePopupToggle and datePikerDeactivatePopupToggle functions to accept the item object as an argument
  const datePikerActivatePopupToggle = (item) => {
    setSelectedDateIdCalender(item.id);
    setSelectedCityCalender(item.city);
    setDatePikerActivatePopup(!datePikerActivatePopup);
  };

  const datePikerDeactivatePopupToggle = (item) => {
    setSelectedDateIdCalender(item.id);
    setSelectedCityCalender(item.city);
    setDatePikerDeactivatePopup(!datePikerDeactivatePopup);
  };

  //  local storage token Start

  const { config, first_name, last_name } = GetAuthToken();
  //  local storage token End

  // get current date Start
  const currentDate = format(new Date(), "yyyy-MM-dd");
  // get current date End

  const { id } = useParams();
  const validation = useFormik({
    initialValues: {
      city: "",
      checkbox: true,
    },
    validationSchema: yup.object({
      city: yup
        .string()
        .required("City is required")
        .matches(
          /^[a-zA-Z\s]+$/,
          "City should only contain letters and spaces"
        ),
      checkbox: yup.bool(true),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(API_CITY_GET_POST, values, config);
        handleGetCity();
        toast.success(`City added successfully`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        toggle();
        navigate("/master-city");
      } catch (error) {
        console.log(error);
        toast.error(`City must be unique`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });

  const navigate = useNavigate();
  // const navigate = useNavigate()

  const externalCloseBtn = (
    <button
      type="button"
      className="close"
      style={{ position: "absolute", top: "15px", right: "15px" }}
      onClick={toggle}
    >
      &times;
    </button>
  );

  const handleGetCity = async () => {
    try {
      const { data } = await axios.get(API_CITY_GE, config);
      setcityData(data.data);
      setLoading(false);
      // datePikerDeactivatePopupToggle()
    } catch (error) {
      console.log(error);
    }
  };

  // datePiker Disable Start
  const handleDisable = async (id, cityName) => {
    try {
      const url = `${API_CITY_DATE_UPDATE}${id}/`;

      const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");

      const payload = {
        deactivate_on: selectedDateFormatted,
        city: cityName,
      };

      const { data } = await axios.post(url, payload, config);
      handleGetCity();
      datePikerDeactivatePopupToggle(!datePikerDeactivatePopup);
      toast.success(data.message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      // Rest of your code
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
  };
  // datePiker Disable End

  // datePiker Enable Start
  const handleEnable = async (id, cityName) => {
    try {
      const url = `${API_CITY_DATE_UPDATE}${id}/`;

      const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");

      const payload = {
        activate_on: selectedDateFormatted,
        city: cityName,
      };

      const { data } = await axios.post(url, payload, config);
      handleGetCity();
      datePikerActivatePopupToggle(!datePikerActivatePopup);
      toast.success(data.message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      // datePikerActivatePopupToggle();
    } catch (error) {
      console.log(error);

      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };
  // datePiker Disable End

  // Search Filter Start
  // const handleSearch = () => {
  //   const searchData = cityData.filter((item) =>
  //     item.city.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  //   setFilteredData(searchData);
  // };

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const searchData = cityData.filter((item) => {
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

  useEffect(() => {
    handleGetCity();
  }, []);

  useEffect(() => {}, [cityData]);
  useEffect(() => {
    handleSearch();
  }, [searchQuery, cityData]);
  return (
    <>
      <Row>
        <Col xl={12}>
          <Card style={{ marginTop: "100px" }}>
            <CardBody className="d-flex justify-content-between">
              <h3>City</h3>
              <Link to="/master-city">
                <Button color="primary" onClick={toggle}>
                  Add City
                </Button>
              </Link>
            </CardBody>
          </Card>
        </Col>

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

        <Col xl={12}>
          <Card className="pb-5">
            <CardBody>
              <div className="table-responsive">
                {loading == true ? (
                  <LoaderPage />
                ) : (
                  <Table className="align-middle ">
                    <thead className="table-light">
                      <tr>
                        <th>Sr no.</th>
                        <th>City Name</th>
                        <th>Active / Inactive</th>
                        <th>Status</th>
                        <th>Activated On</th>
                        <th>Deactivated On</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody className="">
                      {(searchQuery
                        ? filteredData
                        : cityData &&
                          cityData.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                      ).map((item, index) => (
                        <tr key={item.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.city}</td>
                          <td>
                            <Button
                              color="light"
                              className="delete-button btn btn-sm ms-2"
                              onClick={() => {
                                datePikerActivatePopupToggle(item);
                              }}
                            >
                              <i className="fas fa-calendar-alt text-success fs-5"></i>
                            </Button>
                            <Button
                              color="light"
                              className="delete-button btn btn-sm ms-2"
                              onClick={() => {
                                datePikerDeactivatePopupToggle(item);
                              }}
                            >
                              <i className="fas fa-calendar-alt text-danger fs-5"></i>
                            </Button>
                          </td>
                          <td>
                            {item.is_active === true ? (
                              <Button
                                className="btn-rounded"
                                color="success btn-sm px-3"
                              >
                                Active
                              </Button>
                            ) : (
                              <Button
                                color="danger"
                                className="btn-rounded btn-sm "
                              >
                                In-Active
                              </Button>
                            )}
                          </td>
                          <td>
                            {item.activated_on !== null
                              ? format(
                                  new Date(item.activated_on),
                                  "dd-MM-yyyy"
                                )
                              : "---"}
                          </td>
                          <td>
                            {item.deactivated_on !== null
                              ? format(
                                  new Date(item.deactivated_on),
                                  "dd-MM-yyyy"
                                )
                              : "---"}
                          </td>
                          <td>
                            <Link to={`/master-city-edit/${item.id}`}>
                              <Button
                                className="btn btn-warning btn-sm"
                                size="small"
                              >
                                <i className="fas fa-pencil-alt"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            </CardBody>
            <TablePagination
              className=" d-flex justfy-content-start"
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={cityData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Col>
      </Row>

      <div>
        {/* Model WinDow Start */}
        <Modal isOpen={modal} toggle={toggle} external={externalCloseBtn}>
          <ModalHeader>Add City</ModalHeader>

          <Col xl="12">
            <Card>
              <CardBody>
                <Form
                  className="needs-validation"
                  onSubmit={validation.handleSubmit}
                >
                  <Row className="py-5">
                    <Label for="exampleEmail" className="mt-3" sm={2}>
                      City
                    </Label>
                    <Col sm={10} className="mt-3">
                      <Input
                        name="city"
                        placeholder="City"
                        type="text"
                        className="form-control "
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.city || ""}
                        invalid={
                          validation.touched.city && validation.errors.city
                            ? true
                            : false
                        }
                      />
                      {validation.touched.city && validation.errors.city ? (
                        <FormFeedback type="invalid">
                          {validation.errors.city}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>

                  <ModalFooter>
                    <Button color="primary" type="submit">
                      Add City
                    </Button>
                    <Button color="danger" onClick={toggle}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Modal>
        {/* Model WinDow End */}

        {/* Activate popup Start */}

        <Form>
          <Modal
            isOpen={datePikerActivatePopup}
            toggle={datePikerActivatePopupToggle}
          >
            <ModalHeader toggle={datePikerActivatePopupToggle}>
              Are you sure to Activate{" "}
              <span className="text-danger ms-1">{selectedCityCalender}</span>{" "}
              City
            </ModalHeader>
            <ModalBody>
              <Form className="mb-4">
                <Row>
                  <Label sm={3}>Activate from</Label>
                  <Col sm={7} className="">
                  <InputGroup>
                      <Flatpickr
                        className="form-control d-block"
                        placeholder="dd M,yyyy"
                        options={{
                          altInput: true,
                          altFormat: "F j, Y",
                          dateFormat: "Y-m-d",
                          minDate: tomorrow, // Set minDate to tomorrow
                          onChange: (selectedDates) =>
                            setSelectedDate(selectedDates[0]),
                        }}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => {
                  handleEnable(selectedDateIdCalender, selectedCityCalender);
                }}
              >
                Activate City
              </Button>
              <Button color="danger" onClick={datePikerActivatePopupToggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Form>
        {/* Activate popup End */}

        {/*  Deactivate popup start  */}
        <Form>
          <Modal
            isOpen={datePikerDeactivatePopup}
            toggle={datePikerDeactivatePopupToggle}
          >
            <ModalHeader toggle={datePikerDeactivatePopupToggle}>
              Are you sure to Deactivate
              <span className="text-danger ms-1">
                {selectedCityCalender}
              </span>{" "}
              City
            </ModalHeader>
            <ModalBody>
              <Form className="mb-4">
                <Row>
                  <Label sm={3}>Disable from</Label>
                  <Col sm={7} className="">
                    <InputGroup>
                      <Flatpickr
                        className="form-control d-block"
                        placeholder="dd M,yyyy"
                        options={{
                          altInput: true,
                          altFormat: "F j, Y",
                          dateFormat: "Y-m-d",
                          minDate: tomorrow, // Set minDate to tomorrow
                          onChange: (selectedDates) =>
                            setSelectedDate(selectedDates[0]),
                        }}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => {
                  handleDisable(selectedDateIdCalender, selectedCityCalender);
                }}
              >
                Deactivate City
              </Button>
              <Button color="danger" onClick={datePikerDeactivatePopupToggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Form>
        {/* Deactivate popup End */}
      </div>
    </>
  );
};

export default City;

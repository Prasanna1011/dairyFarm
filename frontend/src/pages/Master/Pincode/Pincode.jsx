import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "flatpickr/dist/themes/material_red.css";
import Flatpickr from "react-flatpickr";

import { format } from "date-fns";
import * as yup from "yup";

// import './GearButton.css';

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Card,
  CardBody,
  Label,
  FormGroup,
  Input,
  Form,
  FormFeedback,
  Row,
  InputGroup,
  Table,
  Badge,
} from "reactstrap";
import { toast } from "react-toastify";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_CITY_GE,
  API_CITY_GET_POST,
  API_PINCODE_DATE_UPDATE,
  API_PINCODE_GET_POST,
  API_PINCODE_UPDATE,
} from "customhooks/All_Api/Apis";

import LoaderPage from "components/Loader/LoaderPage";
const Pincode = () => {
  const [loading, setLoading] = useState(true);

  const [selectedCity, setSelectedCity] = useState([]);
  const [pincodeData, setPincodeData] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState();
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");

  const [selectedPincodeId, setSelectedPincodeId] = useState();
  const [selectedDate, setSelectedDate] = useState(null);

  //
  const [editModal, setEditModal] = useState(false);
  const [pincodeDisableModal, setPincodeDisableModal] = useState(false);
  const [pincodeEnableModal, setPincodeEnableModal] = useState(false);

  // Calculate tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);


  const pincodeDisabletoggle = () =>
    setPincodeDisableModal(!pincodeDisableModal);
  const pincodeEnabletoggle = () => setPincodeEnableModal(!pincodeEnableModal);

  const editToggle = () => setEditModal(!editModal);

  //

  const url = API_PINCODE_GET_POST;

  // Local storage token Start

  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  const validation = useFormik({
    initialValues: {
      city: "",
      pincode: "",
    },
    validationSchema: yup.object({
      city: yup.string().required("City is required"),
      pincode: yup
        .string()
        .required("Pincode is required")
        .matches(/^\d{6}$/, "Code must be exactly 6 digits long"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(url, values, config);
        toggle();
        getPincodeData();
        toast.success(`Pincode added successfully`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        console.log(error);
        toast.error(`Pincode must be unique`, {
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

  // validation for edit pincode starttt
  const formik = useFormik({
    initialValues: {
      pincode: "",
    },
    validationSchema: yup.object({
      pincode: yup
        .string()
        .required("Pincode is required")
        .matches(/^\d{6}$/, "Code must be exactly 6 digits long"),
    }),
    onSubmit: () => {
      handleEditPincode(formik.values, selectedPincodeId);
    },
  });
  const handleEditPincode = async (values, selectedPincodeId) => {
    try {
      const response = await axios.post(
        `${API_PINCODE_UPDATE}${selectedPincodeId}/`,
        { pincode: values.pincode, city: selectedCityId },
        config
      );
      getPincodeData();
      editToggle();
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

  // validation for edit pincode End

  // datePiker Disable Start
  const handleDisable = async () => {
    try {
      const url = `${API_PINCODE_DATE_UPDATE}${selectedPincodeId}/`;

      const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");
      const { data } = await axios.post(
        url,
        {
          deactivate_on: selectedDateFormatted,
          city: selectedCityId,
          pincode: selectedPincode,
        },
        config
      );

      getPincodeData();
      handleGetCity();
      pincodeDisabletoggle();

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

  // datePiker Enable Start
  const handleEnable = async () => {
    try {
      const url = `${API_PINCODE_DATE_UPDATE}${selectedPincodeId}/`;

      const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");

      const { data } = await axios.post(
        url,
        {
          activate_on: selectedDateFormatted,
          city: selectedCityId,
          pincode: selectedPincode,
        },
        config
      );

      handleGetCity();
      getPincodeData();
      pincodeEnabletoggle();

      toast.success(data.message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      
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

  // datePiker Enable End

  const toggle = () => setModal(!modal);
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
  setSelectedCity(data.data);
  setLoading(false);
} catch (error) {
  console.log(error);
}
  };

  const getPincodeData = async () => {
    const { data } = await axios.get(url, config);
    setPincodeData(data.data);
  };
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
    getPincodeData();
    handleGetCity();
  }, []);

  return (
    <React.Fragment>
      <Col xl="12" style={{ marginTop: "100px" }}>
        <Col xl={12}>
          <Card style={{ marginTop: "100px" }}>
            <CardBody className="d-flex justify-content-between">
              <h3>Pincode</h3>
              <Link to="/master-pincode">
                <Button color="primary" onClick={toggle}>
                  Add Pincode
                </Button>
                <Button color="primary ms-1">
                  <i className="dripicons-view-thumb"></i>
                </Button>
              </Link>
            </CardBody>
          </Card>
        </Col>
      </Col>

 

     
{
  loading== true ?(<LoaderPage/>):(
    <>
     <Card className="mb-5">
        <CardBody>
          <div className="table-responsive">
            <Table className="table mb-0">
              <thead>
                <tr>
                  <th>City</th>
                  <th>Pincode</th>
                  <th>Active / Inactive</th>
                  <th>Status</th>
                  <th>Activated On</th>
                  <th>Deactivated On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pincodeData &&
                  pincodeData.map((cityItem) =>
                    cityItem.pincodes.map((item, index) => (
                      <tr key={item.id}>
                        {index === 0 && (
                          <td
                            className="border-end"
                            rowSpan={cityItem.pincodes.length}
                          >
                            <h5>
                              <b>{cityItem.name}</b>
                            </h5>
                            <span>
                              Total Pincode = {cityItem.pincodes.length}
                            </span>
                          </td>
                        )}
                        <td>{item.code}</td>

                        <td>
                          <Button
                            color="light"
                            className="delete-button btn btn-sm "
                            onClick={() => {
                              pincodeEnabletoggle(
                                setSelectedPincodeId(item.id),
                                setSelectedPincode(item.code),
                                setSelectedCityName(item.city),
                                setSelectedCityId(item.city_id)
                              );
                           
                            }}
                          >
                            <i className="fas fa-calendar-alt text-success fs-5"></i>
                          </Button>
                          <Button
                            color="light"
                            onClick={() => {
                              pincodeDisabletoggle(
                                setSelectedPincodeId(item.id),
                                setSelectedPincode(item.code),
                                setSelectedCityName(item.city),
                                setSelectedCityId(item.city_id)
                              );
                              
                            }}
                          >
                            <i className="fas fa-calendar-alt text-danger fs-5"></i>
                          </Button>
                        </td>
                        <td>
                            {item.is_active=== true ?<Button className="btn-rounded" color="success btn-sm px-3">Active</Button> :<Button color="danger" className="btn-rounded btn-sm ">In-Active</Button> }
                          </td>
                        <td>
                          {item.activate_on !== null
                            ? format(new Date(item.activate_on), "dd-MM-yyyy")
                            : "---"}
                        </td>
                        <td>
                          {item.deactivate_on !== null
                            ? format(new Date(item.deactivate_on), "dd-MM-yyyy")
                            : "---"}
                        </td>

                        <td>
                          <Button
                            className="edit-button btn btn-sm btn-warning"
                            // onClick={editToggle}
                            onClick={() => {
                              editToggle(
                                setSelectedPincodeId(item.id),
                                setSelectedPincode(item.code),
                                setSelectedCityName(item.city),
                                setSelectedCityId(item.city_id)
                              );
                             
                            }}
                          >
                            <i className="fas fa-pen"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </>
  )
}


           {/* Modal Window Start */}
           <Modal isOpen={modal} toggle={toggle} external={externalCloseBtn}>
        <ModalHeader>Add Pincode</ModalHeader>
        <Col xl="12">
          <Card>
            <CardBody>
              <Form
                className="needs-validation"
                onSubmit={validation.handleSubmit}
              >
                <Row>
                  <Label for="exampleEmail" className="mt-3" sm={2}>
                    City
                  </Label>
                  <Col sm={10} className="mt-3">
                    <div className="input-group">
                      <select
                        className="form-select"
                        id="inputGroupSelect04"
                        aria-label="Example select with button addon"
                        {...validation.getFieldProps("city")}
                      >
                        <option value="">Choose City</option>
                        {selectedCity &&
                          selectedCity.map((item, index) => {
                            if (item.is_active === true) {
                              return (
                                <option
                                  key={`${item?.id} ${index}`}
                                  value={item?.id}
                                >
                                  {item?.city}
                                </option>
                              );
                            } else {
                              return null;
                            }
                          })}
                      </select>
                    </div>
                    {validation.touched.city && validation.errors.city && (
                      <div className="invalid-feedback">
                        {validation.errors.city}
                      </div>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Label for="exampleEmail" className="mt-3" sm={2}>
                    Pincode
                  </Label>
                  <Col sm={10} className="my-3">
                    <Input
                      name="pincode"
                      placeholder="pincode"
                      type="number"
                      className="form-control"
                      {...validation.getFieldProps("pincode")}
                      invalid={
                        validation.touched.pincode && validation.errors.pincode
                      }
                    />
                    {validation.touched.pincode &&
                      validation.errors.pincode && (
                        <div className="invalid-feedback">
                          {validation.errors.pincode}
                        </div>
                      )}
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
      {/* Modal Window End */}

      {/* Edit  Pincode Modal Popup start  */}

      <div>
        <Modal isOpen={editModal} toggle={editToggle}>
          <ModalHeader toggle={editToggle}>Modal title</ModalHeader>
          <ModalBody>
            <h5>
              You have selected pincode:
              <span className="text-danger">{selectedPincode}</span> in
              <span className="text-danger ms-1">{selectedCityName}</span>{" "}
              <br /> Be careful to edit Pincode
            </h5>
            <br />
            <form onSubmit={formik.handleSubmit}>
              <Row>
                <Col md="6">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom01">Pincode</Label>
                    <Input
                      name="pincode"
                      placeholder="Pincode"
                      type="text"
                      className="form-control"
                      id="pincode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.pincode}
                      invalid={formik.touched.pincode && formik.errors.pincode}
                    />
                    {formik.touched.pincode && formik.errors.pincode && (
                      <FormFeedback type="invalid">
                        {formik.errors.pincode}
                      </FormFeedback>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <Button color="primary" type="submit">
                Save Changes
              </Button>
            </form>
          </ModalBody>
        </Modal>
      </div>

      {/* Edit  Pincode Modal Popup End  */}

      {/* Pincode Disable Modal Popup  start */}

      <div>
        <Modal isOpen={pincodeDisableModal} toggle={pincodeDisabletoggle}>
          <ModalHeader toggle={pincodeDisabletoggle}>
            Disable <b>{selectedPincode}</b>
          </ModalHeader>
          <ModalBody>
            <p>
              <b>
                System will stop the new orders from mentioned date. <br />
                selected Pincode is{" "}
                <span className="text-danger">{selectedPincode}</span>
              </b>
            </p>
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
          </ModalBody>
          <ModalFooter>
            <Button color="primary" className="px-3" onClick={handleDisable}>
              Disable
            </Button>

            <Button
              color="danger"
              className="px-3"
              onClick={() => {
                pincodeDisabletoggle();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      {/* Pincode Disable Modal Popup End */}

      {/* Pincode Enable Modal Popup  start */}

      <div>
        <Form>
          <Modal isOpen={pincodeEnableModal} toggle={pincodeEnabletoggle}>
            <ModalHeader toggle={pincodeEnabletoggle}>
              Enable <b>{selectedPincode}</b>
            </ModalHeader>
            <ModalBody>
              <p>
                <b>
                  System will start the new orders from mentioned date. <br />
                  selected Pincode is{" "}
                  <span className="text-danger">{selectedPincode}</span>
                </b>
              </p>
              <Row>
                <Label sm={4}>Deactivate from</Label>
                <Col sm={6} className="">
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
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                className="px-3"
                onClick={() => {
                  handleEnable();
                }}
              >
                Enable
              </Button>
              <Button
                color="danger"
                className="px-3"
                onClick={() => {
                  pincodeEnabletoggle();
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Form>
      </div>

      {/* Pincode Enable Modal Popup End */}
    </React.Fragment>
  );
};

export default Pincode;

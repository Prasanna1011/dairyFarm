import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import "flatpickr/dist/themes/material_red.css";
import Flatpickr from "react-flatpickr";
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
  Table,
  Badge,
  InputGroup,
} from "reactstrap";
import { toast } from "react-toastify";
import { format } from "date-fns";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_AREA_DATE_UPDATE,
  API_AREA_GET_POST,
  API_AREA_UPDATE,
  API_PINCODE_GET_POST,
} from "customhooks/All_Api/Apis";
import LoaderPage from "components/Loader/LoaderPage";

const Area = () => {
  const [loading, setLoading] = useState(true);
  const [getPincodeData, setGetPincodeData] = useState([]);
  const [areaAllData, setAreaAllData] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedArea, setSelectedArea] = useState();
  const [selectedPincodeId, setSelectedPincodeId] = useState();
  const [selectedAreaName, setSelectedAreaName] = useState();
  const [selectedAreaId, setSelectedAreaId] = useState();

  const [areaDisableModal, setAreaDisableModal] = useState(false);
  const [areaEnableModal, setAreaEnableModal] = useState(false);
  const [editModal, setEditModal] = useState(false);



    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
  
  // modal popus start

  const areaEnabletoggle = () => setAreaEnableModal(!areaEnableModal);
  const areaDisabletoggle = () => setAreaDisableModal(!areaDisableModal);

  const editToggle = () => setEditModal(!editModal);
  // modal popus End



  const validation = useFormik({
    initialValues: {
      pincode_id: "",
      area_name: "",
    },
    validationSchema: yup.object({
      pincode_id: yup.string().required("Pincode is required"),
      area_name: yup
        .string()
        .required("Area name is required")
        .matches(
          /^[A-Za-z\s]+$/,
          "Area name cannot contain numbers or special characters"
        ),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(API_AREA_GET_POST, values, config);
        toggle();
        getAreaData();
        toast.success(`Area added successfully`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        console.log(error);
        toast.error(`Area must be unique`, {
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

  //  local storage token Start

  const { config, first_name, last_name } = GetAuthToken();

  //  local storage token End

  const toggle = () => setModal(!modal);

  // function for geting Pincode Data Start
  const handleGetPincode = async () => {
    try {
      const { data } = await axios.get(API_PINCODE_GET_POST, config);
      setGetPincodeData(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pincode:", error);
    }
  };
  // function for geting Pincode Data End

  // function for get area Data Start
  const getAreaData = async () => {
    const { data } = await axios.get(API_AREA_GET_POST, config);
    setAreaAllData(data.data);
  };
  // function for get area Data End

  // datePiker Disable Start
  const handleDisable = async () => {
    try {
      const url = `${API_AREA_DATE_UPDATE}${selectedAreaId}/`;

      const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");
      const { data } = await axios.post(
        url,
        {
          deactivate_on: selectedDateFormatted,
          pincode_id: selectedPincodeId,
          area_name: selectedAreaName,
        },
        config
      );

      getAreaData();
      areaDisabletoggle();
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
      const url = `${API_AREA_DATE_UPDATE}${selectedAreaId}/`;

      const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");
      const { data } = await axios.post(
        url,
        {
          activate_on: selectedDateFormatted,
          pincode_id: selectedPincodeId,
          area_name: selectedAreaName,
        },
        config
      );
      areaEnabletoggle();
      getAreaData();

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

  // datePiker Enable End

  // Area Edit Start

  // validation for edit pincode starttt
  const formik = useFormik({
    initialValues: {
      area_name: "",
    },
    validationSchema: yup.object({
      area_name: yup
        .string()
        .required("Area name is required")
        .matches(
          /^[A-Za-z\s]+$/,
          "Area name cannot contain numbers or special characters"
        ),
    }),
    onSubmit: (values) => {
      handleEditArea(values, selectedAreaId);
    },
  });

  const handleEditArea = async (values, selectedAreaId) => {
    try {
      const response = await axios.post(
        `${API_AREA_UPDATE}${selectedAreaId}/`,
        { area_name: values.area_name, pincode_id: selectedPincodeId },
        config
      );
      getAreaData();
      editToggle(null, null, null); // Resetting the selected values
      toast.success("Pincode Edited successfully", {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.log("Error:", error);
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };
  // validation for edit pincode End
  // Area Edit End

  useEffect(() => {
    handleGetPincode();
    getAreaData();
  }, []);
  return (
    <React.Fragment>
      {
        loading === true ?(
          <LoaderPage/>
        ):(
          <Col xl="12" style={{ marginTop: "100px" }}>
        <Col xl={12}>
          <Card style={{ marginTop: "100px" }}>
            <CardBody className="d-flex justify-content-between">
              <h3>Area</h3>
              <Button color="primary" onClick={toggle}>
                Add Area
              </Button>
            </CardBody>
          </Card>
        </Col>
        {/* Table for showind Data Start */}
        <Card className="mb-5">
          <CardBody>
            <div className="table-responsive">
              <Table className="table mb-0">
                <thead>
                  <tr>
                    <th> Pincode</th>
                    <th>Area's</th>
                    <th>Active / Inactive</th>
                    <th>Status</th>
                    <th>Activated On</th>
                    <th>Deactivated On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {areaAllData &&
                    areaAllData.map((cityItem) =>
                      cityItem.areas.map((item, index) => (
                        <tr key={item.id}>
                          {index === 0 && (
                            <td
                              className="border-end"
                              rowSpan={cityItem.areas.length}
                            >
                              <h5>
                                <b>{cityItem.code}</b>
                              </h5>
                              <span>
                                Total Pincode = {cityItem.areas.length}
                              </span>
                            </td>
                          )}
                          <td>{item.area}</td>
                      

<td>
                            <Button
                              color="light"
                              className="delete-button btn btn-sm "
                             
                              onClick={() => {
                                areaEnabletoggle(
                                  setSelectedPincodeId(item.pincode_id),
                                  setSelectedAreaName(item.area),
                                  setSelectedAreaId(item.id)
                                );
                              }}
                            >
                              <i className="fas fa-calendar-alt text-success fs-5"></i>
                            </Button>
                            <Button
                              color="light"
                              className="delete-button btn btn-sm ms-2"
                              onClick={() => {
                                areaDisabletoggle(
                                  setSelectedPincodeId(item.pincode_id),
                                  setSelectedAreaName(item.area),
                                  setSelectedAreaId(item.id)
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
                            {/* {item.deactivated_on } */}
                          </td>

                          <td>
                            <Button
                              className="edit-button btn btn-sm btn-warning"
                              onClick={() => {
                                editToggle(
                                  setSelectedPincodeId(item.pincode_id),
                                  setSelectedAreaName(item.area),
                                  setSelectedAreaId(item.id)
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
        {/* Table for showind Data End */}
      </Col>
        )
      }
      {/* Modal Window Start for Add Area */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>Add Area</ModalHeader>
        <Col xl="12">
          <Card>
            <CardBody>
              <Form
                className="needs-validation"
                onSubmit={validation.handleSubmit}
              >
                <Row>
                  <Label for="exampleEmail" className="mt-3" sm={2}>
                    Pincode
                  </Label>
                  <Col sm={10} className="mt-3">
                    <div className="input-group">
                      <select
                        className="form-select"
                        id="inputGroupSelect04"
                        name="pincode_id"
                        aria-label="Example select with button addon"
                        {...validation.getFieldProps("pincode_id")} // Use "pincode_id" instead of "city"
                      >
                        <option value="">Choose pincode</option>
                        {/* {Object.keys(getPincodeData).map((city) =>
                          getPincodeData[city].map((item) => (
                            <option key={item.id} value={item.id}>
                              <b>{item.code}</b> - {item.city}
                            </option>   
                          ))

                        
                        )} */}
                        {getPincodeData.map((item) =>
                          item.pincodes.map((items) => (
                            <>
                              <option key={items.id} value={items.id}>
                                <b>{items.code}</b> - {items.city}
                              </option> 
                            </>
                          ))
                        )}
                      </select>
                    </div>
                    {validation.touched.pincode_id &&
                      validation.errors.pincode_id && (
                        <div className="invalid-feedback">
                          {validation.errors.pincode_id}
                        </div>
                      )}
                  </Col>
                </Row>
                <Row>
                  <Label for="exampleEmail" className="mt-3" sm={2}>
                    Area
                  </Label>
                  <Col sm={10} className="my-3">
                    <Input
                      name="area_name"
                      placeholder="Add Area"
                      type="text"
                      className="form-control"
                      {...validation.getFieldProps("area_name")} // Use "area_name" instead of "pincode"
                      invalid={
                        validation.touched.area_name &&
                        validation.errors.area_name
                      }
                    />
                    {validation.touched.area_name &&
                      validation.errors.area_name && (
                        <div className="invalid-feedback">
                          {validation.errors.area_name}
                        </div>
                      )}
                  </Col>
                </Row>

                <ModalFooter>
                  <Button color="primary" type="submit">
                    Add Area
                  </Button>
                  <Button color="secondary" onClick={toggle}>
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

      {/* Area Enable Modal Popup  start */}

      <div>
        <Form>
          <Modal isOpen={areaEnableModal} toggle={areaEnabletoggle}>
            <ModalHeader toggle={areaEnabletoggle}> Enable  <b>{selectedAreaName}</b></ModalHeader>
            <ModalBody>
              <p>
                <b>
                  System will start the new orders from mentioned date. <br />
                  You are selected Area is
                  <span className="text-danger ms-1">{selectedAreaName}</span>
                  <span className="text-danger">{/* {selectedPincode} */}</span>
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
                  areaEnabletoggle();
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Form>
      </div>

      {/* Area Enable Modal Popup End */}

      {/* Area Disable Modal Popup Start */}

      <div>
        <Modal isOpen={areaDisableModal} toggle={areaDisabletoggle}>
          <ModalHeader toggle={areaDisabletoggle}>Disable <b className="">{selectedAreaName}</b> </ModalHeader>
          <ModalBody>
            <p>
              <b>
                System will stop the new orders from mentioned date. <br />
                You are selected Area is{" "}
                <span className="text-danger">{selectedAreaName}</span>
                <span className="text-danger">{/* {selectedPincode} */}</span>
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
            <Button color="primary" 
            
            className="px-3"
            onClick={handleDisable}>
              Disable
            </Button>
            <Button
                color="danger"
                className="px-3"
                onClick={() => {
                  areaDisabletoggle();
                }}
              >
                Cancel
              </Button>
          </ModalFooter>
        </Modal>
      </div>

      {/* Area Disable Modal Popup End */}

      {/* Edit  Area Modal Popup start  */}

      <div>
        <Modal isOpen={editModal} toggle={editToggle}>
          <ModalHeader toggle={editToggle}>Edit Pincode</ModalHeader>
          <ModalBody>
            <h5>
              You have selected Area:
              <span className="text-danger ms-2">{selectedAreaName}</span>
              <br /> Be careful to edit Area
            </h5>
            <br />
            <form onSubmit={formik.handleSubmit}>
              <Row>
                <Col md="6">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom01">Area</Label>
                    <Input
                      name="area_name"
                      placeholder="Area Name"
                      type="text"
                      className="form-control"
                      id="area_name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.area_name}
                      invalid={
                        formik.touched.area_name && formik.errors.area_name
                      }
                    />
                    {formik.touched.area_name && formik.errors.area_name && (
                      <FormFeedback type="invalid">
                        {formik.errors.area_name}
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

      {/* Edit  Area Modal Popup End  */}
    </React.Fragment>
  );
};

export default Area;
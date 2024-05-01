import React, { useState, useEffect } from "react";

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
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_CITY_GE,
  API_CITY_GET_POST,
  API_CWH_GET_POST,
  API_FARM_GET_POST,
  API_HUB_ADD_GET,
  API_HUB_GET_BY_ID_AND_UPDATE,
  API_HUB_GET_BY_ID_AND_UPDATE_NEW,
  API_HUB_GET_UNASSIGNED_DELIVERY_BOYS,
  API_HUB_GET_UNASSIGNED_PINCODES,
  API_USER_POST_GET,
} from "customhooks/All_Api/Apis";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditHubList = () => {
  const [cityNames, setCityNames] = useState([]);
  const [CWHNData, setCWHNData] = useState([]);
  const [hubManager, setHubManager] = useState([]);
  const [hubData, setHubData] = useState([]);
  const [unAssignedDeliveryBoys, setunAssignedDeliveryBoys] = useState([]);
  const [unAssignedPincodes, setUnAssignedPincodes] = useState([]);
  const [selectedHubCity, setSelectedHubCity] = useState(hubData?.city);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [pincodesJoind, setPincodesJoind] = useState([]);
  const [deliveryBoysJoind, setDeliveryBoysJoind] = useState([]);

  const { id } = useParams();

  console.log("selectedHubCity", selectedHubCity);
  console.log("hubData", hubData.city);
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  const navigate = useNavigate();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: hubData?.name || "",
      address: hubData?.address || "",
      city: hubData?.city || "",
      cwh: hubData?.cwh?.id || "",
      hub_manager: hubData?.hub_manager?.first_name || "", // Update to first_name based on the provided response
      is_active: hubData?.is_active || false,
      delivery_pincodes:
        hubData?.assigned_pincodes?.map((item) => item?.id) || [],
      delivery_boys:
        hubData?.assigned_delivery_boys?.map((boy) => boy?.delivery_boy_id) ||
        [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Farm Name"),
      address: Yup.string().required("Please Enter Farm address"),
      cwh: Yup.string().required("Please Select Central Wearhouse"),
      city: Yup.string().required("Please Select Hub City"),
      hub_manager: Yup.string(),
      delivery_pincodes: Yup.array()
        .min(1, "Please Select at least one Delivery Pincode")
        .required("Please Select at least one Delivery Pincode"),
      delivery_boys: Yup.array()
        .min(1, "Please Select at least one Delivery Boy")
        .required("Please Select at least one Delivery Boy"),
      is_active: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        console.log(values);

        const { data } = await axios.post(
          `${API_HUB_GET_BY_ID_AND_UPDATE}${id}/`,
          values,
          config
        );
        console.log(data.data);
        toast.success(`Hub added successfully`, {
          position: "top-center",
          autoClose: 4000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/hub-list");
      } catch (error) {
        console.log(error);
        toast.error(`Something Went Wrong`, {
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

  //   Fetch City List Start
  const fetchCityData = async () => {
    try {
      const { data } = await axios.get(API_CITY_GE, config);
      setCityNames(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  //   Fetch City List End

  //   Fetch CWH List Start
  const fetchCWHData = async () => {
    try {
      const { data } = await axios.get(API_CWH_GET_POST, config);
      setCWHNData(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  //   Fetch CWH List End

  //   Fetch Data For User list  Start
  const FetchUsersData = async () => {
    try {
      const { data } = await axios.get(API_USER_POST_GET, config);
      setHubManager(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const filteredHUBManagersData = hubManager?.filter(
    (user) => user.department_type_name === "Hub"
  );
  //   Fetch Data For User list  End

  //   Fetch Data ById of HUB  Start
  const FetchHubByIdtData = async () => {
    try {
      const { data } = await axios.get(
        `${API_HUB_GET_BY_ID_AND_UPDATE_NEW}${id}`,
        config
      );
      setHubData(data);
    } catch (error) {
      console.log(error);
    }
  };
  //   Fetch Data ById of HUB  End

  const getUnassignedDeliveryBoys = async () => {
    const { data } = await axios.get(
      API_HUB_GET_UNASSIGNED_DELIVERY_BOYS,
      config
    );
    setunAssignedDeliveryBoys(data);
    console.log(unAssignedDeliveryBoys);
  };

  const getUnassignedPincodes = async () => {
    try {
      const { data } = await axios.get(
        `${API_HUB_GET_UNASSIGNED_PINCODES}${hubData?.city}`,
        config
      );
      setUnAssignedPincodes(data);
      console.log(data); // Log the updated data, not unAssignedDeliveryBoys
    } catch (error) {
      console.error("Error fetching unassigned pincodes:", error);
    }
  };

  useEffect(() => {
    getUnassignedPincodes();
  }, [selectedHubCity, validation?.values?.city]);

  useEffect(() => {
    fetchCityData();
    fetchCWHData();
    FetchUsersData();
    getUnassignedDeliveryBoys();
    FetchHubByIdtData();
  }, []);

  useEffect(() => {
    const joinedDeliveryBoys = [
      ...(hubData?.assigned_delivery_boys || []),
      ...unAssignedDeliveryBoys,
    ].map((item) => ({
      delivery_boy_id: item.delivery_boy_id,
      first_name: item.first_name,
      last_name: item.last_name,
    }));

    setDeliveryBoysJoind(joinedDeliveryBoys);
  }, [hubData, unAssignedDeliveryBoys]);

  console.log("deliveryBoysJoind", deliveryBoysJoind);

  useEffect(() => {
    const joinedPincode = [
      ...((hubData && hubData?.assigned_pincodes) || []),
      ...unAssignedPincodes,
    ].map((item) => ({
      id: item?.id,
      code: item?.code,
    }));

    setPincodesJoind(joinedPincode);
  }, [hubData, unAssignedPincodes]);
  console.log("deliveryBoysJoind", deliveryBoysJoind);

  console.log(
    "validation.values.delivery_pincodes",
    validation.values.delivery_pincodes[0]
  );

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3> Edit Hub Details </h3>
                </CardBody>
              </Card>
            </Col>
          </Row>
        
          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <Form
                    className="needs-validation"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                    }}
                  >
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label>Hub Name</Label>
                          <Input
                            name="name"
                            placeholder="Enter Hub Name"
                            type="text"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.name || ""}
                            invalid={
                              validation.touched.name && validation.errors.name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.name && validation.errors.name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="address">Hub Address</Label>
                          <Input
                            name="address"
                            placeholder="Enter Hub Address"
                            type="text"
                            className="form-control"
                            id="address"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.address || ""}
                            invalid={
                              validation.touched.address &&
                              validation.errors.address
                                ? true
                                : false
                            }
                          />
                          {validation.touched.address &&
                          validation.errors.address ? (
                            <FormFeedback type="invalid">
                              {validation.errors.address}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="city">Hub City</Label>
                          <Input
                            name="city"
                            placeholder="Select hub city"
                            type="select"
                            className="form-control"
                            onChange={(e) => {
                              validation.handleChange(e);
                            }}
                            onBlur={validation.handleBlur}
                            value={validation.values.city || ""}
                            invalid={
                              validation.touched.city && validation.errors.city
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Hub City .. </option>
                            {cityNames.map((item) => (
                              <option key={item.id} value={item.id}>
                                <b>{item.city}</b>
                              </option>
                            ))}
                          </Input>
                          {validation.touched.city && validation.errors.city ? (
                            <FormFeedback type="invalid">
                              {validation.errors.city}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="hub_manager">Hub Manager</Label>
                          <Input
                            name="hub_manager"
                            placeholder="enter farm manager "
                            type="select"
                            className="form-control"
                            id="hub_manager"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.hub_manager || ""}
                            invalid={
                              validation.touched.hub_manager &&
                              validation.errors.hub_manager
                                ? true
                                : false
                            }
                          >
                            <option value="">Hub Manager </option>
                            {filteredHUBManagersData.map((item) => (
                              <option
                                key={item.milkmor_user_id}
                                value={item.milkmor_user_id}
                              >
                                <b>
                                  {item.first_name}
                                  {item.last_name}
                                </b>
                              </option>
                            ))}
                          </Input>

                          {validation.touched.hub_manager &&
                          validation.errors.hub_manager ? (
                            <FormFeedback type="invalid">
                              {validation.errors.hub_manager}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="cwh">Central Wearhouse</Label>
                          <Input
                            name="cwh"
                            placeholder="Enter Central Wearhouse "
                            type="select"
                            className="form-control"
                            id="cwh"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.cwh || ""}
                            invalid={
                              validation.touched.cwh && validation.errors.cwh
                                ? true
                                : false
                            }
                          >
                            <option value="">Select CWH .. </option>
                            {CWHNData.map((item) => (
                              <option key={item?.id} value={item?.id}>
                                <b>{item?.name}</b>
                              </option>
                            ))}
                          </Input>
                          {validation.touched.cwh && validation.errors.cwh ? (
                            <FormFeedback type="invalid">
                              {validation.errors.cwh}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="is_active">CWH Status</Label>
                          <Input
                            name="is_active"
                            type="checkbox"
                            className="form-control ms-2"
                            id="is_active"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            checked={validation.values.is_active}
                            invalid={
                              validation.touched.is_active &&
                              validation.errors.is_active
                            }
                            onClick={() => {
                              validation.setFieldValue(
                                "is_active",
                                !validation.values.is_active // Toggle the value of is_active
                              );
                            }}
                          />
                          {validation.touched.is_active &&
                          validation.errors.is_active ? (
                            <FormFeedback type="invalid">
                              {validation.errors.is_active}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className="border-top">
                      <h5 className="pt-2 pb-3">Service Details:</h5>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="delivery_pincodes">
                            Delivery Pincode
                          </Label>
                          <Select
                            name="delivery_pincodes"
                            placeholder="Select Delivery Pincode"
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={
                              pincodesJoind &&
                              pincodesJoind?.map((item) => ({
                                value: item.id,
                                label: item.code,
                              }))
                            }
                            onChange={(selectedOptions) => {
                              console.log("selectedOptions", selectedOptions);
                              validation.handleChange({
                                target: {
                                  name: "delivery_pincodes",
                                  value: selectedOptions
                                    ? selectedOptions.map(
                                        (option) => option.value
                                      )
                                    : [],
                                },
                              });
                            }}
                            onBlur={validation?.handleBlur}
                            isMulti
                            value={
                              validation?.values.delivery_pincodes?.map(
                                (value) => ({
                                  value,
                                  label:
                                    pincodesJoind &&
                                    pincodesJoind?.find(
                                      (item) => item.id == value
                                    )?.code,
                                })
                              ) || []
                            }
                          />

                          {validation.values.delivery_pincodes.length === 0 ? (
                            <span className="text-danger">
                              Please select Delivery Pincode
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="delivery_boys">Delivery Boys</Label>
                          <Select
                            name="delivery_boys"
                            placeholder="Select Delivery Boy"
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={
                              deliveryBoysJoind &&
                              deliveryBoysJoind?.map((item) => ({
                                value: item?.delivery_boy_id,
                                label: `${item?.first_name} ${item?.last_name}`,
                              }))
                            }
                            onChange={(selectedOptions) => {
                              validation.handleChange({
                                target: {
                                  name: "delivery_boys",
                                  value: selectedOptions
                                    ? selectedOptions.map(
                                        (option) => option.value
                                      )
                                    : [],
                                },
                              });
                              console.log("selectedOptions", selectedOptions);
                            }}
                            onBlur={validation.handleBlur}
                            isMulti
                            value={
                              validation.values.delivery_boys.map((value) => ({
                                value,
                                label:
                                  deliveryBoysJoind &&
                                  deliveryBoysJoind?.find(
                                    (boy) => boy.delivery_boy_id === value
                                  )?.first_name +
                                    " " +
                                    deliveryBoysJoind &&
                                  deliveryBoysJoind?.find(
                                    (boy) => boy.delivery_boy_id === value
                                  )?.last_name,
                              })) || []
                            }
                          />

                          {validation.values.delivery_boys.length === 0 ? (
                            <span className="text-danger">
                              Please select Delivery Boys
                            </span>
                          ) : (
                            ""
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Button className="mt-3" color="primary" type="submit">
                      Submit form
                    </Button>

                    <Link to={"/hub-list"}>
                      <Button className="mt-3 ms-3" color="secondary ">
                        Cancel
                      </Button>
                    </Link>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default EditHubList;

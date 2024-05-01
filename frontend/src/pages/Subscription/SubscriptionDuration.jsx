import React, { useState, useEffect } from "react";
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
  CardTitle,
  Modal,
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import axios from "axios";
import {
  API_SUBSCRIPTION_UPDATE,
  API_TRIAL_PLAN_AND_SUBSCRIPTION_GET,
  API_TRIAL_PLAN_UPDATE,
} from "customhooks/All_Api/Apis";
import { toast } from "react-toastify";
const SubscriptionDuration = () => {
  const [trialData, setTrialData] = useState([]);
  const [trialPlanId, setTrialPlanId] = useState([]);
  const [editTrialPlanModal, seteditTrialPlanModal] = useState(false);

  //
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [selectedSubscriptionPlanID, setSelectedSubscriptionPlanID] =
    useState(false);
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  console.log("selectedSubscriptionPlanID", selectedSubscriptionPlanID);

  // Form validation for trial Days
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      days: trialData.days || "",
      is_active: trialData.is_active || false,
    },
    validationSchema: Yup.object({
      days: Yup.string().required(" Trial plan days required"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post(
          `${API_TRIAL_PLAN_UPDATE}${trialPlanId}/`,
          values,
          config
        );
        toast.success(`Trial Plan Updated successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        toggleMyEditTrialPlanModal();
        getSubscriptionPlansData();
      } catch (error) {
        console.error(error);
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

  // Edit Trial Plan Days Modal function Start
  function toggleMyEditTrialPlanModal() {
    seteditTrialPlanModal(!editTrialPlanModal);
  }

  // Edit Trial Plan Days Modal function End

  //  get trial plan data start
  const getSubscriptionPlansData = async () => {
    const { data } = await axios.get(
      API_TRIAL_PLAN_AND_SUBSCRIPTION_GET,
      config
    );
    setTrialData(data.data.trial_plan[0]);
    setSubscriptionData(
      data.data.subscription_plan.map((item) => ({ ...item }))
    );
  };
  //  get trial plan data start

  useEffect(() => {
    getSubscriptionPlansData();
  }, []); // This will call getTrialPlanData when the component mounts

  // Sort subscriptionData in ascending order by 'days'
  const sortedSubscriptionData = [...subscriptionData].sort(
    (a, b) => a.days - b.days
  );
  // Subscription Plan  Toggle Start
  const handleCheckboxChange = async (itemId) => {
    setSubscriptionData((prevData) =>
      prevData.map((item) =>
        item.id === itemId ? { ...item, is_active: !item.is_active } : item
      )
    );

    // Find the specific item to update in the payload
    const itemToUpdate = subscriptionData.find((item) => item.id === itemId);

    // Prepare the payload with the updated item
    const payload = {
      id: itemId,
      is_active: !itemToUpdate.is_active,
    };

    // Make an API call to update the server with the new state of the checkbox
    try {
      await axios.post(`${API_SUBSCRIPTION_UPDATE}${itemId}/`, payload, config);
      console.log("API call successful");
    } catch (error) {
      console.log("Error updating checkbox state:", error);
      // You may want to handle the error appropriately here.
    }
  };
  // Subscription Plan  Toggle End
  useEffect(() => {
    getSubscriptionPlansData();
  }, []);
  return (
    <>
      <div
        className=" mt-5 px-3 pb-0
        "
      >
        <Container className="pb-0" fluid={true}>
          <Row>
            <Col className="pb-0" xl={12}>
              <Card
                className=""
                style={{ marginTop: "100px", marginBottom: "0px !important" }}
              >
                <h4 className="ms-3 mt-3 ">Subscription Duration</h4>
                <CardBody className="border-bottom ">
                  <Row>
                    <Col md="2">
                      <h5 className="mt-3">
                        Trial Plan <span className="ms-2">:</span>
                      </h5>
                    </Col>
                    <Col md="10" className="d-flex align-items-center">
                      <p className="ms-2 mt-3    ">
                        {trialData.is_active === true ? (
                          <button
                            type="button"
                            className="btn btn-success btn-sm "
                          >
                            <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
                            Active
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-danger  btn-sm "
                          >
                            <i className="bx bx-block font-size-16 align-middle me-2"></i>
                            InActive
                          </button>
                        )}
                        <span className="me-2 ms-3 fs-5">{trialData.days}</span>
                        trial days (Delivery Frequency - Daily Only)
                      </p>

                      <Button
                        className="btn btn-sm ms-2 "
                        color="light"
                        onClick={() => {
                          toggleMyEditTrialPlanModal(trialData.id);
                          setTrialPlanId(trialData.id);
                        }}
                      >
                        <i className="fas fa-pencil-alt px-2 text-primary fs-5 "></i>
                      </Button>
                    </Col>
                  </Row>
                </CardBody>

                {/* Subscription Plan Start */}
                <Col className="pb-0" xl={12}>
                  <CardBody className=" ">
                    <Row>
                      <Col md="2">
                        <h5 className="mt-3  ">
                          Subscription Plan <span className="ms-2">:</span>
                        </h5>
                      </Col>
                      <Col md="10" className="d-flex align-items-center">
                        <Row>
                          {sortedSubscriptionData.map((item) => (
                            <Col
                              className="fs-6 mt-2 border-bottom border-opacity-10 "
                              md="1"
                              key={item.id}
                            >
                              <label>
                                <input
                                  className="me-2"
                                  type="checkbox"
                                  value={item.id}
                                  checked={item.is_active}
                                  onChange={() => handleCheckboxChange(item.id)}
                                  onClick={() =>
                                    setSelectedSubscriptionPlanID(item.id)
                                  }
                                />
                                {item.days} Days
                              </label>
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>

                {/* Subscription Plan End */}
              </Card>
            </Col>
          </Row>
        </Container>

        {/* edit popup Start */}
        <Col lg={12}>
          <Card>
            <div>
              <Modal
                isOpen={editTrialPlanModal}
                toggle={() => {
                  toggleMyEditTrialPlanModal();
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title mt-0" id="myModalLabel">
                    Edit Trial Plan
                  </h5>

                  <button
                    type="button"
                    onClick={() => {
                      seteditTrialPlanModal(false);
                    }}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p className="card-title-desc">Current Trial Plan Days :</p>
                  <div>
                    <Col xl="12">
                      <CardBody>
                        <Form
                          className="needs-validation"
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                        >
                          <Row>
                            <Col md="12">
                              <FormGroup className="mb-3 ">
                                <Col md="12">
                                  <Label htmlFor="validationCustom01">
                                    Trial Plan :
                                  </Label>
                                </Col>
                                <Col md="12">
                                  <Input
                                    name="days"
                                    placeholder="Enter days"
                                    type="number"
                                    className="form-control"
                                    id="validationCustom01"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.days || ""}
                                    invalid={
                                      validation.touched.days &&
                                      validation.errors.days
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.days &&
                                  validation.errors.days ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.days}
                                    </FormFeedback>
                                  ) : null}
                                </Col>
                              </FormGroup>
                              <Row>
                                <Col className="mb-2" md="12">
                                  <FormGroup check className="mt-2">
                                    <Label check>
                                      <Input
                                        type="checkbox"
                                        name="is_active"
                                        checked={
                                          validation.values.is_active || ""
                                        }
                                        onChange={validation.handleChange}
                                        className="form-control mx-2 "
                                        onClick={() =>
                                          validation.setFieldValue(
                                            "is_active",
                                            !validation.values.is_active
                                          )
                                        }
                                      />
                                      Active
                                    </Label>
                                    {validation.touched.is_active &&
                                      validation.errors.is_active && (
                                        <FormFeedback className="d-block">
                                          {validation.errors.is_active}
                                        </FormFeedback>
                                      )}
                                  </FormGroup>
                                </Col>
                              </Row>
                              <div className="modal-footer ">
                                <Button color="primary" type="submit">
                                  Save
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => {
                                    toggleMyEditTrialPlanModal();
                                  }}
                                  className="btn btn-secondary "
                                  data-dismiss="modal"
                                >
                                  Close
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </CardBody>
                    </Col>
                  </div>
                </div>
              </Modal>
            </div>
          </Card>
        </Col>
      </div>
    </>
  );
};

export default SubscriptionDuration;

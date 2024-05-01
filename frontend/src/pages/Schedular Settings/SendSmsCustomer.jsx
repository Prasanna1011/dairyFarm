import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
  Form,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import axios from "axios";
import { toast } from "react-toastify";
import { API_DASHBOARD_SCHEDULER_SEND_SMS, API_HUB_ADD_GET } from "customhooks/All_Api/Apis";

const SendSmsCustomer = () => {
  const [hubListData, setHubListData] = useState([]);

  const { config, first_name, last_name } = GetAuthToken();
  //   Fetch Data For Hub  Start
  const FetchHubListData = async () => {
    try {
      const { data } = await axios.get(API_HUB_ADD_GET, config);
      setHubListData(data.data);
      console.log("data",data);
      console.log("hubListData",hubListData);
    } catch (error) {
      console.log(error);
    }
  };
  //   Fetch Data For Hub  End

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      message: "",
      hub_id: "",
    },
    validationSchema: Yup.object({
      message: Yup.string().required("Please Enter Your First Name"),
      hub_id: Yup.string().required("Please Enter Your Last Name"),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log("values", values);

      try {
        const { data } = await axios.post(
          API_DASHBOARD_SCHEDULER_SEND_SMS,
          values,
          config
        );
        toast.success(data.message, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        // Reset the Formik form after successful API call
        resetForm();
      } catch (error) {
        toast.error(error.response.data.message, {
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
    FetchHubListData();
  }, []);

  return (
    <div>
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <h3 className="mb-4">Send SMS to Customer</h3>

              <Form
                className="needs-validation"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom01">Enter Message</Label>
                      <Input
                        name="message"
                        placeholder="Enter message"
                        type="text"
                        className="form-control"
                        id="validationCustom01"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.message || ""}
                        invalid={
                          validation.touched.message &&
                          validation.errors.message
                        }
                      />
                      {validation.touched.message &&
                        validation.errors.message && (
                          <FormFeedback type="invalid">
                            {validation.errors.message}
                          </FormFeedback>
                        )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom02">Select Hub</Label>
                      <Input
                        name="hub_id"
                        placeholder="Select Hub"
                        type="select"
                        className="form-control"
                        id="validationCustom02"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.hub_id || ""}
                        invalid={
                          validation.touched.hub_id && validation.errors.hub_id
                        }
                      >
                        <option value="" disabled>
                          Select Hub
                        </option>
                        {hubListData
                          .filter((item) => item.is_active === true)
                          .map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </Input>
                      {validation.touched.hub_id &&
                        validation.errors.hub_id && (
                          <FormFeedback type="invalid">
                            {validation.errors.hub_id}
                          </FormFeedback>
                        )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12" className="">
                    <Button color="primary" type="submit" className="px-4">
                      Send SMS
                    </Button>
                    <Button
                      color="danger"
                      className="px-4 ms-2"
                      onClick={() => validation.handleReset()}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SendSmsCustomer;

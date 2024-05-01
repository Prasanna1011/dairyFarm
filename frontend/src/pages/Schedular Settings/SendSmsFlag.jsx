import React, { useState, useEffect } from "react";
import { Col, Row, Card, CardBody, Label, Form, Button } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_DASHBOARD_SCHEDULER_CONSTANTS_GET_ALL_DATA,
  API_DASHBOARD_SCHEDULER_CONSTANTS_UPDATE,
} from "customhooks/All_Api/Apis";
import { toast } from "react-toastify";

const SendSmsFlag = () => {
  const [constantData, setConstantData] = useState([]);
  const { config, first_name, last_name } = GetAuthToken();

  const getConstantData = async () => {
    try {
      const { data } = await axios.get(
        API_DASHBOARD_SCHEDULER_CONSTANTS_GET_ALL_DATA,
        config
      );
      setConstantData(data);
    } catch (error) {
      console.error("Error fetching constant data:", error);
    }
  };

  useEffect(() => {
    getConstantData();
  }, []);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      SMS_TRIGGER: constantData.find(
        (item) => item.name === "SMS_TRIGGER"
      )?.value === "true",
      EMAIL_TRIGGER: constantData.find(
        (item) => item.name === "EMAIL_TRIGGER"
      )?.value === "true",
    },
    validationSchema: Yup.object({
      SMS_TRIGGER: Yup.bool().required("Please select SMS Trigger"),
      EMAIL_TRIGGER: Yup.bool().required("Please select Email Trigger"),
    }),
    onSubmit: async (values) => {
      try {
        const fields_data = [
          {
            name: "SMS_TRIGGER",
            value: values.SMS_TRIGGER.toString(),
          },
          {
            name: "EMAIL_TRIGGER",
            value: values.EMAIL_TRIGGER.toString(),
          },
        ];

        const { data } = await axios.put(
          API_DASHBOARD_SCHEDULER_CONSTANTS_UPDATE,
          { fields_data },
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
    

        getConstantData();
      } catch (error) {
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.error(error.response.data.message); // Replace with your notification logic
      }
    },
  });

  // Log initial values when component mounts
  useEffect(() => {
    console.log("Initial values:", validation.initialValues);
  }, []);

  return (
    <div>
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <h3 className="mb-4">Send SMS Flag</h3>

              <Form
                className="needs-validation "
                onSubmit={validation.handleSubmit}
              >
                <div className="d-flex">
                <Col lg="6">
                  <div className="mt-4 mt-lg-0">
                    <div className="">
                      <div className="square-switch d-flex ">
                        <input
                          type="checkbox"
                          id="SMS_TRIGGER"
                          className="switch"
                          checked={validation.values.SMS_TRIGGER}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                        />
                        <label
                          htmlFor="SMS_TRIGGER"
                          data-on-label="On"
                          data-off-label="Off"
                        />
                        <Label className="ms-3">Send SMS</Label>
                      </div>
                      <br />

                      <div className="square-switch d-flex ">
                        <input
                          type="checkbox"
                          id="EMAIL_TRIGGER"
                          className="switch"
                          checked={validation.values.EMAIL_TRIGGER}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                        />
                        <label
                          htmlFor="EMAIL_TRIGGER"
                          data-on-label="On"
                          data-off-label="Off"
                        />
                        <Label className="ms-3">Send Email</Label>
                      </div>
                    </div>
                  </div>
                </Col>


                <Col lg="6">
                <Button color="primary" type="submit" className="px-4">
                      Submit
                    </Button>
                </Col>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SendSmsFlag;

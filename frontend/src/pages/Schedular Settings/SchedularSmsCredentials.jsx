

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
import axios from "axios";
import { toast } from "react-toastify";
import { API_DASHBOARD_SCHEDULER_CONSTANTS_GET_ALL_DATA, API_DASHBOARD_SCHEDULER_CONSTANTS_UPDATE } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

const SchedularSmsCredentials = () => {
  const [hubListData, setHubListData] = useState([]);
  const [constantData, setConstantData] = useState([]);
  const { config, first_name, last_name } = GetAuthToken();
  //   Fetch Data For Hub  Start


  const getConstantData = async ()=>{
    const {data}= await axios.get(API_DASHBOARD_SCHEDULER_CONSTANTS_GET_ALL_DATA, config)
    setConstantData(data)
    console.log("SchedularRazerPay",constantData);
  }


  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      SMS_USER_NAME:
      constantData.find((item) => item.name === "SMS_USER_NAME")?.value || "",
      SMS_API_KEY:
      constantData.find((item) => item.name === "SMS_API_KEY")?.value || "",
    },
    validationSchema: Yup.object({
      SMS_USER_NAME: Yup.string().required("Please Enter Your First Name"),
      SMS_API_KEY: Yup.string().required("Please Enter Your Last Name"),
    }),
    validationSchema: Yup.object({
      SMS_USER_NAME: Yup.string().required("Please Enter Your First Name"),
      SMS_API_KEY: Yup.string().required("Please Enter Your Last Name"),
    }),
   onSubmit: async (values, { resetForm }) => {
  console.log("values", values);

  try {
    // Create the required format for fields_data
    const fields_data = [
      {
        name: "SMS_API_KEY",
        value: values.SMS_API_KEY,
      },
      {
        name: "SMS_USER_NAME",
        value: values.SMS_USER_NAME,
      },
      
    ];

    // Make the API request
    const { data } = await axios.put(
      API_DASHBOARD_SCHEDULER_CONSTANTS_UPDATE,
      { fields_data },
      config
    );

    // Display success message
    toast.success(data.message, {
      position: "top-center",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });

    // Reset the Formik form after a successful API call
    getConstantData()
  } catch (error) {
    // Display error message
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
    getConstantData()
  }, [])
  
  
  return (
    <div>
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <h3 className="mb-4">SMS Credentials</h3>

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
                      <Label htmlFor="validationCustom01">SMS User</Label>
                      <Input
                        name="SMS_USER_NAME"
                        placeholder="Enter SMS User "
                        type="password"
                        className="form-control"
                        id="validationCustom01"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.SMS_USER_NAME || ""}
                        invalid={
                          validation.touched.SMS_USER_NAME &&
                          validation.errors.SMS_USER_NAME
                        }
                      />
                      {validation.touched.SMS_USER_NAME &&
                        validation.errors.SMS_USER_NAME && (
                          <FormFeedback type="invalid">
                            {validation.errors.SMS_USER_NAME}
                          </FormFeedback>
                        )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom02">SMS API Key</Label>
                      <Input
                        name="SMS_API_KEY"
                        placeholder="Enter SMS API Key "
                        type="password"
                        className="form-control"
                        id="validationCustom02"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.SMS_API_KEY || ""}
                        invalid={
                          validation.touched.SMS_API_KEY && validation.errors.SMS_API_KEY
                        }
                      />
               
                      {validation.touched.SMS_API_KEY &&
                        validation.errors.SMS_API_KEY && (
                          <FormFeedback type="invalid">
                            {validation.errors.SMS_API_KEY}
                          </FormFeedback>
                        )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12" className="">
                    <Button color="primary" type="submit" className="px-4">
                      Submit
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



export default SchedularSmsCredentials;

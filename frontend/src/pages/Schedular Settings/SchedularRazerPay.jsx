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
import { API_DASHBOARD_SCHEDULER_CONSTANTS_GET_ALL_DATA, API_DASHBOARD_SCHEDULER_CONSTANTS_UPDATE } from "customhooks/All_Api/Apis";

const SchedularRazerPay = () => {
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
      RAZOR_PAY_CLIENT:
      constantData.find((item) => item.name === "RAZOR_PAY_CLIENT")?.value || "",
      RAZOR_PAY_SECRET:
      constantData.find((item) => item.name === "RAZOR_PAY_SECRET")?.value || "",
    },
    validationSchema: Yup.object({
      RAZOR_PAY_CLIENT: Yup.string().required("Please Enter Your First Name"),
      RAZOR_PAY_SECRET: Yup.string().required("Please Enter Your Last Name"),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log("values", values);
      const fields_data = [
        {
          name: "RAZOR_PAY_CLIENT",
          value: values.RAZOR_PAY_CLIENT,
        },
        {
          name: "RAZOR_PAY_SECRET",
          value: values.RAZOR_PAY_SECRET,
        },
        
      ];
  
      try {
        const { data } = await axios.put(
          API_DASHBOARD_SCHEDULER_CONSTANTS_UPDATE,
          { fields_data },
          config
        );
        getConstantData()
        toast.success(data.message, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

    
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
  getConstantData()
}, [])



  return (
    <div>
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <h3 className="mb-4">Razorpay</h3>

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
                      <Label htmlFor="validationCustom01">Razorpay Client</Label>
                      <Input
                        name="RAZOR_PAY_CLIENT"
                        placeholder="Enter RazerPay Client Key"
                        type="password"
                        className="form-control"
                        id="validationCustom01"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.RAZOR_PAY_CLIENT || ""}
                        invalid={
                          validation.touched.RAZOR_PAY_CLIENT &&
                          validation.errors.RAZOR_PAY_CLIENT
                        }
                      />
                      {validation.touched.RAZOR_PAY_CLIENT &&
                        validation.errors.RAZOR_PAY_CLIENT && (
                          <FormFeedback type="invalid">
                            {validation.errors.RAZOR_PAY_CLIENT}
                          </FormFeedback>
                        )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom02">Razorpay Secret</Label>
                      <Input
                        name="RAZOR_PAY_SECRET"
                        placeholder="Enter RazerPay Secret Key"
                        type="password"
                        className="form-control"
                        id="validationCustom02"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.RAZOR_PAY_SECRET || ""}
                        invalid={
                          validation.touched.RAZOR_PAY_SECRET &&
                          validation.errors.RAZOR_PAY_SECRET
                        }
                      />

                      {validation.touched.RAZOR_PAY_SECRET &&
                        validation.errors.RAZOR_PAY_SECRET && (
                          <FormFeedback type="invalid">
                            {validation.errors.RAZOR_PAY_SECRET}
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


export default SchedularRazerPay
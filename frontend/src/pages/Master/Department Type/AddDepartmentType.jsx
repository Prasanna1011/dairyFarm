import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
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
import axios from "axios";
import { API_DEPARTMENT_TYPE_GET_POST } from "customhooks/All_Api/Apis";
import { toast } from "react-toastify";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

const AddDepartmentType = () => {
  //  local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  const navigate = useNavigate();
  //  local storage token End
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      type: "",
    },
    validationSchema: Yup.object({
      type: Yup.string().required("Please Enter Department Type"),
    }),
    onSubmit: async (values) => {
      try {

        const { data } = await axios.post(
          API_DEPARTMENT_TYPE_GET_POST,
          values,
          config
        );
        navigate("/master-department");
        toast.success(response.message, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        toast.error(error.response.data.message, {
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
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Add Department Type</h3>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl="6">
              <Card>
                <CardBody>
                  <Form
                    className="needs-validation"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <Row className="py-5">
                      <Label for="exampleEmail" className="mt-3" sm={3}>
                        Department Type :
                      </Label>
                      <Col sm={9} className="mt-3">
                        <Input
                          name="type"
                          placeholder="Add Department Type"
                          type="text"
                          className="form-control "
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.type || ""}
                          invalid={
                            validation.touched.type && validation.errors.type
                              ? true
                              : false
                          }
                        />
                        {validation.touched.type && validation.errors.type ? (
                          <FormFeedback type="invalid">
                            {validation.errors.type}
                          </FormFeedback>
                        ) : null}
                      </Col>
                    </Row>
                    <Button
                      className="mt-5 float-end"
                      color="primary"
                      type="submit"
                    >
                      Submit form
                    </Button>
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

export default AddDepartmentType;

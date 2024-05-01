import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import {
  API_DEPARTMENT_TYPE_GET_POST,
  API_DEPARTMENT_TYPE_UPDATE,
  API_DEPARTMENT_TYPE_VIEW_BY_ID,
} from "customhooks/All_Api/Apis";
import { toast } from "react-toastify";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

const EditDepartmentType = () => {
  const [departmentTypeDataById, setDepartmentTypeDataById] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();
  //  local storage token Start
  const { config, first_name, last_name } = GetAuthToken();
  //  local storage token End

  const getDepartmentDataById = async () => {
    try {
      const { data } = await axios.get(
        `${API_DEPARTMENT_TYPE_VIEW_BY_ID}${id}/`,
        config
      );
      setDepartmentTypeDataById(data.data);
    } catch (error) {
      console.log("Error fetching department data:", error);
      // Handle error (show a toast message or display an error popup, etc.)
    }
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      type: departmentTypeDataById.type || "",
    },
    validationSchema: Yup.object({
      type: Yup.string().required("Please Enter Your First Name"),
    }),
    onSubmit: async (values) => {
      try {

        const { data } = await axios.post(
          `${API_DEPARTMENT_TYPE_UPDATE}${id}/`,
          values,
          config
        );

        toast.success(data.message, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/master-department");
      } catch (error) {
        console.log(error);
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

  useEffect(() => {
    getDepartmentDataById();
  }, [id]); // Add the id dependency to re-fetch the data when the id changes

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
            <Col xl="11">
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

export default EditDepartmentType;

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
  FormFeedback,
  Form,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import * as Yup from "yup"; // Import Yup for form validation
import { useFormik } from "formik"; // Import useFormik hook for managing form state
import axios from "axios";
import { toast } from "react-toastify";
import {
  API_RESOURCES_GET,
  API_ROLE_AND_PERMISSION_GET_POST,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { Link } from "react-router-dom";

const AddRolesAndPermission = () => {
  const [resources, setResources] = useState([]); // State to store resources data
  const { config } = GetAuthToken(); // Get authentication token from custom hook

  useEffect(() => {
    getResourcesData(); // Fetch resources data on component mount
  }, []);

  // Function to fetch resources data from API
  const getResourcesData = async () => {
    try {
      const { data } = await axios.get(API_RESOURCES_GET, config);
      setResources(data.data); // Set resources state with data from API
    } catch (error) {
      console.log(error);
    }
  };

  // Define validation schema using Yup
  const validationSchema = Yup.object().shape({
    role: Yup.string().required("Please enter a role"), // Role field is required
    description: Yup.string().required("Please enter description"), // Description field is required
  });

  // Initialize formik form
  const formik = useFormik({
    initialValues: {
      role: "", // Initialize role field with empty string
      description: "", // Initialize description field with empty string
      permissions: resources.reduce(
        // Initialize permissions field based on resources data
        (acc, curr) => ({
          ...acc,
          [curr.id]: {
            view: false,
            create: false,
            deleteAction: false,
            edit: false,
            importAction: false,
            exportAction: false,
          },
        }),
        {}
      ),
    },
    validationSchema: validationSchema, // Set validation schema for formik form
    onSubmit: async (values) => {
      // Form submission logic
      console.log(values); // Log form values to console
      try {
        // Format data for API request
        const formattedData = {
          role: values.role,
          description: values.description,
          permissions: Object.entries(values.permissions).map(
            ([roleId, actions]) => ({
              module_id: roleId,
              method_id: Object.entries(actions)
                .filter(([actionKey, isChecked]) => isChecked)
                .map(([actionKey]) => actionKey),
            })
          ),
        };

        // Send POST request to API to add role and permissions
        const { data } = await axios.post(
          API_ROLE_AND_PERMISSION_GET_POST,
          formattedData,
          config
        );
        // Show success toast notification
        toast.success(`Role added successfully`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        // Handle error
        console.log(error);
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

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card style={{ marginTop: "100px" }}>
            <CardBody className="d-flex justify-content-between">
              <h3>Add Roles & Permissions</h3>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl="12">
          <Card>
            <CardBody>
              {/* Formik form */}
              <Form className="needs-formik" onSubmit={formik.handleSubmit}>
                <Row>
                  <Col md="12">
                    {/* Role field */}
                    <FormGroup className="mb-3 d-flex">
                      <Col md="1">
                        <Label>Role</Label>
                      </Col>
                      <Col md="5">
                        {/* Role input field */}
                        <Input
                          name="role"
                          placeholder="Role"
                          type="text"
                          className="form-control"
                          id="role"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.role}
                          invalid={formik.touched.role && !!formik.errors.role} // Check if role field is touched and has error
                        />
                        {/* Display error message if role field has error */}
                        {formik.touched.role && formik.errors.role && (
                          <FormFeedback type="invalid">
                            {formik.errors.role}
                          </FormFeedback>
                        )}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    {/* Description field */}
                    <FormGroup className="mb-3 d-flex">
                      <Col md="1">
                        <Label>Description</Label>
                      </Col>
                      <Col md="5">
                        {/* Description input field */}
                        <Input
                          name="description"
                          placeholder="Description"
                          type="text"
                          className="form-control"
                          id="description"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                          invalid={
                            formik.touched.description &&
                            !!formik.errors.description
                          } // Check if description field is touched and has error
                        />
                        {/* Display error message if description field has error */}
                        {formik.touched.description &&
                          formik.errors.description && (
                            <FormFeedback type="invalid">
                              {formik.errors.description}
                            </FormFeedback>
                          )}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                {/* Table for permissions */}
                <Table
                  id="tech-companies-1"
                  className="table table-striped table-bordered mt-2"
                >
                  <Thead>
                    <Tr>
                      <Th data-priority="2" className="text-center">
                        Roles
                      </Th>
                      {/* Other table headers */}
                      <Th data-priority="2" className="text-center">
                        View
                      </Th>
                      <Th data-priority="3" className="text-center">
                        Create
                      </Th>
                      <Th data-priority="4" className="text-center">
                        Delete
                      </Th>
                      <Th data-priority="5" className="text-center">
                        Edit
                      </Th>
                      <Th data-priority="6" className="text-center">
                        Import
                      </Th>
                      <Th data-priority="7" className="text-center">
                        Export
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {/* Map through resources to display permissions */}
                    {resources.map((role) => (
                      <Tr key={role.id}>
                        <Td>{role.name}</Td>
                        {/* Other table cells */}
                        <Td className="text-center">
                          <input
                            type="checkbox"
                            checked={role.name === "Dashboard" ? true : formik.values.permissions[role.id]?.["1"] }
                            disabled={role.name === "Dashboard"}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              formik.setFieldValue(
                                `permissions.${role.id}.["1"]`,
                                isChecked
                              );
                          
                            }}
                          />
                        </Td>

                        <Td className="text-center">
                          <input
                            type="checkbox"
                            checked={role.name === "Dashboard" ? true : formik.values.permissions[role.id]?.["2"] }
                            disabled={role.name === "Dashboard"}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              formik.setFieldValue(
                                `permissions.${role.id}.["2"]`,
                                isChecked
                              );
                            }}
                          />
                        </Td>
                        <Td className="text-center">
                          <input
                            type="checkbox"
                            checked={role.name === "Dashboard" ? true : formik.values.permissions[role.id]?.["3"] }
                            disabled={role.name === "Dashboard"}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              formik.setFieldValue(
                                `permissions.${role.id}.["3"]`,
                                isChecked
                              );
                            }}
                          />
                        </Td>
                        <Td className="text-center">
                          <input
                            type="checkbox"
                            checked={role.name === "Dashboard" ? true : formik.values.permissions[role.id]?.["4"] }
                            disabled={role.name === "Dashboard"}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              formik.setFieldValue(
                                `permissions.${role.id}.["4"]`,
                                isChecked
                              );
                            }}
                          />
                        </Td>
                        <Td className="text-center">
                          <input
                            type="checkbox"
                            checked={role.name === "Dashboard" ? true : formik.values.permissions[role.id]?.["5"] }
                            disabled={role.name === "Dashboard"}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              formik.setFieldValue(
                                `permissions.${role.id}.["5"]`,
                                isChecked
                              );
                            }}
                          />
                        </Td>
                        <Td className="text-center">
                          <input
                            type="checkbox"
                            checked={role.name === "Dashboard" ? true : formik.values.permissions[role.id]?.["6"] }
                            disabled={role.name === "Dashboard"}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              formik.setFieldValue(
                                `permissions.${role.id}.["6"]`,
                                isChecked
                              );
                            }}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                {/* <Link to={"/role-&-permissions"}> */}

                <Row>
                  <Col md="12" className="d-flex justify-content-end">
                    <Button color="primary" className="mb-5 " type="submit">
                      Submit form
                    </Button>
                    <Link to={"/role-&-permissions"}>
                      <Button color="danger" className="mb-5 ms-2">
                        Cancel
                      </Button>
                    </Link>
                  </Col>
                </Row>
                {/* </Link> */}
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AddRolesAndPermission;

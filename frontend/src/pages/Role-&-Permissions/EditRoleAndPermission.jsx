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
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_RESOURCES_GET,
  API_ROLE_AND_PERMISSION_GET_BY_ID,
  API_ROLE_AND_PERMISSION_UPDATE,
} from "customhooks/All_Api/Apis";

const EditRoleAndPermission = () => {
  const [resources, setResources] = useState([]);
  const [roleDataById, setRoleDataById] = useState({});

  const { id } = useParams();

  // local storage token Start
  const { config } = GetAuthToken();
  // local storage token End

  useEffect(() => {
    const getResourcesData = async () => {
      try {
        const { data } = await axios.get(API_RESOURCES_GET, config);
        setResources(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getResourcesData();
  }, []);

  useEffect(() => {
    const getRoleAndPermissionDataById = async () => {
      try {
        const { data } = await axios.get(
          `${API_ROLE_AND_PERMISSION_GET_BY_ID}${id}`,
          config
        );
        setRoleDataById(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getRoleAndPermissionDataById();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      role: "",
      description: "",
      permissions: {},
    },
    validationSchema: Yup.object().shape({
      role: Yup.string().required("Please enter a role"),
      description: Yup.string().required("Please enter description"),
    }),
    onSubmit: async (values) => {
      try {
        const formattedPermissions = Object.entries(values.permissions).map(
          ([moduleId, actions]) => ({
            module_id: Number(moduleId),
            method_id: Object.entries(actions)
              .filter(([actionKey, isChecked]) => isChecked)
              .map(([actionKey]) => Number(actionKey)),
          })
        );

        const formattedData = {
          role: values.role,
          description: values.description,
          permissions: formattedPermissions,
        };

        await axios.post(
          `${API_ROLE_AND_PERMISSION_UPDATE}${id}/`,
          formattedData,
          config
        );

        toast.success(`Role updated successfully`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        toast.error(`Role must be unique`, {
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
    if (Object.keys(roleDataById).length > 0) {
      const updatedPermissions = {};

      for (const resourceId in roleDataById.resources) {
        const resource = roleDataById.resources[resourceId];
        const methods = {};

        for (const method of resource.methods) {
          methods[method.id] = true;
        }

        updatedPermissions[resourceId] = methods;
      }

      formik.setValues({
        ...formik.values,
        role: roleDataById.name,
        description: roleDataById.description,
        permissions: updatedPermissions,
      });
    }
  }, [roleDataById]);

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card style={{ marginTop: "100px" }}>
            <CardBody className="d-flex justify-content-between">
              <h3>Edit Roles & Permissions</h3>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl="12">
          <Card>
            <CardBody>
              <Form className="needs-formik" onSubmit={formik.handleSubmit}>
                <Row>
                  <Col md="12">
                    <FormGroup className="mb-3 d-flex">
                      <Label md="1">Role</Label>
                      <Col md="5">
                        <Input
                          name="role"
                          placeholder="Edit Role"
                          type="text"
                          className="form-control"
                          id="role"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.role}
                          invalid={formik.touched.role && !!formik.errors.role}
                        />

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
                    <FormGroup className="mb-3 d-flex">
                      <Label md="1">Description</Label>
                      <Col md="5">
                        <Input
                          name="description"
                          placeholder="Edit description"
                          type="text"
                          className="form-control"
                          id="description"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                          invalid={
                            formik.touched.description &&
                            formik.errors.description
                          }
                        />

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
                <Table
                  id="tech-companies-1"
                  className="table table-striped table-bordered mt-2"
                >
                  <Thead>
                    <Tr>
                      <Th data-priority="2" className="text-center">
                        Roles
                      </Th>
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
                    {resources.map((role) => (
                      <Tr key={role.id}>
                        <Td>{role.name}</Td>
                        <Td className="text-center">
                          <input
                            type="checkbox"
                            name={`permissions.${role.id}.1`}
                            // checked={formik.values.permissions[role.id]?.[1]}
                            checked={role.name === "Dashboard" ? true : formik.values.permissions[role.id]?.["1"] }
                            disabled={role.name === "Dashboard"}
                            onChange={(event) => {
                              formik.setFieldValue(
                                `permissions.${role.id}.1`,
                                event.target.checked
                              );
                            }}
                            onClick={() => {
                              formik.setFieldValue(
                                `permissions.${role.id}.1`,
                                !formik.values.permissions[role.id]?.[1]
                              );
                            }}
                          />
                        </Td>

                        <Td className="text-center">
                          <input
                            type="checkbox"
                            name={`permissions.${role.id}.2`}
                            checked={role.name === "Dashboard" ? true : formik.values.permissions[role.id]?.["2"] }
                            disabled={role.name === "Dashboard"}
                            onChange={(event) => {
                              formik.setFieldValue(
                                `permissions.${role.id}.2`,
                                event.target.checked
                              );
                            }}

                            onClick={() => {
                              formik.setFieldValue(
                                `permissions.${role.id}.2`,
                                !formik.values.permissions[role.id]?.[2]
                              );
                            }}
                          />
                        </Td>
                        <Td className="text-center">
                          <input
                            type="checkbox"
                            name={`permissions.${role.id}.3`}
                            checked={role.name === "Dashboard" ? true : formik.values.permissions[role.id]?.["3"] }
                            disabled={role.name === "Dashboard"}
                            onChange={(event) => {
                              formik.setFieldValue(
                                `permissions.${role.id}.3`,
                                event.target.checked
                              );
                            }}
                            onClick={() => {
                              formik.setFieldValue(
                                `permissions.${role.id}.3`,
                                !formik.values.permissions[role.id]?.[3]
                              );
                            }}
                          />
                        </Td>
                        <Td className="text-center">
                          <input
                            type="checkbox"
                            name={`permissions.${role.id}.4`}
                            checked={role.name === "Dashboard" ? true : formik.values.permissions[role.id]?.["4"] }
                            disabled={role.name === "Dashboard"}
                            onChange={(event) => {
                              formik.setFieldValue(
                                `permissions.${role.id}.4`,
                                event.target.checked
                              );
                            }}
                            onClick={() => {
                              formik.setFieldValue(
                                `permissions.${role.id}.4`,
                                !formik.values.permissions[role.id]?.[4]
                              );
                            }}
                          />
                        </Td>
                        <Td className="text-center">
                          <input
                            type="checkbox"
                            name={`permissions.${role.id}.5`}
                            checked={role.name === "Dashboard" ? true : formik.values.permissions[role.id]?.["5"] }
                            disabled={role.name === "Dashboard"}
                            onChange={(event) => {
                              formik.setFieldValue(
                                `permissions.${role.id}.5`,
                                event.target.checked
                              );
                            }}
                            onClick={() => {
                              formik.setFieldValue(
                                `permissions.${role.id}.5`,
                                !formik.values.permissions[role.id]?.[5]
                              );
                            }}
                          />
                        </Td>
                        <Td className="text-center">
                          <input
                            type="checkbox"
                            name={`permissions.${role.id}.6`}
                            checked={role.name === "Dashboard" ? true : formik.values.permissions[role.id]?.["6"] }
                            disabled={role.name === "Dashboard"}
                            onChange={(event) => {
                              formik.setFieldValue(
                                `permissions.${role.id}.6`,
                                event.target.checked
                              );
                            }}
                            onClick={() => {
                              formik.setFieldValue(
                                `permissions.${role.id}.6`,
                                !formik.values.permissions[role.id]?.[6]
                              );
                            }}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Row>
              <Col md="12" className="d-flex justify-content-end">
              <Button
                  color="primary"
                  className="mb-5 "
                  type="submit"
                >
                  Submit form
                </Button>
              <Link to={"/role-&-permissions"}>
              <Button
                  color="danger"
                  className="mb-5 ms-2"
                >
                 Cancel
                </Button>
              </Link>
              </Col>
             </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default EditRoleAndPermission;

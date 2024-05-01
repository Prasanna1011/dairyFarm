import React, { useState, useEffect, useRef } from "react";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Label,
  Input,
  Form,
  FormFeedback,
  ModalBody,
} from "reactstrap";
import { TablePagination } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LoaderPage from "components/Loader/LoaderPage";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_HSN_CODE_DELETE,
  API_HSN_CODE_GET_POST,
  API_TAX_RATE_GET_POST,
} from "customhooks/All_Api/Apis";

const HsnCode = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modal, setModal] = useState(false);
  const [hsnData, sethsnData] = useState([]);
  const [taxRates, setTaxRates] = useState([]);
  const [ConfirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [selectedTaxRate, setSelectedTaxRate] = useState("");
  const [selectedHSNCode, setSelectedHSNCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // modal popup start
  const toggle = () => setModal(!modal);
  const DeleteConformFun = () => setConfirmDelete(!ConfirmDelete);

  const externalCloseBtn = (
    <button
      type="button"
      className="close"
      style={{ position: "absolute", top: "15px", right: "15px" }}
      onClick={toggle}
    >
      &times;
    </button>
  );
  // modal popup End

  //  local storage token Start

  const { config, first_name, last_name } = GetAuthToken();

  //  local storage token End

  const initialValues = {
    HSN_code: "",
    tax_rate: "",
  };

  const validationSchema = Yup.object({
    HSN_code: Yup.string()
      .required("HSN-Code is required")
      .max(6, "HSN Code must be 6 digit")
      .min(6, "HSN Code must be 6 digit"),
    tax_rate: Yup.number().required("Tax Rate is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { data } = await axios.post(API_HSN_CODE_GET_POST, values, config);
      getHsnData();
      toggle();
      toast.success(`HNS Code added successfully`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
      toast.error(`HNS Code must be unique`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Tax Rate data GET Start
  const getHsnData = async () => {
    try {
      const response = await axios.get(API_HSN_CODE_GET_POST, config);
      sethsnData(response.data?.data || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  // Tax Rate data GET End

  // get Tax Rate start
  const getTaxRates = async () => {
    const { data } = await axios.get(API_TAX_RATE_GET_POST, config);
    setTaxRates(data.data);
  };

  // get Tax Rate End

  // delete HSN Data  Start

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_HSN_CODE_DELETE}${id}`, config);
      getHsnData();
      toast.success(`Entry Deleted successfully`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.error(error);
      toast.error(` Something Went Wrong`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // delete  HSN Data    End

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const searchData = hsnData.filter((item) => {
      const searchString = `${item.tax_rate_id}  ${item.code}  `; // Add more properties as needed
      return searchString.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredData(searchData);
  };

  // Search Filter End

  // Pagenation Start
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Pagenation End

  useEffect(() => {
    getTaxRates();

    getHsnData();
  }, []);
  useEffect(() => {
    handleSearch();
  }, [searchQuery, hsnData]);

  return (
    <>
      <Row>
        <Col xl={12}>
          <Card style={{ marginTop: "100px" }}>
            <CardBody className="d-flex justify-content-between">
              <h3>HSN Code</h3>
              <Button color="primary" onClick={toggle}>
                Create
              </Button>
            </CardBody>
          </Card>
        </Col>
        <div className="d-flex mb-3 justify-content-center">
          <input
            ref={searchInputRef}
            className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded px-3 "
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="   Search ..."
          />
          {searchQuery.length >= 1 ? (
            <Button
              className="btn btn-sm "
              onClick={() => {
                const input = searchInputRef.current;
                if (input) {
                  input.select();
                  document.execCommand("cut");
                }
              }}
            >
              <i className="fas fa-times"></i>
            </Button>
          ) : (
            <Button className=" btn btn-sm " onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </Button>
          )}
        </div>
        {loading == true ? (
          <LoaderPage />
        ) : (
          <Col xl={12}>
            <Card className="pb-5">
              <CardBody>
                <div className="table-responsive">
                  <Table className="table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Sr no.</th>
                        <th>HSN Code</th>
                        <th>Tax Rate</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(searchQuery
                        ? filteredData
                        : hsnData &&
                          hsnData.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                      ).map((item, index) => (
                        <>
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{item.code}</td>
                            <td>{item.tax_rate_id}</td>
                            <td>
                              <Link to={`/master-hsn-code-edit/${item.id}`}>
                                <Button className="btn btn-warning btn-sm">
                                  <i className="fas fa-pencil-alt"></i>
                                </Button>
                              </Link>
                              <Button
                                className="btn btn-danger btn-sm ms-1"
                                color="danger"
                                // onClick={DeleteConformFun}
                                onClick={() => {
                                  DeleteConformFun(
                                    item.id && setDeleteId(item.id),

                                    setSelectedHSNCode(item.code),
                                    setSelectedTaxRate(item.tax_rate_id)
                                  );
                                }}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </Button>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
              <TablePagination
                className=" d-flex justfy-content-start"
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={hsnData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Col>
        )}
      </Row>

      <div>
        {/* Model WinDow Start */}
        <Modal isOpen={modal} toggle={toggle} external={externalCloseBtn}>
          <ModalHeader>Add HSN Code</ModalHeader>
          <Col xl="12">
            <Card>
              <CardBody>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {(formik) => (
                    <Form
                      className="needs-validation"
                      onSubmit={formik.handleSubmit}
                    >
                      <Row>
                        <Label for="exampleEmail" className="mt-3" sm={2}>
                          Tax Rate
                        </Label>
                        <Col sm={10} className="mt-3">
                          <div className="input-group">
                            <Field
                              as="select"
                              className="form-select"
                              id="inputGroupSelect04"
                              name="tax_rate"
                            >
                              <option value="">Choose Tax Rate</option>
                              {taxRates.map((item) => (
                                <option
                                  key={`${item.id}-${Date.now()}`}
                                  value={item.id}
                                >
                                  {item.tax_name}
                                </option>
                              ))}
                            </Field>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Label for="exampleEmail" className="mt-3" sm={2}>
                          HSN-code
                        </Label>
                        <Col sm={10} className="my-3">
                          <Field
                            name="HSN_code"
                            placeholder="HSN-code"
                            type="number"
                            className={`form-control ${
                              formik.touched.HSN_code && formik.errors.HSN_code
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          <ErrorMessage
                            name="HSN_code"
                            component="div"
                            className="invalid-feedback"
                          />
                        </Col>
                      </Row>
                      <ModalFooter>
                        <Button
                          color="primary"
                          type="submit"
                          disabled={formik.isSubmitting}
                        >
                          Add
                        </Button>
                        <Button color="secondary" onClick={toggle}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Modal>
        {/* Model WinDow End */}
      </div>

      {/* Delete Popup Start */}
      <div>
        <Modal isOpen={ConfirmDelete} toggle={DeleteConformFun}>
          <ModalHeader toggle={DeleteConformFun}>
            <h4 className="ms-5 text-danger">Alert</h4>
          </ModalHeader>
          <ModalBody>
            <p className=" text-center">
              Are you Sure to delete
              <h5 className="text-danger mx-1">
                <span className="text-dark">HSN-Code-</span>
                {selectedHSNCode} <span className="text-dark">Tax Rate-</span>
                {selectedTaxRate}
              </h5>
              HSN-Code
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              // onClick={DeleteConformFun}
              onClick={(e) => {
                handleDelete(deleteId), DeleteConformFun();
              }}
              deleteId
            >
              Delete
            </Button>
            <Button color="secondary" onClick={DeleteConformFun}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      {/* Delete Popup End */}
    </>
  );
};

export default HsnCode;

import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
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
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import LoaderPage from "components/Loader/LoaderPage";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_TAX_RATE_DELETE,
  API_TAX_RATE_GET_POST,
} from "customhooks/All_Api/Apis";
const TaxRate = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modal, setModal] = useState(false);
  const [taxData, settaxData] = useState([]);
  const [ConfirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [taxRateName, setTaxRateName] = useState("");
  const [taxRate, setTaxRat] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const DeleteConformFun = () => setConfirmDelete(!ConfirmDelete);

  const taxOptions = [
    { value: "SGST,CGST", label: "SGST & CGST" },
    { value: "IGST", label: "IGST" },
    { value: "No Tax", label: "No Tax" },
    { value: "NA", label: "NA" },
  ];

  //  local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  //  local storage token End

  const validation = useFormik({
    initialValues: {
      tax_name: "",
      tax_rate: "", 
      tax_type: "",
    },
    validationSchema: yup.object({
      tax_name: yup.string().required("Tax name is required"),
      tax_rate: yup.string().required("Tax rate is required"),
      tax_type: yup.string().required("Tax type is required"),
    }),

    onSubmit: async (values) => {
      try {

        const { data } = await axios.post(
          API_TAX_RATE_GET_POST,
          values,
          config
        );
        getTaxDetails();
        toast.success(`Tax Detils added successfully`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        toggle();
      } catch (error) {
        console.log(error);
        toast.error(`Tax Detils must be unique`, {
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

  // Tax Rate data GET Start
  const getTaxDetails = async () => {
    try {
      const response = await axios.get(API_TAX_RATE_GET_POST, config);
      settaxData(response.data?.data || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  // Tax Rate data GET End

  // delete Tax Rate  Start
  const handleDelete = async (id) => {
    try {
      const URL = `${API_TAX_RATE_DELETE}${id}/`;

      await axios.delete(URL, config);

      getTaxDetails();
      toast.success(`Product Deleted successfully`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      DeleteConformFun();
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

  // delete Tax Rate End

  // modal popup start
  const toggle = () => setModal(!modal);
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

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const searchData = taxData.filter((item) => {
      const searchString = `${item.tax_name}  ${item.tax_rate}    ${item.tax_type}`; // Add more properties as needed
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
    getTaxDetails();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, taxData]);
  return (
    <>
      <Row>
        <Col xl={12}>
          <Card style={{ marginTop: "100px" }}>
            <CardBody className="d-flex justify-content-between">
              <h3>Tax Rate</h3>
              {/* <Link to="/master-city"> */}
              <Button color="primary" onClick={toggle}>
                Create
              </Button>
              {/* </Link> */}
            </CardBody>
          </Card>
        </Col>

        {/*  */}

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
                  --version;
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

        {/*  */}
        {loading == true ? (
          <LoaderPage />
        ) : (
          <Col xl={12}>
            <Card>
              <CardBody>
                <div className="table-responsive">
                  <Table className="table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Sr no.</th>
                        <th>Tax Name</th>
                        <th>Tax Rate</th>
                        <th>Tax Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(searchQuery
                        ? filteredData
                        : taxData &&
                          taxData.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                      ).map((item, index) => (
                        <>
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{item.tax_name}</td>
                            <td>{item.tax_rate}</td>
                            <td>{item.tax_type}</td>
                            <td>
                              <Link to={`/master-tax-rate-edit/${item.id}/`}>
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
                                    setTaxRateName(item.tax_name),
                                    setTaxRat(item.tax_rate)
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
                count={taxData.length}
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
          <ModalHeader>Add Taxes</ModalHeader>

          <Col xl="12">
            <Card>
              <CardBody>
                <Form
                  className="needs-validation"
                  onSubmit={validation.handleSubmit}
                >
                  {/*  */}
                  <Row className="">
                    <Label for="exampleEmail" className="mt-3" sm={3}>
                      Tax Name
                    </Label>
                    <Col sm={9} className="mt-3">
                      <Input
                        name="tax_name"
                        placeholder="Tax Name"
                        type="text"
                        className="form-control "
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tax_name || ""}
                        invalid={
                          validation.touched.tax_name &&
                          validation.errors.tax_name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.tax_name &&
                      validation.errors.tax_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.tax_name}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>
                  {/*  */}
                  <Row className="">
                    <Label for="exampleEmail" className="mt-3" sm={3}>
                      Tax Rate
                    </Label>
                    <Col sm={9} className="mt-3">
                      <Input
                        name="tax_rate"
                        placeholder="Tax Rate"
                        type="text"
                        className="form-control "
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tax_rate || ""}
                        invalid={
                          validation.touched.tax_rate &&
                          validation.errors.tax_rate
                            ? true
                            : false
                        }
                      />
                      {validation.touched.tax_rate &&
                      validation.errors.tax_rate ? (
                        <FormFeedback type="invalid">
                          {validation.errors.tax_rate}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>
                  {/*  */}
                  <Row className="">
                    <Label for="exampleEmail" className="mt-3" sm={3}>
                      Tax Type
                    </Label>
                    <Col sm={9} className="mt-3">
                      <Input
                        name="tax_type"
                        placeholder="Tax Type"
                        type="select"
                        className="form-control "
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tax_type || ""}
                        invalid={
                          validation.touched.tax_type &&
                          validation.errors.tax_type
                            ? true
                            : false
                        }
                      >
                        <option value="" disabled>Select Tax Type</option>
                        {taxOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                      {validation.touched.tax_type &&
                      validation.errors.tax_type ? (
                        <FormFeedback type="invalid">
                          {validation.errors.tax_type}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>

                  <ModalFooter>
                    <Button color="primary" type="submit">
                      Add Tax
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Modal>
        {/* Model WinDow End */}
      </div>

      {/* Delete Popup Start */}
      <div>
        <Modal isOpen={ConfirmDelete} toggle={DeleteConformFun}>
          <ModalHeader toggle={DeleteConformFun}>Alert</ModalHeader>
          <ModalBody>
            <p className=" text-center">
              Are you Sure to delete
              <br /> Tax Rate Name
              <span className="text-danger mx-1">{taxRateName}</span> And Tax
              Rate is <span className="text-danger mx-1">{taxRate}</span>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              // onClick={DeleteConformFun}
              onClick={(e) => handleDelete(deleteId)}
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

export default TaxRate;

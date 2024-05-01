import axios from "axios";
import WarningCard from "components/warningCard/WarningCard";
import {
  API_TAX_RATE_GET_BY_ID,
  API_TAX_RATE_UPDATE,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { values } from "lodash";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

const EditTaxRate = () => {
  const [taxRateData, setTaxRateData] = useState([]);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  //  local storage token Start
  const { config, first_name, last_name } = GetAuthToken();
  //  local storage token End

  const getTaxRateData = async (id) => {
    const url = `${API_TAX_RATE_GET_BY_ID}${id}/`;
    try {
      const { data } = await axios.get(url, config);
      setTaxRateData(data.data); // Set the UOM object directly
    } catch (error) {
      console.error(error);
    }
  };

  const name = taxRateData[0]?.unit_name;

  // const handleUpdateTaxRate = async e => {
  //   e.preventDefault()
  //   try {
  //     await axios.post(
  //       `${API_TAX_RATE_UPDATE}${id}/`,
  //       taxRateData,config
  //     )
  //     navigate(`/master-tax-rate`)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  const taxOptions = [
    { value: "SGST,CGST", label: "SGST & CGST" },
    { value: "IGST", label: "IGST" },
    { value: "No Tax", label: "No Tax" },
    { value: "NA", label: "NA" },
  ];

  const handleUpdateTaxRate = async (e) => {
    e.preventDefault();

    // Validate form fields
    const validationErrors = {};
    if (!taxRateData.tax_name) {
      validationErrors.tax_name = "Tax name is required";
    }
    if (!taxRateData.tax_rate) {
      validationErrors.tax_rate = "Tax rate is required";
    }
    if (!taxRateData.tax_type) {
      validationErrors.tax_type = "Tax type is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(`${API_TAX_RATE_UPDATE}${id}/`, taxRateData, config);
      navigate(`/master-tax-rate`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {}, [taxRateData]);

  useEffect(() => {
    getTaxRateData(id);
  }, [id]);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Edit Tax Rate</h3>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <div>
              <div className="container">
                <div className="row ">
                  <div className="col-md-12">
                    <div className="container">
                      <div className="row">
                        <div className="col-sm-6 offset-sm-3">
                          <div className="card">
                            <div className="card-body">
                              <div>
                                <label htmlFor="city" className="form-label">
                                  Tax Name *
                                </label>
                                <input
                                  autoComplete="off"
                                  type="text"
                                  className="form-control"
                                  id="unit_name"
                                  placeholder=" Enter Unit Of Measure"
                                  value={taxRateData?.tax_name}
                                  onChange={(e) => {
                                    setTaxRateData({
                                      ...taxRateData,
                                      tax_name: e.target.value,
                                    });
                                    setErrors({ ...errors, tax_name: "" });
                                  }}
                                />
                                {errors.tax_name && (
                                  <span className="text-danger">
                                    {errors.tax_name}
                                  </span>
                                )}
                              </div>
                              <div className="mt-2">
                                <label htmlFor="city" className="form-label">
                                  Tax Rate *
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="quantity"
                                  placeholder="Enter Quantity ..."
                                  value={taxRateData?.tax_rate}
                                  onChange={(e) => {
                                    setTaxRateData({
                                      ...taxRateData,
                                      tax_rate: e.target.value,
                                    });
                                    setErrors({ ...errors, tax_rate: "" });
                                  }}
                                />
                                {errors.tax_name && (
                                  <span className="text-danger">
                                    {errors.tax_rate}
                                  </span>
                                )}
                              </div>
                              <div className="mt-2">
                                <label htmlFor="taxType" className="form-label">
                                  Tax Type *
                                </label>
                                <select
                                  className="form-control"
                                  id="taxType"
                                  value={taxRateData?.tax_type}
                                  onChange={(e) => {
                                    setTaxRateData({
                                      ...taxRateData,
                                      tax_type: e.target.value,
                                    });
                                    setErrors({ ...errors, tax_type: "" });
                                  }}
                                >
                                  <option value="" disabled>
                                    Select Tax Type
                                  </option>
                                  {taxOptions.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                {errors.tax_type && (
                                  <span className="text-danger">
                                    {errors.tax_type}
                                  </span>
                                )}
                              </div>

                              <div className="text-center">
                                <button
                                  type="button"
                                  onClick={handleUpdateTaxRate}
                                  className="btn btn-primary  mt-3"
                                >
                                  Update
                                </button>
                                <Link to={`/master-tax-rate`}>
                                  <button className="btn btn-danger  mt-3 ms-2">
                                    Cancel
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default EditTaxRate;

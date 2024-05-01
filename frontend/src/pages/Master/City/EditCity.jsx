import axios from "axios";
import WarningCard from "components/warningCard/WarningCard";
import { useFormik } from "formik";
import * as Yup from "yup";

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_CITY_GET_BY_ID, API_CITY_UPDATE } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

const EditCity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cityGetData, setCityGetData] = useState([]);

  //  local storage token Start
  const { config, first_name, last_name } = GetAuthToken();
  //  local storage token End

  const getCityData = async (id) => {
    const url = `${API_CITY_GET_BY_ID}${id}`;
    try {
      const { data } = await axios.get(url, config);
      setCityGetData(data.data);
      console.log("cityGetData", cityGetData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCityData(id);
  }, []);

  // validation for city update
  const validationSchema = Yup.object().shape({
    city: Yup.string()
      .required("City is required")
      .matches(/^[a-zA-Z\s]+$/, "City should only contain letters and spaces"),
  });
  const formik = useFormik({
    initialValues: {
      city: cityGetData.city || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(
          `${API_CITY_UPDATE}${id}/`,
          {
            city: values.city,
          },
          config
        );

        navigate(`/master-city`);
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <>
      <WarningCard />
      <div style={{ marginTop: "50px" }}>
        <div className="container">
          <div className="row ">
            <div className="col-md-4">
              <div className="card border ">
                <div className="card-header">
                  <h4>City Details</h4>
                </div>
                <div className="card-body">
                  <p className="d-flex">
                    <span className="fs-5">City </span>:
                    <h5 className="ms-1">{cityGetData.city}</h5>
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-around">
                  <Link to={`/master-city`}>
                    <button className="btn btn-warning">City List</button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="container">
                <div className="row">
                  <div className="col-sm-6 offset-sm-3">
                    <div className="card">
                      <div className="card-header">Login</div>
                      <div className="card-body">
                        <form onSubmit={formik.handleSubmit}>
                          <div>
                            <label htmlFor="city" className="form-label">
                              City
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                formik.touched.city && formik.errors.city
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="city"
                              placeholder="Enter city"
                              {...formik.getFieldProps("city")}
                            />
                            {formik.touched.city && formik.errors.city && (
                              <div className="invalid-feedback">
                                {formik.errors.city}
                              </div>
                            )}
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary w-100 mt-3"
                          >
                            Update
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCity;

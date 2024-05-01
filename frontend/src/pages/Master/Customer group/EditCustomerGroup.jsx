import axios from "axios";
import WarningCard from "components/warningCard/WarningCard";
import { values } from "lodash";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_CUSTOMER_GROUP_GET_BY_ID,
  API_CUSTOMER_GROUP_UPDATE,
} from "customhooks/All_Api/Apis";

const EditCustomerGroup = () => {
  const [editCustomerGroupData, setEditCustomerGroupData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  //  local storage token Start

  const { config, first_name, last_name } = GetAuthToken();
  //  local storage token End
  const getCustomerGroupData = async (id) => {
    const url = `${API_CUSTOMER_GROUP_GET_BY_ID}${id}/`;
    try {
      const { data } = await axios.get(url, config);
      setEditCustomerGroupData(data.data); // Set the UOM object directly
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCustomerGroupData = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_CUSTOMER_GROUP_UPDATE}${id}/`,
        editCustomerGroupData,
        config
      );
      toast.success(`Customer Group Edited successfully`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      navigate(`/master-customer-group`);
    } catch (error) {
      console.error(error);
      toast.danger(`Something Went Wrong`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  useEffect(() => {
  }, [editCustomerGroupData]);

  useEffect(() => {
    getCustomerGroupData(id);
  }, [id]);

  return (
    <>
      <WarningCard />
      <div style={{ marginTop: "50px" }}>
        <div className="container">
          <div className="row ">
            <div className="col-md-5">
              <div className="card border ">
                <div className="card-header">
                  <h4>Selected Customer Group</h4>
                </div>
                <div className="card-body">
                  {/* Remove the map function since uomData is no longer an array */}
                  <>
                    <p className="d-flex">
                      <span className="fs-7">Customer Group : </span>
                      <h6 className="ms-1 fs-6">
                        {editCustomerGroupData?.customer_group_name}
                      </h6>
                    </p>
                  </>
                  {/* ... */}
                </div>
                <div className="card-footer d-flex justify-content-around">
                  <Link to={`/master-customer-group`}>
                    <button className="btn btn-warning">Back</button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-7">
              <div className="container">
                <div className="row">
                  <div className="col-sm-6 offset-sm-3">
                    <div className="card">
                      <div className="card-header">
                        <h4>Edit Customer Group</h4>
                      </div>
                      <div className="card-body">
                        <div>
                          <label htmlFor="city" className="form-label">
                            Customer Group:
                          </label>
                          <input
                            autoComplete="off"
                            type="text"
                            className="form-control"
                            id="unit_name"
                            placeholder=" Enter Customer Group"
                            value={editCustomerGroupData?.customer_group}
                            onChange={(e) => {
                              const updateCustmerGroupData = {
                                ...editCustomerGroupData,
                                customer_group: e.target.value,
                              };
                              setEditCustomerGroupData(updateCustmerGroupData);
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleUpdateCustomerGroupData}
                          className="btn btn-primary w-100 mt-3"
                        >
                          Update
                        </button>
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

export default EditCustomerGroup;

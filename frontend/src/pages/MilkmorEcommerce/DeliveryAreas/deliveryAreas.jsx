import React, { useEffect, useState } from "react";
import HomeNavbar from "../../../components/EcommerceMilkMor/HomeHeader/homeNavbar";
import milkmor_illustration from "../../../assets/images/brands/milkmor_Illustration.jpg";
import Footer from "../../../components/EcommerceMilkMor/EcommerceFooter/Footer";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { API_AREA_GET_POST } from "customhooks/All_Api/Apis";
import axios from "axios";
import "./deliveryAreas.css";

const DeliveryAreas = () => {
  const [areaAllData, setAreaAllData] = useState([]);


  const API = API_AREA_GET_POST;
  const config = GetAuthToken();
  const getAreaData = async () => {
    try {
      const { data } = await axios.get(API, config);
      setAreaAllData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAreaData();
  }, []);

  const areaNamesArray = [];

  for (const pincode in areaAllData) {
    if (areaAllData.hasOwnProperty(pincode)) {
      const areas = areaAllData[pincode].areas;
      areas && areas.map((eachItem) => areaNamesArray.push(eachItem.area));
    }
  }

  return (
    <React.Fragment>
      <HomeNavbar />
      <div>
        <img
          src={milkmor_illustration}
          alt="deliveryAreasImage"
          className="banner"
        />
      </div>
      <div className="sign-up-banner-container">
        <div className="container">
          <div className="sign-up-banner">
            <p className="text-light paragraph">
              Join Home-Makers Community for free
            </p>
            <button className="sign-up-button">SIGN UP</button>
          </div>
        </div>
      </div>
      <div className="container">
        <div>
          <h1 className="text-center m-3">Milk Delivery Areas</h1>
        </div>
        <ul className="list-container mt-3 mb-3">
          {areaNamesArray &&
            areaNamesArray.map((eachArea, index) => (
              <li key={index} className="list-item">
                {eachArea}
              </li>
            ))}
        </ul>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default DeliveryAreas;

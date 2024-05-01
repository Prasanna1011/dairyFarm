import React from "react";
import HomeNavbar from "components/EcommerceMilkMor/HomeHeader/homeNavbar";
import BannerAndSignUp from "components/EcommerceMilkMor/CommonMilkmorImage/CommonMilkmorImage";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import milkmorlogoblue from "../../../assets/images/brands/milkmorlogoblue.png";
import "./Career.css";

const Career = () => {
  return (
    <React.Fragment>
      <HomeNavbar />
      <BannerAndSignUp />
      <div className="careers-container-background">
        <div className="container">
          <div className="p-5">
            <h1 className="text-center">Careers</h1>
          </div>
          <div className="career-data-container">
            <div className="container">
              <div className="career-card">
                <img
                  src={milkmorlogoblue}
                  alt="careers"
                  className="career-item-image"
                />
                <h5 className="pt-3 pb-2 text-center">
                  <b>CUSTOMER CARE EXECUTIVE (FEMALE) </b>
                </h5>

                <p>
                  <b>Company : </b>Milkmor India
                </p>
                <p>
                  <b>Location : </b>Ahmedabad
                </p>
                <button
                  style={{
                    backgroundColor: "#337AB7",
                    color: "white",
                    border: "none",
                    padding: "7px",
                    borderRadius : "10px"
                  }}
                >
                  View More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Career;

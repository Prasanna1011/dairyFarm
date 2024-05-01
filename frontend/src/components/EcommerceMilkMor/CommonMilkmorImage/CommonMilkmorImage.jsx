import React from "react";
import milkmor_illustration from "../../../assets/images/brands/milkmor_Illustration.jpg";
import "./CommonMilkmorImage.css";

const BannerAndSignUp = () => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default BannerAndSignUp;

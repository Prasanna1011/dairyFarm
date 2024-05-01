import React from "react";
import HomeNavbar from "components/EcommerceMilkMor/HomeHeader/homeNavbar";
import BannerAndSignUp from "components/EcommerceMilkMor/CommonMilkmorImage/CommonMilkmorImage";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import bharatbhaipatel from "../../../assets/images/brands/bharatbhaipatel.png"
import miteshpatel from "../../../assets/images/brands/miteshpatel.png";
import yashpatel from "../../../assets/images/brands/yashpatel.png";
import "./Directors.css";

const Directors = () => {
  return (
    <React.Fragment>
      <HomeNavbar />
      <BannerAndSignUp />
      <div className="directors-container">
        <div className="container">
          <h2 className="text-center pt-4 pb-3">Directors</h2>
          <div className="directors-content">
            <div className="directors-content-sub-containers">
              <div className="director-image-container">
                <img
                  src={bharatbhaipatel}
                  alt="bharatbhaipatel"
                  className="directors-images"
                />
                <div className="d-flex flex-column m-3">
                  <h3 style={{ color: "#2A70B8" }}>Mr. Bharat Patel</h3>
                  <p className="h6">Chairman - Founder</p>
                </div>
              </div>
              <div className="mt-2 mb-2">
                <p className="h6">
                  The only thing hurts me in current era is “Advanced
                  Adulteration”, wherein the technology and research has been
                  misused to deteriorate the Mankind. Astha Dairy Farm initiates
                  to bring you premium farm fresh cow milk. You might seek pure
                  quality but above all, we provide you the best form of nature
                  to you without any adulteration or fortification. Milkmor
                  brings you all the benefits of cow milk at your doorstep.
                </p>
              </div>
            </div>
            <div className="directors-content-sub-containers">
              <div className="director-image-container">
                <img
                  src={miteshpatel}
                  alt="miteshpatel"
                  className="directors-images"
                />
                <div className="d-flex flex-column m-3">
                  <h3 style={{ color: "#2A70B8" }}>Mr. Mitesh Patel</h3>
                  <p className="h6">MANAGING DIRECTOR - Co Founder</p>
                </div>
              </div>
              <div className="mt-2 mb-2">
                <p className="h6">
                  Needless to say that “Happy Cows = Healthy Milk”. Milkmor’s
                  unique 360 degree in-house process from milking to
                  distribution under one roof is what makes us responsible for
                  quality. We’ve all the latest Cow Nurturing and Milking
                  equipment. Along with, My entire team of 400 people ensures
                  that fresh & hygiene cow milk reaches to you and your family.
                  So just relax & enjoy our 1st ever “Richpro” Milk.
                </p>
              </div>
            </div>
            <div className="directors-content-sub-containers">
              <div className="director-image-container">
                <img
                  src={yashpatel}
                  alt="yashpatel"
                  className="directors-images"
                />
                <div className="d-flex flex-column m-3">
                  <h3 style={{ color: "#2A70B8" }}>Mr. Yash Patel</h3>
                  <p className="h6">MANAGING DIRECTOR - Co Founder</p>
                </div>
              </div>
              <div className="mt-2 mb-2">
                <p className="h6">
                  Just forget the hassles of maintaining milk coupons and
                  changes of denomination during your early sweet mornings. Our
                  unique “My Milkmor” mobile app brings you everything on
                  fingertips. From online payment to maintaining your milk
                  schedule has just become a piece of cake. Now, there are no
                  chances of error and loss. You’ve complete transparent access
                  to your milk schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Directors;

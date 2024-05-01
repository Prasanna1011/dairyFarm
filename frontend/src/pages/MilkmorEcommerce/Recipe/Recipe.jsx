import React from "react";
import HomeNavbar from "components/EcommerceMilkMor/HomeHeader/homeNavbar";
import BannerAndSignUp from "components/EcommerceMilkMor/CommonMilkmorImage/CommonMilkmorImage";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";

const Recipe = () => {
  return (
    <React.Fragment>
      <HomeNavbar />
      <BannerAndSignUp />
      <div className="recipe-section-container">
        <div className="container">
          <div className="recipe-items-container">
            <div className="recipe-card">
              <div className="w-50">
                <img
                  src="https://www.milkmor.com/wp-content/uploads/2018/07/Paneer-Recipe_850-X-300_1-e1533385052167.jpg"
                  alt="panner"
                  className="recipe-image"
                />
              </div>
            </div>
            <div className="recipe-card">
              <div className="w-50">
                <img
                  src="https://www.milkmor.com/wp-content/uploads/2018/06/milkmor_gir.jpg"
                  alt="gircowmilk"
                  className="recipe-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Recipe;

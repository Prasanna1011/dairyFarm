import React from "react";
import HomeNavbar from "components/EcommerceMilkMor/HomeHeader/homeNavbar";
import BannerAndSignUp from "components/EcommerceMilkMor/CommonMilkmorImage/CommonMilkmorImage";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import downloadPdf from "../../../assets/pdfs/downloadPdf.pdf";
import milkmor from "../../../assets/images/brands/milkmor.jpg";
import milkmorappdownload from "../../../assets/images/brands/milkmorappdownload.jpg";
import "./Downloads.css";

const Downloads = () => {
  return (
    <React.Fragment>
      <HomeNavbar />
      <BannerAndSignUp />
      <div style={{ background: "#FFFFFF" }}>
        <div className="container">
          <h1 className="text-center pt-5 pb-5">Downloads</h1>
          <p className="h5 pb-2">
            Milkmor brings you the mobile app. Milkmor delivers farm-fresh cow
            milk in Ahmedabad through its mobile app. The only exclusive brand
            with its tailor-made mobile app is specially made for their Milk
            Subscribers’ convenience. The Subscriber can now recharge and edit
            the quantity of milk, paneer, and curd. You can also pause whenever
            you’re out for vacation. If your guests are coming up, add the
            quantity of paneer, milk, or curd with a few taps, and you’re done.
            It’s so so easy. Enjoy farm-fresh milk, paneer, curd, and buttermilk
            through our subscription, and you can also order from our cart.
          </p>
          <p className="h4 pb-1">Why Milkmor's Mobile App</p>
          <ul>
            <li className="h5">Easy Recharge/Renewal</li>
            <li className="h5">Edit/pause Milk Subscription</li>
            <li className="h5">
              Order your ghee, shrikhand, and paneer from your mobile app
            </li>
            <li className="h5">Track Delivery Log and Wallet history</li>
            <li className="h5">
              Notifications for Milk Delivery on your mobile app
            </li>
          </ul>
          <p className="h5 pb-2">
            Know more about our farm’s fresh milk process and the life at the
            farm 24 hours. The only brand nourishes the cattle with the Happy
            Cows Model and delivers to your doorstep with their own distribution
            team and mobile app. That’s an exclusive service to ensure that the
            right quality reaches you at the right time.
          </p>
          <p className="h5 pb-5">
            Visit today’s Milkmor’s Farm to witness the process by yourself; You
            can book your appointment for a farm visit on 90222 20073. Farm
            Visit is accessible for existing Milkmor Subscribers only.
          </p>
          <div className="downlod-items-container">
            <div className="d-flex align-items-center download-items">
              <img
                src={milkmor}
                alt="logo"
                className="downloads-logo-image me-1"
              />
              <div>
                <h3>Milkmor </h3>
                <p className="h5">
                  THE BEST COW MILK BRAND OF AHMEDABAD - 2019
                </p>
                <a
                  href={downloadPdf}
                  download="Milkmor"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="download-button">Download</button>
                </a>
              </div>
            </div>

            <div className="d-flex align-items-center download-items">
              <img
                src={milkmorappdownload}
                alt="logo"
                className="downloads-logo-image me-1"
              />
              <div>
                <h3>Milkmor Mobile App</h3>
                <p className="h5">
                  Download Milkmor Mobile App For Your Android and IOS Mobiles.
                </p>
                <a
                  href={downloadPdf}
                  download="Milkmor"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="download-button">Download</button>
                </a>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Downloads;

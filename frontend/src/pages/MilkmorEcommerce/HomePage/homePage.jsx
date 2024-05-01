import React from "react";
import HomeNavbar from "../../../components/EcommerceMilkMor/HomeHeader/homeNavbar";
import HomeCarousel from "../../../components/EcommerceMilkMor/HomeCarousel/homeCarousel";
import WhyMilkmor from "../../../components/EcommerceMilkMor/BannerWhyMilkmor/whymilkmor";
import SignupBanner from "../../../components/EcommerceMilkMor/SignupBanner/signupBanner";
import Footer from "../../../components/EcommerceMilkMor/EcommerceFooter/Footer";
import "./homePage.css";

const HomePage = () => {
  return (
    <React.Fragment>
      <HomeNavbar />
      <HomeCarousel />
      <div className="enquire-now-section">
        <div className="container">
          <div className="enquire-now-alignment">
            <div className="m-1">
              <button className="order-now-button">ORDER NOW</button>
            </div>
            <div className="m-1">
              <a
                href="https://www.facebook.com/milkmorofficial/"
                target="_blank"
                rel="noreferrer"
                className="m-3"
              >
                <i
                  className="fab fa-facebook"
                  style={{ fontSize: "35px", color: "white" }}
                ></i>
              </a>
              <a
                href="https://twitter.com/MilkmorOfficial"
                target="_blank"
                rel="noreferrer"
                className="m-3"
              >
                <i
                  className="fab fa-twitter"
                  style={{ fontSize: "35px", color: "white" }}
                ></i>
              </a>
              <a
                href="https://www.instagram.com/milkmorindia/"
                target="_blank"
                rel="noreferrer"
                className="m-3"
              >
                <i
                  className="fab fa-instagram"
                  style={{ fontSize: "35px", color: "white" }}
                ></i>
              </a>
            </div>
            <div className="m-1">
              <i
                className="fas fa-phone-alt"
                style={{
                  fontSize: "30px",
                  color: "white",
                  marginRight: "10px",
                }}
              ></i>
              <a href="tel:9022220073" className="text-light h4">
                +91 9022220073
              </a>
            </div>
            <div className="d-flex flex-row m-1">
              <i
                className="bx bx-mail-send"
                style={{ fontSize: "35px", color: "white" }}
              ></i>
              <h4 className="ms-2 mt-2 text-light">Enquiry</h4>
            </div>
          </div>
        </div>
      </div>
      <WhyMilkmor />
      <SignupBanner />
      <div className="container our-farm-container">
        <h2>Our Farm</h2>
        <iframe
          width="100%"
          height="600"
          src="https://www.youtube.com/embed/W-rTqdpvrBU"
          title="YouTube Video Player"
          frameBorder="0"
          allowFullScreen
        ></iframe>
        <p className="h5 mt-4">
          When the dairy industry focuses on FAT (%) in the Milk, and the
          pricing is done accordingly, Milkmor focuses on nutrition. Milk is the
          most energetic drink in the world, and we ensure it stays that way. We
          nurture A2 & Gir Cows in our hi-tech Shed and feed them highly
          nutritious fodder, which leads to natural & nutritional cow milk. The
          fresh & consistent Milk gets delivered to your doorstep early in the
          morning within a few hours of milking.
        </p>
        <p className="h5 mt-4">
          At Astha Dairy Farm, We follow the “Happy Cows” approach, where the
          cows are sheltered at the right temperature and given nutritious
          fodder & sufficient sunlight; 24×7 Doctors are also available at the
          Shed for their health observation & emergencies. Moreover, flute music
          is played while the feed is served to the cows. As a result, Milkmor
          is also recognized as “The Best Cow Milk” of Ahmedabad by Silicon
          India as surveyed in May’19.
        </p>
        <p className="h5 mt-4">
          Now, Enjoy the natural & nutritious cow milk. And, of course, it’s
          sweeter and tastier. Your children shall love to drink it straight
          from the bottle. Now, get high protein, calcium, Vitamin B6, and B12.
          Just 2 glasses of milk/day and you nourish your body with 17 essential
          vitamins & minerals.
        </p>
        <p className="h5 mt-4">Happy Cows = Happy Milk = Happy Subscribers.</p>
        <p className="h5 mt-4 mb-4">
          The Milk is hygienically packed and delivered by our delivery boys at
          your doorstep. Non-Stop across Ahmedabad. Milkmor delivers farm-fresh
          A2 Cow milk, and it also has healthy Gir Cows and Buffalos. Enjoy
          farm-fresh paneer, desi ghee, shrikhand, buttermilk, curd and Milk
          variants.
        </p>
        <button className="read-more-button">Read More</button>
      </div>
      <div className="milkmorning-section container mt-3 mb-3">
        <h3 className="text-center">MilkMorning</h3>
        <div className="d-flex flex-row">
          <div className="w-50">
            <img
              src="https://www.milkmor.com/wp-content/uploads/2023/08/Fresh_milk_Blog.jpg"
              alt="milkmorning image1"
              className="w-100 h-100 "
            />
          </div>
          <div className="d-flex flex-column w-50">
            <img
              src="https://www.milkmor.com/wp-content/uploads/2023/05/Buffalo_milk_blog.jpg"
              alt="milkmorning image2"
              className="w-100 h-50 mb-1 ms-1"
            />
            <div className="d-flex flex-row w-100 h-100">
              <img
                src="https://www.milkmor.com/wp-content/uploads/2023/04/blog.jpg"
                alt="milkmorning image3 "
                className="w-50 h-100 me-1 ms-1"
              />
              <img
                src="https://www.milkmor.com/wp-content/uploads/2022/07/Refer_a_Subscriber_Emailer.jpg"
                alt="milkmorning image4"
                className="w-50 h-100"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default HomePage;

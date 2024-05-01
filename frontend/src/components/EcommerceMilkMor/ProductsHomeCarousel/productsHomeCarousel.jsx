import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./productsHomeCarousel.css";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import axios from "axios";
import { API_BASE_URL, API_HTML_SECTION_GET } from "customhooks/All_Api/Apis";
import { Link } from "react-router-dom";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        position: "absolute",
        height: "70px",
        width: "70px",
        right: "15px",
        zIndex: 4,
        padding: "30px",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        position: "absolute",
        height: "70px",
        width: "70px",
        left: "15px",
        zIndex: 4,
        padding: "30px",
      }}
      onClick={onClick}
    />
  );
}

const ProductsHomeCarousel = () => {
  const [htmlSectiondata, setHtmlSectionData] = useState([]);
  const [productsHomeBannerImages, setProductsHomeBannerImages] = useState([]);

  console.log("productsHomeBannerImages", productsHomeBannerImages);

  // Local storage token Start
  const config = GetAuthToken();
  const ecommerceConfig = GetEcommereceAuthToken();

  const getData = async () => {
    try {
      const { data } = await axios.get(API_HTML_SECTION_GET, ecommerceConfig);
      setHtmlSectionData(data.data);
      // Filter the data and set it in productsHomeBannerImages
      setProductsHomeBannerImages(
        data?.data?.filter((eachImage) => eachImage.type === "Banner")
      );
    } catch (error) {
      console.error("Error fetching HTML section data:", error);
    }
  };

  // get HTML section data End

  useEffect(() => {
    getData();
  }, []);

  const settings = {
    infinite: true,
    fade: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {productsHomeBannerImages.map((eachImage) => (
          <div key={eachImage.id}>
            <img
              src={`${API_BASE_URL}${eachImage.image}`}
              className="carousel-image"
              alt="slide"
            />
            <div>
              <h4
                className="text-light animate-title"
                style={{
                  fontSize: "25px",
                  fontWeight: "600",
                  position: "absolute",
                  left: "10vw",
                  top: "15vh",
                }}
              >
                {eachImage.product_title}
              </h4>
              <h1
                className="text-light carousel-product-name"
                style={{
                  fontSize: "80px",
                  fontWeight: "900",
                  position: "absolute",
                  left: "10vw",
                  top: "20vh",
                }}
              >
                {eachImage.product_name}
              </h1>
              <p
                className="text-light animate-description carousel-product-description"
                style={{
                  fontSize: "18px",
                  fontWeight: "400",
                  position: "absolute",
                  left: "10vw",
                  top: "40vh",
                  width: "40vw",
                }}
              >
                {eachImage.description}
              </p>
              <Link to="/products-shop">
                <button
                  className="text-dark animate-button carousel-product-shop-now-button"
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    position: "absolute",
                    left: "10vw",
                    top: "70vh",
                    padding: "10px 20px 10px 20px",
                    border: "none",
                    borderRadius: "20px",
                  }}
                >
                  SHOP NOW
                </button>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductsHomeCarousel;

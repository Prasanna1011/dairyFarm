import React, { useEffect, useState } from "react";
import ProductsNavbar from "../../../components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import ProductsHomeCarousel from "../../../components/EcommerceMilkMor/ProductsHomeCarousel/productsHomeCarousel";
import Footer from "../../../components/EcommerceMilkMor/EcommerceFooter/Footer";
import FeaturedProducts from "../../../components/EcommerceMilkMor/FeaturedProducts/FeaturedProducts";
import line from "../../../assets/images/brands/line.png";
import lineproducthomeimg from "../../../assets/images/brands/lineproducthomeimg.png";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import axios from "axios";
import { API_BASE_URL, API_HTML_SECTION_GET } from "customhooks/All_Api/Apis";
import "./productsHome.css";

const ProductsHome = () => {
  const [htmlSectiondata, setHtmlSectionData] = useState([]);
  const [whoweareImages, setWhoweareImages] = useState([]);
  console.log("Who we are", whoweareImages);

  // Local storage token Start
  const config = GetAuthToken();
  const ecommerceConfig = GetEcommereceAuthToken();

  const getData = async () => {
    try {
      const { data } = await axios.get(API_HTML_SECTION_GET, ecommerceConfig);
      setHtmlSectionData(data.data);
      // Filter the data and set it in productsHomeBannerImages
      setWhoweareImages(
        data.data.filter((eachImage) => eachImage.type === "Who we are")
      );
    } catch (error) {
      console.error("Error fetching HTML section data:", error);
    }
  };

  // get HTML section data End

  useEffect(() => {
    getData();
  }, []);
  return (
    <React.Fragment>
      <ProductsNavbar />
      <ProductsHomeCarousel />
      <div className="white-background">
        <div className="container">
          <div className="d-flex flex-row align-items-center justify-content-space-between w-100">
            <img src={line} alt="line" className="line-width" />
            <img
              src={lineproducthomeimg}
              alt="lineproducthomeimg"
              className="line-product-home-img"
            />
            <img src={line} alt="line" className="line-width" />
          </div>
        </div>
      </div>
      <div className="white-background">
        <h1 className="text-center">
          Our Featured <span style={{ color: "#202226" }}>Products</span>
        </h1>
        <FeaturedProducts />
        <div className="container">
          <div className="d-flex flex-row align-items-center justify-content-space-between w-100">
            <img src={line} alt="line" className="line-width" />
            <img
              src={lineproducthomeimg}
              alt="lineproducthomeimg"
              className="line-product-home-img"
            />
            <img src={line} alt="line" className="line-width" />
          </div>
        </div>
      </div>
      <div className="white-background">
        <div className="container">
          <h1 className="text-center">
            Who <span style={{ color: "#202226" }}>we are</span>
          </h1>
          <p className="text-center h5" style={{ lineHeight: "1.8" }}>
            When the entire dairy industry is working for Fat (%), Milkmor is
            focusing on nutritional values in Milk. Welcome to the world of
            "Nutritious & Delicious". Milkmor has been also awarded for "The
            Best Cow Milk of Ahmedabad".
          </p>
          <div className="who-are-we-container">
            {whoweareImages &&
              whoweareImages.map((image) => (
                <img
                  src={`${API_BASE_URL}${image.image}`}
                  key={image.id}
                  className="m-4"
                />
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default ProductsHome;

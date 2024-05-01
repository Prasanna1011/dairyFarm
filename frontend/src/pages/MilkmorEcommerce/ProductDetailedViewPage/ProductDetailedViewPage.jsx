import React, { useEffect, useState } from "react";
import ProductsNavbar from "../../../components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import { Link, useSearchParams } from "react-router-dom";
import { Card } from "reactstrap";
import "./ProductDetailedViewPage.css";
import { useLocation } from "react-router-dom";
import { API_ADD_ITEMS_TO_CART, API_BASE_URL, API_PRODUCT_VIEW_BY_ID_AND_UPDATE } from "../../../customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import line from "../../../assets/images/brands/line.png";
import lineproducthomeimg from "../../../assets/images/brands/lineproducthomeimg.png";
import FeaturedProducts from "../../../components/EcommerceMilkMor/FeaturedProducts/FeaturedProducts";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetailedViewPage = () => {
  const navigate = useNavigate();
  const config = GetAuthToken();
  const location = useLocation();
  const { id } = location && location.state;
  const ecommereceConfig = GetEcommereceAuthToken();
  const [detailedProductData, setDetailedProductData] = useState();

  let userId = null;
  let trailUsed = null;

  try {
    let userData = JSON.parse(localStorage.getItem("EcommerceTokenData"));
    userId = userData.userId;
    trailUsed = userData.trail_used;
  } catch (e) {
    console.log(e);
  }

  const getProductDetailedData = async () => {
    try {
      const { data } = await axios.get(
        `${API_PRODUCT_VIEW_BY_ID_AND_UPDATE}${id}`,
        ecommereceConfig
      );
      setDetailedProductData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onAddItemsToCartClick = async (id, type) => {
    if (ecommereceConfig == null) {
      navigate("/customer-login");
    } else {
      if (type === "Scheduled") {
        const productData = {
          product: id,
          qty_day1: 1,
          qty_day2: 0,
          order_type: "subscription",
        };
        try {
          const { data } = await axios.post(
            API_ADD_ITEMS_TO_CART,
            productData,
            ecommereceConfig
          );
          navigate("/subscription-cart");
        } catch (error) {
          console.log(error);
        }
      } else {
        const productData = {
          product: id,
          qty_day1: 1,
          qty_day2: 0,
          order_type: "cart",
        };
        try {
          const { data } = await axios.post(
            API_ADD_ITEMS_TO_CART,
            productData,
            ecommereceConfig
          );
          navigate("/cart-order");
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const onAddTrailItemsToCart = async (id) => {
    if (ecommereceConfig == null) {
      navigate("/customer-login");
    } else {
      const productData = {
        product: id,
        qty_day1: 1,
        qty_day2: 0,
        order_type: "trial",
      };
      try {
        const { data } = await axios.post(
          API_ADD_ITEMS_TO_CART,
          productData,
          ecommereceConfig
        );

        if (data.message == "Item added to cart") {
          navigate("/trail-order-cart");
        } else {
          console.log("One Item allowed", data);
          toast.error(data.message, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getProductDetailedData();
  }, []);

  return (
    <React.Fragment>
      <ProductsNavbar />
      <div className="products-banner d-flex flex-column align-items-center justify-content-center">
        <div className="container ">
          <h1 className="text-center text-light">PRODUCT DETAILS</h1>
          <Link to="/products-home">
            <h6 className="text-center text-light">
              <i className="fas fa-arrow-left me-2"></i>Back
            </h6>
          </Link>
        </div>
      </div>
      <Card className="container mt-4 p-3 shadow-lg">
        <div className="product-details-main-container">
          <div className="product-details-container-one ">
            <img
              src={`${API_BASE_URL}${
                detailedProductData && detailedProductData.profile_picture
              }`}
              alt="product-image"
              className="detailed-view-product-image "
            />
          </div>
          <div className="product-details-container-two">
            {detailedProductData &&
              detailedProductData.product_classification == "Saleable" && (
                <>
                  <h5 className="text-dark m-2">
                    {detailedProductData && detailedProductData.product_name}
                  </h5>
                  <h5 style={{ color: "#3B6BB5" }} className="m-2">
                    <i className="fas fa-rupee-sign me-1"></i>
                    {`${
                      detailedProductData && detailedProductData.product_rate
                    }.00/${
                      detailedProductData &&
                      detailedProductData.product_uom_quantity
                    }${detailedProductData && detailedProductData.product_uom}`}
                  </h5>
                  <div className="w-100">
                    <hr className="horizontal-rule" />
                  </div>
                  <p
                    className="m-2"
                    style={{ fontSize: "15px", color: "#696969" }}
                  >
                    {detailedProductData && detailedProductData.description}
                  </p>

                  {detailedProductData &&
                  detailedProductData.product_type === "Scheduled" ? (
                    <div>
                      <button
                        className="product-buttons h6"
                        onClick={(e) =>
                          onAddItemsToCartClick(
                            detailedProductData && detailedProductData.id,
                            detailedProductData &&
                              detailedProductData.product_type
                          )
                        }
                      >
                        SUBSCRIBE
                      </button>

                      <button
                        className={
                          trailUsed == true
                            ? "product-buttons-disabled"
                            : "product-buttons h6"
                        }
                        onClick={(e) =>
                          onAddTrailItemsToCart(
                            detailedProductData && detailedProductData.id,
                            detailedProductData &&
                              detailedProductData.product_type
                          )
                        }
                        disabled={trailUsed}
                      >
                        TRIAL
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <button
                          className="product-buttons h6"
                          onClick={(e) =>
                            onAddItemsToCartClick(
                              detailedProductData && detailedProductData.id,
                              detailedProductData &&
                                detailedProductData.product_type
                            )
                          }
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            <hr className="horizontal-rule" />
            <div className="m-2 d-flex aligin-items-center">
              <h6 className="me-5">
                Product Category :
                <span>
                  {" "}
                  {detailedProductData && detailedProductData.product_category}
                </span>
              </h6>
              <h6>
                Product Type :
                <span>
                  {" "}
                  {detailedProductData && detailedProductData.product_type}
                </span>
              </h6>
            </div>
          </div>
        </div>
      </Card>
      <div className="d-flex flex-row align-items-center justify-content-space-between w-100 container">
        <img src={line} alt="line" className="line-width" />
        <img
          src={lineproducthomeimg}
          alt="lineproducthomeimg"
          className="line-product-home-img"
        />
        <img src={line} alt="line" className="line-width" />
      </div>
      <FeaturedProducts />
      <Footer />
    </React.Fragment>
  );
};

export default ProductDetailedViewPage;

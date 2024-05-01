import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import axios from "axios";
import { API_PRODUCT_POST_GET, API_BASE_URL, API_ADD_ITEMS_TO_CART } from "customhooks/All_Api/Apis";
import { Link } from "react-router-dom";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import { useNavigate } from "react-router-dom";
import "./FeaturedProducts.css";
import { toast } from "react-toastify";

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
        borderRadius: "40px",
        height: "70px",
        width: "70px",
        left: "0px",
        padding: "30px",
        background: "rgba(59, 102, 160, 0.5)",
        zIndex: 2,
        alignSelf: "center",
      }}
      onClick={onClick}
    />
  );
}

const FeaturedProducts = () => {
  const [featuredProductsData, setFeaturedProductsData] = useState([]);
  const navigate = useNavigate();
  const ecommereceConfig = GetEcommereceAuthToken();
  const config = GetAuthToken();

  let userId = null;
  let trailUsed = null;

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


  const checkToken = () => {
    try {
      let userData = JSON.parse(localStorage.getItem("EcommerceTokenData"));
      userId = userData&&userData.userId;
      trailUsed = userData&&userData.trail_used;
    } catch (e) {
      console.log(error);
    }
  }



  const getData = async () => {
    try {
      const { data } = await axios.get(API_PRODUCT_POST_GET);
      setFeaturedProductsData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    checkToken()
  }, []);

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    dots: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="featured-products-container">
      <div className="container">
        <div className="carousel-container">
          <Slider {...settings}>
            {featuredProductsData &&
              featuredProductsData.map(
                (products) =>
                  products.product_classification == "Saleable" && (
                    <div className="featured-card m-3" key={products.id}>
                      <img
                        src={`${API_BASE_URL}${products.profile_picture}`}
                        className="featured-product-image"
                      />
                      <h4 className="m-1 text-center">
                        {products.product_name}
                      </h4>
                      <h6 className="m-1 text-center" style={{height: "60px", overflow: "hidden"}}>
                        {products.description}
                      </h6>
                      <h5
                        style={{ color: "#3B6BB5" }}
                        className="m-2 text-center"
                      >
                        <i className="fas fa-rupee-sign me-1"></i>
                        {`${products.product_rate}.00/${products.product_uom_quantity}${products.product_uom}`}
                      </h5>
                      {products.product_type === "Scheduled" ? (
                        <div>
                          <button
                            className="product-buttons h6"
                            onClick={(e) =>
                              onAddItemsToCartClick(
                                products.id,
                                products.product_type
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
                                products.id,
                                products.product_type
                              )
                            }
                            disabled={trailUsed}
                          >
                            TRIAL
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            className="product-buttons h6"
                            onClick={(e) =>
                              onAddItemsToCartClick(
                                products.id,
                                products.product_type
                              )
                            }
                          >
                            ADD TO CART
                          </button>
                        </div>
                      )}
                    </div>
                  )
              )}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
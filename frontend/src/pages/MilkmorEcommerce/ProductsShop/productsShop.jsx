import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import {
  API_PRODUCT_CATEGORY_GET_POST,
  API_PRODUCT_POST_GET,
  API_BASE_URL,
  API_ADD_ITEMS_TO_CART,
} from "../../../customhooks/All_Api/Apis";
import "./productsShop.css";
import { Link } from "react-router-dom";
import axios from "axios";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ProductsShop = () => {
  const navigate = useNavigate();
  const config = GetAuthToken();
  const ecommereceConfig = GetEcommereceAuthToken();
  const [categoryData, setCategoryData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [productCardView, setProductCardView] = useState("grid");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [cartItems, setCartItems] = useState([])

  console.log("cartItems", cartItems);

  let userId = null;
  let trailUsed = null;

  try {
    let userData = JSON.parse(localStorage.getItem("EcommerceTokenData"));
    userId = userData.userId;
    trailUsed = userData.trail_used;
  } catch (e) {
    console.log(e);
  }

  const getCartData = async () => {
    try {
      const { data } = await axios.get(API_ADD_ITEMS_TO_CART, ecommereceConfig);
      setCartItems(data?.items);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Filter products based on selected types
  const filteredProducts = productsData.filter((product) => {
    return (
      selectedTypes.length === 0 ||
      selectedTypes.includes(product.product_category)
    );
  });

  const handleGetProductsCategory = async () => {
    try {
      const { data } = await axios.get(API_PRODUCT_CATEGORY_GET_POST, ecommereceConfig);
      setCategoryData(data.data);
    } catch (error) {
      console.error("Error fetching Products Category:", error);
    }
  };

  const handleGetProducts = async () => {
    try {
      const { data } = await axios.get(API_PRODUCT_POST_GET, ecommereceConfig);
      setProductsData(data.data);
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
  };

  const onAddItemsToCartClick = async (id, type) => {
    if (ecommereceConfig == null) {
      navigate("/customer-login");
    } else {
      if (type === "Scheduled") {
        if (cartItems && cartItems[0] && cartItems && cartItems[0].product.product_type === "Non-Scheduled") {
          if (window.confirm("Previous Cart Items will be deleted. Are you sure to Continue?")) {
            const productData = {
              product: id,
              qty_day1: 1,
              qty_day2: 0,
              order_type: "subscription",
            };
            try {
              const { data } = await axios.post(API_ADD_ITEMS_TO_CART, productData, ecommereceConfig);
              navigate("/subscription-cart");
            } catch (error) {
              console.log(error);
            }
          }
        } else {
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
        }

      } else {
        if (cartItems && cartItems[0] && cartItems && cartItems[0].product.product_type === "Scheduled") {
          if (window.confirm("Previous Cart Items will be deleted. Are you sure to Continue?")) {
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
    handleGetProductsCategory();
    handleGetProducts();
    getCartData();
  }, []);

  return (
    <React.Fragment>
      <ToastContainer />
      <ProductsNavbar />
      <div className="products-banner d-flex flex-column align-items-center justify-content-center">
        <div className="container ">
          <h1 className="text-center text-light">SHOP</h1>
          <Link to="/products-home">
            <h6 className="text-center text-light">
              <i className="fas fa-arrow-left me-2"></i>Back
            </h6>
          </Link>
        </div>
      </div>
      <div className="main-products-category-container">
        <div className="container ">
          <div className="prodcut-and-category-container">
            <div className="category-container">
              <h5 className="text-dark">CATEGORIES</h5>
              {categoryData.map((eachCategory) => (
                <div
                  className="d-flex align-items-center m-2"
                  key={eachCategory.id}
                >
                  <input
                    type="checkbox"
                    id={`categoryCheckbox${eachCategory.id}`}
                    style={{ cursor: "pointer" }}
                    onChange={() =>
                      handleCheckboxChange(eachCategory.product_category_name)
                    }
                    checked={selectedTypes.includes(
                      eachCategory.product_category_name
                    )}
                  />
                  <label
                    className=" m-2 text-dark"
                    htmlFor={`categoryCheckbox${eachCategory.id}`}
                    style={{ cursor: "pointer" }}
                  >
                    {eachCategory.product_category_name}
                  </label>
                </div>
              ))}
            </div>
            <div className="products-container">
              <div className="ms-4">
                <i
                  className={`fas fa-th me-3 ${productCardView === "grid"
                    ? "view-selected"
                    : "view-unselected"
                    }`}
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={() => setProductCardView("grid")}
                ></i>
                <i
                  className={`fas fa-list me-3 ${productCardView === "list"
                    ? "view-selected"
                    : "view-unselected"
                    }`}
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={() => setProductCardView("list")}
                ></i>
              </div>
              {productCardView === "grid" ? (
                <div className="products-data-container">
                  {filteredProducts &&
                    filteredProducts.map(
                      (eachProduct) =>
                        eachProduct.product_classification == "Saleable" && (
                          <div className="product-card" key={eachProduct.id}>
                            <Link
                              to="/product-detailed-view"
                              state={{ id: eachProduct.id }}
                              className="text-center"
                            >
                              <img
                                src={`${API_BASE_URL}${eachProduct.profile_picture}`}
                                alt="product-image"
                                className="product-image"
                              />
                              <h5 className="text-dark text-center m-2">
                                {eachProduct.product_name}
                              </h5>

                              <h5 style={{ color: "#3B6BB5" }} className="m-2">
                                <i className="fas fa-rupee-sign me-1"></i>
                                {`${eachProduct.product_rate}.00/${eachProduct.product_uom_quantity}${eachProduct.product_uom}`}
                              </h5>
                            </Link>
                            {eachProduct.product_type === "Scheduled" ? (
                              <div>
                                <button
                                  className="product-buttons h6"
                                  onClick={(e) =>
                                    onAddItemsToCartClick(
                                      eachProduct.id,
                                      eachProduct.product_type
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
                                      eachProduct.id,
                                      eachProduct.product_type
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
                                      eachProduct.id,
                                      eachProduct.product_type
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
                </div>
              ) : (
                <div className="products-data-container">
                  {filteredProducts &&
                    filteredProducts.map(
                      (eachProduct) =>
                        eachProduct.product_classification == "Saleable" && (
                          <div
                            className="product-card-list"
                            key={eachProduct.id}
                          >
                            <Link
                              to="/product-detailed-view"
                              state={{ id: eachProduct.id }}
                              className="container-one"
                            >
                              <img
                                src={`${API_BASE_URL}${eachProduct.profile_picture}`}
                                alt="product-image"
                                className="product-image"
                              />
                            </Link>
                            <div className="container-two">
                              <Link
                                to="/product-detailed-view"
                                state={{ id: eachProduct.id }}
                              >
                                <h5 className="text-dark m-2">
                                  {eachProduct.product_name}
                                </h5>
                                <h5
                                  style={{ color: "#3B6BB5" }}
                                  className="m-2"
                                >
                                  <i className="fas fa-rupee-sign me-1"></i>
                                  {`${eachProduct.product_rate}.00/${eachProduct.product_uom_quantity}${eachProduct.product_uom}`}
                                </h5>
                                <div className="w-100">
                                  <hr className="horizontal-rule" />
                                </div>
                                <p
                                  className="m-2"
                                  style={{ fontSize: "15px", color: "#696969" }}
                                >
                                  {eachProduct.description}
                                </p>
                              </Link>
                              {eachProduct.product_type === "Scheduled" ? (
                                <div>
                                  <button
                                    className="product-buttons h6"
                                    onClick={(e) =>
                                      onAddItemsToCartClick(
                                        eachProduct.id,
                                        eachProduct.product_type
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
                                        eachProduct.id,
                                        eachProduct.product_type
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
                                        eachProduct.id,
                                        eachProduct.product_type
                                      )
                                    }
                                  >
                                    ADD TO CART
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default ProductsShop;

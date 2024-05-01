const GetEcommereceAuthToken = () => {
    const authUser = JSON.parse(localStorage.getItem("EcommerceTokenData"));
    if (!authUser || !authUser.token) {
      console.log("Token not found in localStorage");
      return null;
    }
  
    const ecommereceConfig = {
      headers: {
        Authorization: `token ${authUser.token}`,
      },
    };
  
    return ecommereceConfig;
  };
  
  export default GetEcommereceAuthToken;
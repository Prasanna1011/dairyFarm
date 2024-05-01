const GetAuthToken = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  if (!authUser || !authUser.token) {
    console.log("Token not found in localStorage");
    return null;
  }

  // Extract first_name and last_name
  const { first_name, last_name,department_type_name ,designation } = authUser;

  const config = {
    headers: {
      Authorization: `token ${authUser.token}`,
    },
  };

  return { config, first_name, last_name ,department_type_name ,designation };
};

export default GetAuthToken;

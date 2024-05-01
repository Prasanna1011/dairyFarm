import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { authProtectedRoutes } from "routes";
import { API_GET_ROLE_PERMSSIONS_DATA } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

const Authmiddleware = (props) => {
  const location = useLocation();
  const routePath = location?.pathname;
  const navigate = useNavigate();

  const config = GetAuthToken();
  const [userPermissions, setUserPermissions] = useState(null);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const { data } = await axios.get(API_GET_ROLE_PERMSSIONS_DATA, config.config);
        setUserPermissions(data.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setUserPermissions([]);
      }
    };

    const token = localStorage.getItem("authUser");
    if (token && !userPermissions) {
      fetchUserPermissions();
    } else if (!token) {
      const from = location ? { from: location } : {};
      navigate("/admin-login", from);
    }
  }, [config, location, navigate, userPermissions]);

  useEffect(() => {
    if (userPermissions === null) {
      fetchUserPermissions();
    }
  }, [userPermissions]);

  const fetchUserPermissions = async () => {
    try {
      const { data } = await axios.get(API_GET_ROLE_PERMSSIONS_DATA, config.config);
      setUserPermissions(data.data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      setUserPermissions([]);
    }
  };

  if (!localStorage.getItem("authUser")) {
    const from = location ? { from: location } : {};
    navigate("/admin-login", from);
    return null;
  }

  const checkPermissionForRoute = (permissions, routePath) => {
    const currentRoute = authProtectedRoutes?.find((route) => route.path === routePath);

    if (!currentRoute || !currentRoute.module_name || !currentRoute.method_name) {
      return true;
    }

    const requiredPermissions = permissions
      ? getPermissionsForRoute(permissions, currentRoute)
      : [];
    const userPermissionsLowerCase = permissions
      ? permissions.map(
          (permission) =>
            `${permission?.resource?.name}_${permission?.method?.name}`.toLowerCase()
        )
      : [];

    if (requiredPermissions.length === 0) {
      return false;
    }

    return requiredPermissions.every((permission) =>
      userPermissionsLowerCase.includes(permission.toLowerCase())
    );
  };

  const getPermissionsForRoute = (permissions, route) => {
    const modulePermissions = permissions.filter(
      (permission) =>
        permission?.resource?.name === route?.module_name &&
        permission?.method?.name === route?.method_name
    );
    return modulePermissions.map(
      (permission) => `${permission.resource.name}_${permission.method.name}`
    );
  };

  const hasPermission = checkPermissionForRoute(userPermissions, routePath);

  return hasPermission ? (
    <React.Fragment>{props?.children}</React.Fragment>
  ) : (
    navigate("/dashboard")
  );
};

export default Authmiddleware;

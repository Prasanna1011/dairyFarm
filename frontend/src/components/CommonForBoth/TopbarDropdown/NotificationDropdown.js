import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { API_HUB_MANAGE_TASK_GET } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { useNavigate } from "react-router-dom";


//i18n
import { withTranslation } from "react-i18next";
import axios from "axios";
import { Link, Route } from "react-router-dom";
import NotificationTaskManager from "pages/NotificationTaskManager/NotificationTaskManager";

const NotificationDropdown = props => {
  const [taskData, setTaskData] = useState()
  const { config, first_name, last_name } = GetAuthToken();

  const navigate = useNavigate()

  const getTaskData = async () => {
    try {
      const { data } = await axios.get(`${API_HUB_MANAGE_TASK_GET}?status=&hub_id=`, config);
      setTaskData(data)
    } catch (error) {
      console.log(error);
    }
  }

  const handleNotificationClick = () => {
    navigate("/notification-task-manager")
  }

  useEffect(() => {
    getTaskData();
  }, []);

  return (
    <React.Fragment>
        <div
          className="btn header-item noti-icon position-relative mt-3"
          tag="button"
          id="page-header-notifications-dropdown"
          onClick={handleNotificationClick} 
        >
          <i className="fas fa-bell bx-tada" />
        </div>
    </React.Fragment>
  );
};

export default withTranslation()(NotificationDropdown);

NotificationDropdown.propTypes = {
  t: PropTypes.any
};
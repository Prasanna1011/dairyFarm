import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";

import axios from "axios";
import { API_LOGIN } from "customhooks/All_Api/Apis";
import { toast } from "react-toastify";

// const fireBaseBackend = getFirebaseBackend() `

// login user Start

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(axios.post, `${API_LOGIN}`, {
      mobile_no: user.mobile_no,
      password: user.password,
    });
    localStorage.setItem("authUser", JSON.stringify(response.data));

    yield put(loginSuccess(response.data));
    toast.success("Login successfully ", {
      autoClose: 3000,
      position: "top-center",
      closeOnClick: true,
      draggable: true,
      theme: "light",
    });
    history("/dashboard");

    // Show success toast when the login is successful
  } catch (error) {
    history("/admin-login");
    toast.error("Check User Id or Password", {
      autoClose: 3000,
      position: "top-center",
      closeOnClick: true,
      draggable: true,
      theme: "light",
    });
  }
}
// login user End

// main logout start

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
    toast.success("Logged Out successfully ", {
      autoClose: 3000,
      position: "top-center",
      closeOnClick: true,
      draggable: true,
      theme: "light",
    });
    history("/admin-login");
  } catch (error) {
    yield put(apiError(error));
    toast.error("Something Went Wrong", {
      autoClose: 3000,
      position: "top-center",
      closeOnClick: true,
      draggable: true,
      theme: "light",
    });
  }
}
// main logout End

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;

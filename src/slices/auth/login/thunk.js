//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
} from "../../../helpers/fakebackend_helper";
import { APIClient, getLoggedinUser } from "../../../helpers/api_helper";

const api = new APIClient();

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag, login_process } from './reducer';

const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;

export const loginUser = (user, history) => async (dispatch) => {

  try {
    let response;
    dispatch(login_process(''));

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.loginUser(
        user.email,
        user.password
      );
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = postJwtLogin({
        email: user.email,
        password: user.password
      });
    } else if (API_URI_RBAC) {
      const formData = new URLSearchParams();
      formData.append('email', user.email);
      formData.append('password', user.password);

      response = fetch(`${API_URI_RBAC}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
          // json: true,
        }
      );

    } else if (process.env.REACT_APP_API_URL) {
      response = postFakeLogin({
        email: user.email,
        password: user.password,
      });
    }

    var data = await response;

    if (data) {
      if (API_URI_RBAC) {
        data = await data.json();
        if (data.status === true) {

          // sesuaikan data session storage dengan yang existing
          let finalLogin = {
            "status": "success",
            "token": data.data.token,
            "data": {
              "_id": "629f15c770a470a230cc5d5a",
              "first_name": "SIPD-HUB",
              "email": user.email,
              "password": null,
              "confirm_password": null,
              "changePasswordAt": null,
              "skills": [],
              "__v": 1,
              "passwordtoken": data.data.token,
              "passwordtokenexp": data.data.expirationTime,
              "exp_year": [],
              "portfolio": []
            }
          };
          sessionStorage.setItem("authUser", JSON.stringify(finalLogin));
          dispatch(loginSuccess(finalLogin));
          history('/beranda')
        } else {
          dispatch(apiError({ data: "Login Failed" }));
        }
      } else {
        sessionStorage.setItem("authUser", JSON.stringify(data));
        // if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
        if (process.env.REACT_APP_DEFAULTAUTH === "") {
          var finallogin = JSON.stringify(data);
          finallogin = JSON.parse(finallogin)
          data = finallogin.data;
          if (finallogin.status === "success") {
            dispatch(loginSuccess(data));
            history('/beranda')
          } else {
            dispatch(apiError(finallogin));
          }
        } else {
          dispatch(loginSuccess(data));
          history('/beranda')
        }
      }
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem("authUser");
    let fireBaseBackend = getFirebaseBackend();
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = fireBaseBackend.logout;
      dispatch(logoutUserSuccess(response));
    } else {
      dispatch(logoutUserSuccess(true));
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type, history) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
    //   response = postSocialLogin(data);
    // }

    const socialdata = await response;
    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history('/beranda')
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const get_user_detail = () => async (dispatch) => {
  let response = api.get(`${API_URI_RBAC}/users/detail-users`);

  let data = await response;

  // update session storage
  const user_login = getLoggedinUser();
  user_login.data.first_name = data?.data?.first_name || 'SIPD-HUB';
  user_login.roles = data?.roles;

  sessionStorage.setItem("authUser", JSON.stringify(user_login));

  dispatch(loginSuccess(user_login));
}
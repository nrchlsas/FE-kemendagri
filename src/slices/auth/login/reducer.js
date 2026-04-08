import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: null,
  error: "", // for error message
  loading: false,
  isUserLogout: false,
  errorMsg: false, // for error
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login_process(state, action) {
      state.error = '';
      state.loading = true;
      state.isUserLogout = false;
      state.errorMsg = false;
    },
    apiError(state, action) {
      state.error = action.payload.data;
      state.loading = false;
      state.isUserLogout = false;
      state.errorMsg = true;
    },
    loginSuccess(state, action) {
      state.user = action.payload;
      state.error = '';
      state.loading = false;
      state.errorMsg = false;
    },
    logoutUserSuccess(state, action) {
      state.isUserLogout = true
    },
    reset_login_flag(state) {
      state.error = null
      state.loading = false;
      state.errorMsg = false;
    }
  },
});

export const {
  apiError,
  loginSuccess,
  logoutUserSuccess,
  reset_login_flag,
  login_process
} = loginSlice.actions

export default loginSlice.reducer;
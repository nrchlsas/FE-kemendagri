import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  error: "",
  success: "",
  user: {},
  list_menus: []
};

const ProfileSlice = createSlice({
  name: "Profile",
  initialState,
  reducers: {
    profileSuccess(state, action) {
      state.success = action.payload.status;
      state.user = action.payload.data
    },
    profileError(state, action) {
      state.error = action.payload
    },
    editProfileChange(state) {
      state = { ...state };
    },
    resetProfileFlagChange(state) {
      state.success = null
    },
    update_list_menu(state, action) {
      state.list_menus = action.payload;
    }
  },
});

export const {
  profileSuccess,
  profileError,
  editProfileChange,
  resetProfileFlagChange,
  update_list_menu
} = ProfileSlice.actions

export default ProfileSlice.reducer;
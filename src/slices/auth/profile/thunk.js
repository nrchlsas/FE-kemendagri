//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { postFakeProfile, postJwtProfile } from "../../../helpers/fakebackend_helper";

// action
import { profileSuccess, profileError, resetProfileFlagChange } from "./reducer";

import { APIClient } from "../../../helpers/api_helper";

const api = new APIClient();
const fireBaseBackend = getFirebaseBackend();
const API_9007_URI = `${process.env.REACT_APP_API_URL_9007}`;

export const editProfile = (user) => async (dispatch) => {
    try {
        let response;

        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            response = fireBaseBackend.editProfileAPI(
                user.username,
                user.idx
            );

        } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {

            response = postJwtProfile(
                {
                    username: user.username,
                    idx: user.idx,
                }
            );

        } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
            response = postFakeProfile(user);
        }

        const data = await response;

        if (data) {
            dispatch(profileSuccess(data));
        }

    } catch (error) {
        dispatch(profileError(error));
    }
};

export const resetProfileFlag = () => {
    try {
        const response = resetProfileFlagChange();
        return response;
    } catch (error) {
        return error;
    }
};

export const load_menu_by_profile = (user) => async (dispatch) => {
    console.log('load_menu_by_profile', user);
    let response = api.create(`${API_9007_URI}/rbac/list-menu`, {
        "nama-saya": "Bon Bon Saja"
    });
    console.log('response', response);
    let data = await response;
    console.log({ data });
}
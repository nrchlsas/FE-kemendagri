//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { postFakeProfile, postJwtProfile } from "../../../helpers/fakebackend_helper";

// action
import { profileSuccess, profileError, resetProfileFlagChange, update_list_menu } from "./reducer";

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
    let response = api.create(`${API_9007_URI}/rbac/list-menu`);
    let data = await response;

    let list_menu = [];
    if (data.code == 200) {
        list_menu = data.data;
    }

    dispatch(update_list_menu(list_menu));
}

export const calculate_menu_by_login = (menus = [], login_menus = []) => {
    const final_menus = [];
    const menus_only = login_menus.filter(d => d.is_menu === true);
    let check_menus = [];

    if (menus_only.length == 0) {
        // debug with dummy data

        // // menu beranda
        // check_menus.push({
        //     id: 99,
        //     is_menu: true,
        //     nama_menu: "Beranda",
        //     nama_sub_menu: null,
        //     url: "/beranda"
        // });

        // // menu kependudukan
        // check_menus.push({
        //     id: 99,
        //     is_menu: true,
        //     nama_menu: "Kependudukan",
        //     nama_sub_menu: "",
        //     url: "/kependudukan"
        // });

        // // menu sipd
        // check_menus.push({
        //     id: 99,
        //     is_menu: true,
        //     nama_menu: "SIPD",
        //     nama_sub_menu: "Perencanaan",
        //     url: "/perencanaan"
        // });

        // // menu rbac
        // check_menus.push({
        //     id: 999,
        //     is_menu: true,
        //     nama_menu: "rbac",
        //     nama_sub_menu: "menu",
        //     url: "/menu"
        // });
        // check_menus.push({
        //     id: 999,
        //     is_menu: true,
        //     nama_menu: "rbac",
        //     nama_sub_menu: "Pengguna",
        //     url: "/pengguna"
        // });
    } else {
        check_menus = menus_only;
    }

    menus.forEach(d => {
        if (d.subItems && d.subItems.length) {
            let add_parent = false;
            // mempunya anak, yang harus di check adalah anaknya
            const clone_subItems = JSON.parse(JSON.stringify(d.subItems));

            d.subItems = [];
            clone_subItems.forEach(sub => {
                const found = check_menus.find(i => i.url == sub.link);
                if (found) {
                    add_parent = true;
                    d.subItems.push(sub);
                }
            })
            if (add_parent) {
                final_menus.push(d);
            }
        } else {
            // tidak memiliki anak, ini adalah link
            const found = check_menus.find(i => i.url == d.link);
            if (found) {
                final_menus.push(d);
            }
        }
    })

    // return menus;
    return final_menus;
}

export const get_permission_by_url = (url, is_page, cb) => (dispatch, getState) => {
    const { list_menus } = getState().Profile;
    console.log(list_menus, 'ini list menus')
    if (is_page) {
        const list_page = list_menus.filter(d => d.is_menu);
        const found = list_page.find(d => d.is_menu && d.url == url);
        console.log(list_page, 'ini isi list_page')
        console.log(found, 'ini isi found')
        if (!found && typeof cb === "function") {
            console.error('tidak memimilik hak akses untuk', url);
            cb();
        }
    } else {
        const list_page = list_menus.filter(d => !d.is_menu);
        const found = list_page.find(d => d.is_menu && d.url == url);
        if (!found && typeof cb === "function") {
            console.error('tidak memimilik hak akses untuk', url);
            cb();
        }
    }
}
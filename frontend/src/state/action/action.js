import {
    GETCATEGORIES,
    FETCHERRORS
} from './actionTypes'
import { jwtDecode } from 'jwt-decode';

const host = process.env.REACT_APP_HOST;



//:::::::::::::::::::::: Token Decode :::::::::::::::::::::::::::::::::::
export const fn_token_decode = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const decoded = token ? jwtDecode(token) : null;
        return decoded
    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}

//::::::::::::::::::::::: Login User ::::::::::::::::::::::::::::::::::::::::: 

export const fn_login_user = (data) => async (dispatch) => {
    try {
        const response = await fetch(`${host}/loginuser`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })
        const json = await response.json();
        return json;

    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}

//::::::::::::::::::::::: Product ::::::::::::::::::::::::::::::::::::::::::::::::::

// ::::::::::::::::::::::: Add Category :::::::::::::::::::::::::::::::::::::::::::::::::

export const fn_add_category = (data) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/addcategory`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            },
            body: JSON.stringify(data)
        })
        const json = await response.json();
        return json;

    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}

//:::::::::::::::::::::::: Show categories :::::::::::::::::::::::::::::::::::::::::::::::::
export const fn_show_categories = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/showcategories`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }
        })
        const json = await response.json();
        dispatch({ type: GETCATEGORIES, payload: json })


    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}


//:::::::::::::::::::::::: Add Products :::::::::::::::::::::::::::::::::::::::::::::::::
export const fn_add_products = (data) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/addproducts`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            },
            body: JSON.stringify(data)
        })
        const json = await response.json();
        return json;

    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}




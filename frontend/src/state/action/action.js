import {
    GETCATEGORIES,
    GETCUSTOMERS,
    GETPRODUCTS,
    GETSUPPLIERS,
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


export const fn_show_products = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/showproducts`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }
        })
        const json = await response.json();
        dispatch({ type: GETPRODUCTS, payload: json })


    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}

//:::::::::::::::::::::::: Add Supplier :::::::::::::::::::::::::::::::::::::::::::::::::
export const fn_add_supplier = (supplierName, contactName, phone, email, address) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const data = {
            supplierName: supplierName,
            contactName: contactName,
            phone: phone,
            email: email,
            addresses: address
        };
        const response = await fetch(`${host}/addsupplier`, {
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


export const fn_show_suppliers = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/showsuppliers`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }
        })
        const json = await response.json();
        dispatch({ type: GETSUPPLIERS, payload: json })


    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}

//:::::::::::::::::::::::: Add Customer :::::::::::::::::::::::::::::::::::::::::::::::::
export const fn_add_customer = (customerName, contactName, phone, email, address) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const data = {
            customerName: customerName,
            contactName: contactName,
            phone: phone,
            email: email,
            addresses: address
        };
        const response = await fetch(`${host}/addcustomer`, {
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

export const fn_show_customers = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/showcustomers`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }
        })
        const json = await response.json();
        dispatch({ type: GETCUSTOMERS, payload: json })


    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}

//:::::::::::::::::::::::: Add Purchase Order :::::::::::::::::::::::::::::::::::::::::::::::::

export const fn_add_purchase_order = (supplierId, productId, quantity, unitPrice) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const data = {
            supplierId: supplierId,
            productId: productId,
            quantity: quantity,
            unitPrice: unitPrice
        };
        const response = await fetch(`${host}/addpurchaseorder`, {
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


//:::::::::::::::::::::::: Add Sales Order :::::::::::::::::::::::::::::::::::::::::::::::::

export const fn_add_sales_order = (customerId, productId, quantity, unitPrice) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const data = {
            customerId: customerId,
            productId: productId,
            quantity: quantity,
            unitPrice: unitPrice
        };
        const response = await fetch(`${host}/addsalesorder`, {
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

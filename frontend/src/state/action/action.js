import {
    GETCATEGORIES,
    GETCUSTOMERS,
    GETPRODUCTS,
    GETSUPPLIERS,
    GETPURCHASEORDER,
    GETSALESORDER,
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


// ::::::::::::::::::::::: Update Category :::::::::::::::::::::::::::::::::::::::::::::::::

export const fn_update_category = (data) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/updatecategory`, {
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


// ::::::::::::::::::::::: Update Products :::::::::::::::::::::::::::::::::::::::::::::::::

export const fn_update_products = (data) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/updateproducts`, {
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

//::::::::::::::::::::::: Show Product By Id :::::::::::::::::::::::::::::::::::::
export const fn_show_products_by_id = (productId) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/showproductbyid`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }, body: JSON.stringify({ productId: productId })
        })
        const json = await response.json();
        return json;


    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}


//::::::::::::::::::::::: Show Inventory Summary report :::::::::::::::::::::::::::::::::::::
export const fn_show_inventory_summary = (dateFrom, dateTo, productId) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/inventorytransactionsummary`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }, body: JSON.stringify({ dateFrom: dateFrom, dateTo: dateTo, productId: productId })
        })
        const json = await response.json();
        return json;

    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}


//::::::::::::::::::::::: Show Inventory Detail report :::::::::::::::::::::::::::::::::::::
export const fn_show_inventory_detail = (dateFrom, dateTo, productId) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/inventorytransactiondetail`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }, body: JSON.stringify({ dateFrom: dateFrom, dateTo: dateTo, productId: productId})
        })
        const json = await response.json();
        return json;

    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}

//::::::::::::::::::::::: Show batch details :::::::::::::::::::::::::::::::::::::
export const fn_show_batch_detail = (productId, batchName, documentId, documentName) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/showbatchdetail`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }, body: JSON.stringify({ productId: productId, batchName: batchName, documentId: documentId, documentName: documentName})
        })
        const json = await response.json();
        return json;

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

// ::::::::::::::::::::::: Update Customers :::::::::::::::::::::::::::::::::::::::::::::::::

export const fn_update_customer = (customerName, contactName, phone, email, address, id) => async (dispatch) => {
    try {
        const data = {
            customerName: customerName,
            contactName: contactName,
            phone: phone,
            email: email,
            addresses: address,
            id: id
        };
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/updatecustomer`, {
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


// ::::::::::::::::::::::: Update Supplier :::::::::::::::::::::::::::::::::::::::::::::::::

export const fn_update_supplier = (supplierName, contactName, phone, email, address, id) => async (dispatch) => {
    try {
        const data = {
            supplierName: supplierName,
            contactName: contactName,
            phone: phone,
            email: email,
            addresses: address,
            id: id
        };
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/updatesupplier`, {
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

//:::::::::::::::::::::::: Add Purchase Order :::::::::::::::::::::::::::::::::::::::::::::::::

export const fn_add_purchase_order = (data) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
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


export const fn_show_purchase_order = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;

        const response = await fetch(`${host}/showpurchaseorder`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }
        })
        const json = await response.json();
        dispatch({ type: GETPURCHASEORDER, payload: json })
    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}


//::::::::::::::::::::::: Show Purchase Summary report :::::::::::::::::::::::::::::::::::::
export const fn_show_purchase_order_summary = (dateFrom, dateTo) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/showpurchaseorderreport`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }, body: JSON.stringify({ dateFrom: dateFrom, dateTo: dateTo})
        })
        const json = await response.json();
        return json;

    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}

//::::::::::::::::::::::: Show Purchase Detail report :::::::::::::::::::::::::::::::::::::
export const fn_show_purchase_order_detail = (documentId) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/showpurchaseorderdetailreport`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }, body: JSON.stringify({ documentId: documentId})
        })
        const json = await response.json();
        return json;

    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}


export const fn_show_purchase_item_detail = (documentId) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/showpurchaseitemdetails`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }, body: JSON.stringify({ documentId: documentId})
        })
        const json = await response.json();
        return json;

    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}


//:::::::::::::::::::::::: Add Sales Order :::::::::::::::::::::::::::::::::::::::::::::::::

export const fn_add_sales_order = (customerId, productId, quantity, unitPrice, batchName, inStock, lastPurPrice) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const data = {
            customerId: customerId,
            productId: productId,
            quantity: quantity,
            unitPrice: unitPrice,
            batchName: batchName,
            inStock: inStock,
            lastPurPrice: lastPurPrice
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


export const fn_show_sales_order = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;

        const response = await fetch(`${host}/showsalesorder`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }
        })
        const json = await response.json();
        dispatch({ type: GETSALESORDER, payload: json })
    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}


//::::::::::::::::::::::: Show Sales Summary report :::::::::::::::::::::::::::::::::::::
export const fn_show_sales_order_summary = (dateFrom, dateTo) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/showsalesorderreport`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }, body: JSON.stringify({ dateFrom: dateFrom, dateTo: dateTo})
        })
        const json = await response.json();
        return json;

    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}

//::::::::::::::::::::::: Show Sales Detail report :::::::::::::::::::::::::::::::::::::
export const fn_show_sales_order_detail = (documentId) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
        const response = await fetch(`${host}/showsalesorderdetailreport`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'authToken': token
            }, body: JSON.stringify({ documentId: documentId})
        })
        const json = await response.json();
        return json;

    } catch (error) {
        dispatch({ type: FETCHERRORS, payload: error.response.data })
    }
}

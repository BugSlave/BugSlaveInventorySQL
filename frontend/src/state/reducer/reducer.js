
import {
    GETCATEGORIES,
    GETCUSTOMERS,
    GETSUPPLIERS,
    GETPRODUCTS,
    GETPURCHASEORDER,
    GETSALESORDER,
    FETCHERRORS
} from '../action/actionTypes'

const initialState = {
    error: [],
    getcategories: [],
    getcustomers: [],
    getsuppliers: [],
    getproducts: [],
    getpurchaseorder:[],
    getsalesorder:[]
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCHERRORS:
            return {
                ...state,
                error: action.payload
            }

        case GETCATEGORIES:
            return {
                ...state,
                getcategories: action.payload
            }
        case GETCUSTOMERS:
            return {
                ...state,
                getcustomers: action.payload
            }
        case GETSUPPLIERS:
            return {
                ...state,
                getsuppliers: action.payload
            }

        case GETPRODUCTS:
            return {
                ...state,
                getproducts: action.payload
            }

        case GETPURCHASEORDER:
            return {
                ...state,
                getpurchaseorder: action.payload
            }

        case GETSALESORDER:
            return {
                ...state,
                getsalesorder: action.payload
            }

        default:
            return state
    }
}

export default reducer
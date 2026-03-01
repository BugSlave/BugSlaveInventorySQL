
import {
    GETCATEGORIES,
    GETCUSTOMERS,
    GETSUPPLIERS,
    GETPRODUCTS,
    FETCHERRORS
} from '../action/actionTypes'

const initialState = {
    error: [],
    getcategories: [],
    getcustomers: [],
    getsuppliers: [],
    getproducts: []
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

        default:
            return state
    }
}

export default reducer
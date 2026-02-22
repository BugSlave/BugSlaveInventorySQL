
import {
    GETCATEGORIES,
    FETCHERRORS
} from '../action/actionTypes'

const initialState = {
    error: [],
    getcategories: []
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
        default:
            return state
    }
}

export default reducer
import redux from 'redux';
import {createStore} from 'redux'
const USER_AUTH_SUCCESS = "USER_AUTH_SUCCESS";
const USER_LOGGED_OUT = "USER_LOGGED_OUT";

const intialUserState = {
    token: null,
    username: "",
    id: null
}
function loginUser(user) {
    return {
        type: USER_AUTH_SUCCESS,
        payload : user
    }
}
function logOutUser() {
    return {
        type: USER_LOGGED_OUT,
        payload: null
    }
}

const userReducer = (state = intialUserState, action)=>{
    switch (action.type) {
        case USER_AUTH_SUCCESS:
            return {
                ...state,
                user: {...action.payload}
            }
            break;
        case USER_LOGGED_OUT:
            return {
                ...state,
                user:null
            }
            break;
        default:
            return state
     }
}
const store = redux.createStore(intialUserState);
const unsubscripe = store.subscribe(() => {
    store.getState()
});
store.dispatch(loginUser({
    token: "kdjflkasdjfksdf",
    username: "menri",
    id:"idd"
    }
))
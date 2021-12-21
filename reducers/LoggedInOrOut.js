
const initialState = false;

export const isLoggedIn=(state=initialState,action)=>{
    switch(action.type){
        case "LOGIN": return true;
        case "LOGOUT" : return false;
        default: return state;
    }
}
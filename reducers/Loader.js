
const initialState = false;

export const Loader=(state=initialState,action)=>{
    switch(action.type){
        case "START_LOADER": return true;
        case "STOP_LOADER" : return false;
        default: return state;
    }
}
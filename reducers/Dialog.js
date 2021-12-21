
const initialState = false;

export const Dialog=(state=initialState,action)=>{
    switch(action.type){
        case "LOAD_DIALOG": return true;
        case "UNLOAD_DIALOG" : return false;
        default: return state;
    }
}
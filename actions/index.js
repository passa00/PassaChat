export const loadSpinner=()=>{
    return{
        type:"START_LOADER"
    }
};

export const unloadSpinner=()=>{
    return{
        type:"STOP_LOADER"
    }
};

export const loadDialog=()=>{
    return {
        type:"LOAD_DIALOG"
    }
};

export const unloadDialog=()=>{
    return {
        type:"UNLOAD_DIALOG"
    }
};

export const logout=()=>{
    return {
        type:"LOGOUT"
    }
};

export const login=()=>{
    return {
        type:"LOGIN"
    }
};




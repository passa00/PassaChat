import { combineReducers } from "redux";
import { Loader } from "./Loader";
import {Dialog} from './Dialog'
import { isLoggedIn } from "./LoggedInOrOut";

export const rootReducer = combineReducers({
  Loader,
  Dialog,
  isLoggedIn,
});

import { combineReducers } from "@reduxjs/toolkit";
import tournamentReducer from "./tournament";

const rootReducer = combineReducers({
  tournament: tournamentReducer,
});

export default rootReducer;

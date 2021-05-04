import React from "react";

export const StateContext = React.createContext();

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={React.useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => React.useContext(StateContext);

export const initialState = {
  user: null,
  token: null,
  roomName: null,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_TOKEN: "SET_TOKEN",
  SET_ROOMNAME: "SET_ROOMNAME",
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case actionTypes.SET_ROOMNAME:
      return {
        ...state,
        roomName: action.roomName,
      };

    default:
      return state;
  }
};

export default reducer;

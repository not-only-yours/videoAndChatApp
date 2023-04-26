export const initialState = {
  user: null,
  token: null,
  roomName: null,
  input: '',
};

export const actionTypes = {
  SET_USER: 'SET_USER',
  SET_TOKEN: 'SET_TOKEN',
  SET_ROOMNAME: 'SET_ROOMNAME',
  SET_INPUT: 'SET_INPUT',
};

const reducer = (state, action) => {
  //console.log(action);
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
    case actionTypes.SET_INPUT:
      return {
        ...state,
        input: action.input,
      };

    default:
      return state;
  }
};
export default reducer;

const INITAL_STATE = { token: null, error: false };

function rootReducer(state = INITAL_STATE, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, token: action.token };

    case "REGISTER":
      return { ...state, token: action.token };

    default:
      return state;
  }
}

export default rootReducer;

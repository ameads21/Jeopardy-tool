const INITAL_STATE = {
  numCol: 5,
  numQues: 5,
  edit: false,
  colEditName: "None",
};

function rootReducer(state = INITAL_STATE, action) {
  switch (action.type) {
    case "INCREMENTCOL":
      return { ...state, numCol: state.numCol + 1 };

    case "DECREMENTCOL":
      return { ...state, numCol: state.numCol - 1 };

    case "INCREMENTQUES":
      return { ...state, numQues: state.numQues + 1 };

    case "DECREMENTQUES":
      return { ...state, numQues: state.numQues - 1 };

    case "EDITACCESS":
      return { ...state, edit: true };

    case "CURRENTEDIT":
      return { ...state, colEditName: action.key };

    default:
      return state;
  }
}

export default rootReducer;
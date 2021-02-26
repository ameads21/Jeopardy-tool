const INITAL_STATE = {
  numCol: 5,
  numQues: 5,
  edit: false,
  colEditName: "category-0",
};

function rootReducer(state = INITAL_STATE, action) {
  switch (action.type) {
    case "EDITACCESS":
      return { ...state, edit: !state.edit };

    case "CURRENTEDIT":
      return { ...state, colEditName: action.key };

    default:
      return state;
  }
}

export default rootReducer;

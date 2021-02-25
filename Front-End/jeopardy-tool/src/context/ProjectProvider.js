import Api from "../Api";
import { useContext, useState } from "react";
import UserInfoContext from "./UserInfoContext";
import ProjectContext from "./ProjectContext";
import { useDispatch, useSelector } from "react-redux";

const ProjectProvider = ({ children }) => {
  const { colEditName } = useSelector((state) => state.columnAndQuestion);
  const BTN_INITAL_STATE = {
    BTNtext_color: "",
    BTNbackground_color: "",
    BTNpadding: "",
  };
  const TEXT_INITAL_STATE = {
    TEXTtext_color: "",
    TEXTbackground_color: "",
    TEXTinnerText: "",
  };

  const { currentUser } = useContext(UserInfoContext);
  const [columnCount, setColumnCount] = useState(5);
  const [questionCount, setQuestionCount] = useState(5);
  const [isLoaded, setIsLoaded] = useState(false);
  const [columnNames, setColumnNames] = useState([]);
  const [styleData, setStyleData] = useState({});
  const [btnData, setBtnData] = useState(BTN_INITAL_STATE);
  const [textData, setTextData] = useState(TEXT_INITAL_STATE);
  const dispatch = useDispatch();

  async function sendProjectDetails(projectDetails) {
    try {
      await Api.sendProjectDetails(projectDetails, currentUser);
      setIsLoaded(true);
      return { success: true };
    } catch (errors) {
      console.error("Failed saving project", errors);
      return { success: false, errors };
    }
  }

  function updateColumnCount(num) {
    setColumnCount(num);
  }

  function updateQuestionCount(num) {
    setQuestionCount(num);
  }

  function exitProject() {
    setStyleData({});
    setIsLoaded(false);
    dispatch({ type: "CURRENTEDIT", key: "category-0" });
  }

  async function updateColumnNames({ proj_id }) {
    let { results } = await Api.getColumns({ proj_id, currentUser });
    setColumnNames(results.columnName);
  }

  async function getColumnData({ proj_id }) {
    try {
      let { results } = await Api.getColumns({ proj_id, currentUser });
      let { columnLength, questionLength, columnName, columnStyles } = results;
      if (results) {
        setColumnCount(columnLength);
        setQuestionCount(questionLength);
        setColumnNames(columnName);
        setStyleData(columnStyles);
        setIsLoaded(true);
      } else {
        setStyleData({});
        setColumnCount(5);
        setQuestionCount(5);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoaded(true);
  }

  function handleChangeBtn(evt) {
    const { name, value } = evt.target;
    //Getting the first part of value
    const valueCheck = `${value.split("-")[0]}-`;
    let categoryButtons = document.querySelectorAll(`button.${colEditName}`);
    for (let c of categoryButtons) {
      let classes = c.className.split(" ").filter(function (v) {
        return v.lastIndexOf(valueCheck, 0) !== 0;
      });
      c.className = classes.join(" ").trim();
      c.classList.add(value);
    }

    setBtnData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleChangeText(evt) {
    const { name, value } = evt.target;
    let category = document.querySelectorAll(`th.${colEditName}`);
    const valueCheck = `${value.split("-")[0]}-`;
    for (let c of category) {
      if (name === "TEXTinnerText") {
        c.innerText = value;
      } else {
        let classes = c.className.split(" ").filter(function (v) {
          return v.lastIndexOf(valueCheck, 0) !== 0;
        });
        c.className = classes.join(" ").trim();
        c.classList.add(value);
      }
    }

    setTextData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  async function exitEdit() {
    dispatch({ type: "CURRENTEDIT", key: "category-0" });
    setBtnData(BTN_INITAL_STATE);
    setTextData(TEXT_INITAL_STATE);
  }

  return (
    <ProjectContext.Provider
      value={{
        sendProjectDetails,
        columnCount,
        questionCount,
        updateColumnCount,
        updateQuestionCount,
        getColumnData,
        updateColumnNames,
        exitProject,
        handleChangeBtn,
        handleChangeText,
        exitEdit,
        isLoaded,
        columnNames,
        styleData,
        btnData,
        textData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;

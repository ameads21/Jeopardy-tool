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
  const [allQuesData, setAllQuesData] = useState([]);
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
    setColumnNames([]);
    dispatch({ type: "CURRENTEDIT", key: "category-0" });
    dispatch({ type: "EXITPROJECT" });
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

  async function exitEdit({ proj_id }) {
    const data = {
      title: textData.TEXTinnerText,
      id: colEditName.split("-")[1],
    };
    const styleData = {
      btnData,
      textData,
      id: colEditName.split("-")[1],
    };
    await Api.saveCategoryName({ proj_id, currentUser, data });
    await Api.saveStyleButtons({
      proj_id,
      currentUser,
      styleData,
    });
    dispatch({ type: "CURRENTEDIT", key: "category-0" });
    setBtnData(BTN_INITAL_STATE);
    setTextData(TEXT_INITAL_STATE);
  }

  async function updateEdit({ key, proj_id }) {
    const data = {
      title: textData.TEXTinnerText,
      id: colEditName.split("-")[1],
    };
    const styleData = {
      btnData,
      textData,
      id: colEditName.split("-")[1],
    };
    await Api.saveCategoryName({ proj_id, currentUser, data });
    await Api.saveStyleButtons({
      proj_id,
      currentUser,
      styleData,
    });
    dispatch({ type: "CURRENTEDIT", key });
    setBtnData(BTN_INITAL_STATE);
    setTextData(TEXT_INITAL_STATE);
  }

  function startGame(data) {
    setAllQuesData(data);
  }

  function pickQuestion(
    column_id,
    value,
    questionData = JSON.parse(
      JSON.stringify(
        allQuesData[column_id.replace("category-", "column")] || []
      )
    )
  ) {
    if (questionData.length === 0) {
      return { question: "No Question Found", answer: "No Answer Found" };
    }
    let randomizer = Math.floor(Math.random() * questionData.length);

    questionData[randomizer].filters = JSON.parse(
      questionData[randomizer].filters
    );
    if (!questionData[randomizer].filters.includes(Number(value))) {
      questionData.splice(randomizer, 1);
      return pickQuestion(column_id, value, questionData);
    } else {
      let temp_array = JSON.parse(JSON.stringify(allQuesData));
      let filtered_array = temp_array[
        column_id.replace("category-", "column")
      ].filter((i) => {
        if (typeof questionData[randomizer].filters !== "string") {
          questionData[randomizer].filters = JSON.stringify(
            questionData[randomizer].filters
          );
        }
        return JSON.stringify(questionData[randomizer]) !== JSON.stringify(i);
      });

      temp_array[column_id.replace("category-", "column")] = filtered_array;
      setAllQuesData(temp_array);
      return questionData[randomizer];
    }
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
        updateEdit,
        startGame,
        pickQuestion,
        allQuesData,
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

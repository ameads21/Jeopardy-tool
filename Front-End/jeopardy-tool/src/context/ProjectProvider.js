import Api from "../Api";
import { useContext, useState } from "react";
import UserInfoContext from "./UserInfoContext";
import ProjectContext from "./ProjectContext";

const ProjectProvider = ({ children }) => {
  const { currentUser } = useContext(UserInfoContext);
  const [columnCount, setColumnCount] = useState(5);
  const [questionCount, setQuestionCount] = useState(5);
  const [isLoaded, setIsLoaded] = useState(false);
  const [columnNames, setColumnNames] = useState([]);
  const [styleData, setStyleData] = useState({});
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
        isLoaded,
        columnNames,
        styleData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;

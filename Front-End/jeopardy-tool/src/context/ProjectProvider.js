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

  async function getColumnData({ proj_id }) {
    try {
      let { results } = await Api.getColumns({ proj_id, currentUser });
      let { columnLength, questionLength, columnName } = results;
      if (results) {
        setColumnCount(columnLength);
        setQuestionCount(questionLength);
        setColumnNames(columnName);
        setIsLoaded(true);
      } else {
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
        isLoaded,
        columnNames,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;

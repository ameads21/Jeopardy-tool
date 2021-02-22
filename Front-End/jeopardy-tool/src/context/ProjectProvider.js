import Api from "../Api";
import { useContext, useState } from "react";
import UserInfoContext from "./UserInfoContext";
import ProjectContext from "./ProjectContext";

const ProjectProvider = ({ children }) => {
  const { currentUser } = useContext(UserInfoContext);
  const [columnCount, setColumnCount] = useState(5);
  const [questionCount, setQuestionCount] = useState(5);
  async function sendProjectDetails(projectDetails) {
    try {
      await Api.sendProjectDetails(projectDetails, currentUser);
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

  return (
    <ProjectContext.Provider
      value={{
        sendProjectDetails,
        columnCount,
        questionCount,
        updateColumnCount,
        updateQuestionCount,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;

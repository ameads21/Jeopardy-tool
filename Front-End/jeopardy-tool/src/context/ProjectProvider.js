import Api from "../Api";
import { useContext } from "react";
import UserInfoContext from "./UserInfoContext";
import ProjectContext from "./ProjectContext";

const ProjectProvider = ({ children }) => {
  const { currentUser } = useContext(UserInfoContext);
  async function sendProjectDetails(projectDetails) {
    try {
      await Api.sendProjectDetails(projectDetails, currentUser);
      return { success: true };
    } catch (errors) {
      console.error("Failed saving project", errors);
      return { success: false, errors };
    }
  }

  return (
    <ProjectContext.Provider value={{ sendProjectDetails }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;

import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import UserInfoContext from "../../context/UserInfoContext";
import LoadingSpinner from "../../helpers/LoadingSpinner";
import Api from "../../Api";
import ProjectCard from "./ProjectCard";

function UserProjects() {
  const { username } = useParams();
  const { currentUser } = useContext(UserInfoContext);
  const history = useHistory();
  const [totalProjects, setTotalProjects] = useState([]);
  const [loadedData, setLoadedData] = useState(false);
  if (username !== currentUser.username) {
    history.push("/");
  }
  useEffect(() => {
    async function getProjects() {
      try {
        let { projects } = await Api.getProjects(currentUser);
        setTotalProjects(projects);
        setLoadedData(true);
      } catch (err) {
        console.error(err);
      }
    }
    getProjects();
  }, [currentUser]);

  function deleteProject(id) {
    try {
      Api.deleteProject({ currentUser, id });
      const newProjects = totalProjects.filter((p) => p.id !== id);
      setTotalProjects(newProjects);
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  return (
    <div className="container-fluid">
      <h1>My Projects</h1>
      <div className="row">
        <ProjectCard
          key={0}
          name="New Project"
          description="Creation for a new project"
          btnText="Create"
          id="0"
        />
        {!loadedData ? (
          <LoadingSpinner />
        ) : (
          totalProjects.map((p) => (
            <ProjectCard
              key={p.id}
              name={p.proj_name}
              description={p.proj_description}
              id={p.id}
              deleteProject={deleteProject}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default UserProjects;

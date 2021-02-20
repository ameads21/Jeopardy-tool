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
      let { projects } = await Api.getProjects(currentUser);
      setTotalProjects(projects);
      setLoadedData(true);
    }
    getProjects();
  }, [currentUser]);

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
            />
          ))
        )}
      </div>
    </div>
  );
}

export default UserProjects;

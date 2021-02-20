import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserInfoContext from "../../context/UserInfoContext";

function ProjectCard({
  id,
  name,
  description,
  btnText = "Play/Edit",
  deleteProject,
}) {
  const { currentUser } = useContext(UserInfoContext);

  return (
    <div className="col-md-4 col-lg-3 mb-3" id={id}>
      <div className="card">
        {btnText === "Play/Edit" && (
          <div className="card-header">
            <button
              className="btn btn-danger float-right"
              onClick={() => deleteProject(id)}
            >
              Delete
            </button>
          </div>
        )}
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{description}</p>
          <Link
            to={`/${currentUser.username}/project/${id}`}
            className="btn btn-info"
          >
            {btnText}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;

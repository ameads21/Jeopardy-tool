import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserInfoContext from "../../context/UserInfoContext";

function ProjectCard({ id, name, description, btnText = "Play/Edit" }) {
  const { currentUser } = useContext(UserInfoContext);
  return (
    <div className="col-md-4 col-lg-3 ">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{description}</p>
          <Link to={`/projects/${currentUser}/${id}`} className="btn btn-info">
            {btnText}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;

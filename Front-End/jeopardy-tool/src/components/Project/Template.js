import React, { useContext, useEffect, useState } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import Api from "../../Api";
import ProjectContext from "../../context/ProjectContext";
import UserInfoContext from "../../context/UserInfoContext";
import LoadingSpinner from "../../helpers/LoadingSpinner";

function Template() {
  const { currentUser } = useContext(UserInfoContext);
  const { updateColumnCount } = useContext(ProjectContext);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [columnData, setColumnData] = useState({});
  const { proj_id } = useParams();

  useEffect(
    function loadColumnData() {
      async function getColumnData() {
        try {
          let { data } = await Api.getColumns({ proj_id, currentUser });
          setColumnData(data);
          setInfoLoaded(true);
          data.results ? updateColumnCount(data.results) : updateColumnCount(5);
        } catch (err) {
          console.error(
            "Problem Loading Columns. Please Try Again Later.",
            err
          );
        }
      }
      getColumnData();
    },
    [proj_id, currentUser, updateColumnCount]
  );
  if (!infoLoaded) {
    return <LoadingSpinner />;
  } else {
    if (columnData.results > 0) {
      return (
        <Redirect to={`/${currentUser.username}/project/${proj_id}/project`} />
      );
    }
  }
  return (
    <div>
      <h1>Select A Template</h1>
      <Link
        to={`/${currentUser.username}/project/${proj_id}/col-display`}
        className="btn btn-info"
      >
        Create Your Own
      </Link>
    </div>
  );
}

export default Template;

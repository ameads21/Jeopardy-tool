import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Redirect, useParams } from "react-router-dom";
import Api from "../../Api";
import ProjectContext from "../../context/ProjectContext";
import UserInfoContext from "../../context/UserInfoContext";
import LoadingSpinner from "../../helpers/LoadingSpinner";

function Template() {
  const { currentUser } = useContext(UserInfoContext);
  const { updateColumnCount, updateQuestionCount } = useContext(ProjectContext);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [columnData, setColumnData] = useState({});
  const { proj_id } = useParams();
  const dispatch = useDispatch();

  useEffect(
    function loadColumnData() {
      async function getColumnData() {
        try {
          let { results } = await Api.getColumns({ proj_id, currentUser });
          let { columnLength, questionLength } = results;
          setColumnData(results);
          setInfoLoaded(true);
          if (results) {
            dispatch({ type: "EDITACCESS" });
            updateColumnCount(columnLength);
            updateQuestionCount(questionLength);
          } else {
            updateColumnCount(5);
            updateQuestionCount(5);
          }
        } catch (err) {
          console.error(
            "Problem Loading Columns. Please Try Again Later.",
            err
          );
        }
      }
      getColumnData();
    },
    [proj_id, currentUser, updateColumnCount, updateQuestionCount, dispatch]
  );
  if (!infoLoaded) {
    return <LoadingSpinner />;
  }
  if (columnData.columnLength > 0) {
    return (
      <Redirect to={`/${currentUser.username}/project/${proj_id}/project`} />
    );
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

import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProjectContext from "../../context/ProjectContext";
import LoadingSpinner from "../../helpers/LoadingSpinner";

function Board() {
  const dispatch = useDispatch();

  let { edit } = useSelector((state) => state.columnAndQuestion);
  const { columnCount, questionCount, isLoaded, getColumnData } = useContext(
    ProjectContext
  );
  let { proj_id } = useParams();

  useEffect(
    function gettingData() {
      async function loadColumnData() {
        if (!isLoaded) {
          await getColumnData({ proj_id });
        }
      }
      loadColumnData();
    },
    [getColumnData, proj_id, isLoaded]
  );

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  let editColumn = (key) => {
    if (edit) {
      dispatch({ type: "CURRENTEDIT", key });
    }
  };

  let renderCol = () => {
    let results = [];
    let tempCol = columnCount;
    while (tempCol > 0) {
      tempCol -= 1;
      results.unshift(
        <th
          key={`category-${tempCol}`}
          scope="col"
          className={`category-${tempCol + 1}`}
          onClick={(val) => editColumn(val.target.className.split(" ")[0])}
        >
          Category {tempCol + 1}
        </th>
      );
    }
    return results.map((category) => category);
  };

  let renderQuesRows = () => {
    let rows = [];
    let tempQues = questionCount;
    let values = 100;
    let rowNum = 1;
    while (tempQues > 0) {
      rows.push(<tr key={`Row ${rowNum}`}>{renderQues(values)}</tr>);
      values += 100;
      tempQues -= 1;
      rowNum += 1;
    }
    return rows;
  };

  let renderQues = (val) => {
    let questions = [];
    let tempCol = columnCount;
    while (tempCol > 0) {
      questions.unshift(
        <td key={`Category ${tempCol}`}>
          <button
            className={`category-${tempCol} btn btn-secondary p-3`}
            onClick={(val) => editColumn(val.target.className.split(" ")[0])}
          >
            {val}
          </button>
        </td>
      );
      tempCol -= 1;
    }
    return questions;
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>{renderCol()}</tr>
        </thead>
        <tbody>{renderQuesRows()}</tbody>
      </table>
    </div>
  );
}

export default Board;

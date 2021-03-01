import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ModalContext from "../../context/ModalContext";
import ProjectContext from "../../context/ProjectContext";
import LoadingSpinner from "../../helpers/LoadingSpinner";

function Board() {
  const dispatch = useDispatch();

  let { edit } = useSelector((state) => state.columnAndQuestion);
  const { handleShow } = useContext(ModalContext);
  const {
    columnCount,
    questionCount,
    columnNames,
    isLoaded,
    getColumnData,
    styleData,
    updateEdit,
  } = useContext(ProjectContext);
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
    [getColumnData, proj_id, isLoaded, dispatch]
  );

  function editColumn(btn) {
    const key = btn.target.className.split(" ")[0];
    const value = btn.target.innerText;
    if (edit) {
      updateEdit({ key, proj_id });
    } else {
      if (btn.target.localName !== "th") {
        handleShow({ key, value });
        btn.target.disabled = true;
      }
    }
  }
  let renderCol = () => {
    let results = [];
    let tempCol = columnCount;

    while (tempCol > 0) {
      tempCol -= 1;
      results.unshift(
        <th
          key={`category-${tempCol}`}
          scope="col"
          className={
            Object.entries(styleData).length === 0
              ? `category-${tempCol + 1}`
              : `category-${tempCol + 1} ${styleData[tempCol].text
                  .toString()
                  .replace(/,/g, " ")}`
          }
          onClick={editColumn}
        >
          {!columnNames || !columnNames[tempCol]
            ? `Category ${tempCol + 1}`
            : columnNames[tempCol]}
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
            className={
              Object.entries(styleData).length === 0
                ? `category-${tempCol} btn btn-primary p-3`
                : `category-${tempCol} btn ${styleData[tempCol - 1].buttons
                    .toString()
                    .replace(/,/g, " ")}`
            }
            onClick={editColumn}
          >
            {val}
          </button>
        </td>
      );
      tempCol -= 1;
    }
    return questions;
  };

  if (!isLoaded) {
    return <LoadingSpinner />;
  }
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

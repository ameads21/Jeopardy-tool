import React from "react";
import { useSelector } from "react-redux";

function Board() {
  let { numCol, numQues, edit } = useSelector(
    (state) => state.columnAndQuestion
  );

  let renderCol = () => {
    let results = [];
    let tempCol = numCol;
    while (tempCol > 0) {
      tempCol -= 1;
      results.unshift(
        <th key={`Category ${tempCol}`} onClick={testing}>
          Category {tempCol + 1}
        </th>
      );
    }
    return results.map((category) => category);
  };

  let renderQuesRows = () => {
    let rows = [];
    let tempQues = numQues;
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

  let testing = () => {
    if (edit) {
      console.log("testing");
    }
  };

  let renderQues = (val) => {
    let questions = [];
    let tempCol = numCol;
    let categoryNum = 1;
    while (tempCol > 0) {
      questions.unshift(
        <td key={`Category ${categoryNum}`}>
          <button>{val}</button>
        </td>
      );
      categoryNum += 1;
      tempCol -= 1;
    }
    return questions;
  };

  return (
    <div>
      <table>
        <thead>
          <tr>{renderCol()}</tr>
        </thead>
        <tbody>{renderQuesRows()}</tbody>
      </table>
    </div>
  );
}

export default Board;

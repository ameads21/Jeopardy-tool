import React, { useState } from "react";
import PlayerScore from "./PlayerScore";

function PlayerBoard() {
  const [users, setUsers] = useState([]);

  function removeuser(user) {
    const temp_users = [...users];
    temp_users.splice(temp_users.indexOf(user), 1);
    setUsers(temp_users);
  }

  function addUser() {
    let user = prompt("Please Enter Name");
    console.log(users.includes(user));
    while (users.includes(user)) {
      user = prompt("Please Pick A Different Name");
    }
    const temp_users = [...users];
    temp_users.push(user);
    setUsers(temp_users);
  }

  return (
    <div>
      <div className="row">
        {users.map((u) => (
          <PlayerScore username={u} removeUser={removeuser} />
        ))}
      </div>
      <button className="btn btn-success mt-5" onClick={addUser}>
        Add User
      </button>
    </div>
  );
}

export default PlayerBoard;

import React from "react";
import { getUserRoles } from "./LeftChats";
import { actionTypes } from "./reducer";
import { createRoom } from "./service";
function CreateChat() {
  const sp = require("./StateProvider");
  const [input, setInput] = React.useState("");
  const [{ user }, dispatch] = sp.useStateValue();

  const createRequest = (e) => {
    e.preventDefault();
    //console.log(roomId, input, user);

    console.log(getCheckedRoles());
    console.log(input);
    sendRequest(input);
  };

  const sendRequest = (input) => {
    let roles = getCheckedRoles();
    if (roles.length === 0) {
      alert("Please, select role");
    } else if (input === "") {
      alert("Please, write name of group");
    } else {
      createRoom(input, roles);
    }
  };

  const getCheckedRoles = () => {
    let checkedRoles = [];
    let checkboxes = document.querySelectorAll("input[type=checkbox]:checked");

    for (let i = 0; i < checkboxes.length; i++) {
      checkedRoles.push(checkboxes[i].id);
    }
    //console.log(checkedRoles);
    return checkedRoles;
  };

  React.useEffect(async () => {
    //console.log(user.id);
    let userRole = await getUserRoles(user.id);
    userRole.push({
      id: "GoogleLog",
      role: "main role",
    });
    let buffUser = user;
    buffUser.roles = userRole;
    dispatch({
      type: actionTypes.SET_USER,
      user: buffUser,
    });
    console.log(user.roles);
  }, [user]);
  //console.log("I`m in CreateChat");
  return (
    <div className="chat">
      <h3>Write RoomName</h3>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        placeholder="Type a roomname..."
      />
      <p>Choose roles:</p>
      {user.roles.map((role) => (
        <div>
          <input type="checkbox" id={role.role} name="role" />
          <label htmlFor="scales">{role.role}</label>
        </div>
      ))}
      <button type="submit" onClick={createRequest}>
        Create room
      </button>
    </div>
  );
}

export default CreateChat;

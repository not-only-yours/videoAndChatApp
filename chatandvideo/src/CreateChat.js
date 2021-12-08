import React from "react";
import { getCheckedRoles, getUserRoles, sendRequest } from "./service";
import { actionTypes } from "./reducer";

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
      {user.roles ? (
        user.roles.map((role) => (
          <div>
            <input type="checkbox" id={role.role} name="role" />
            <label htmlFor="scales">{role.role}</label>
          </div>
        ))
      ) : (
        <div>
          <h1>No roles</h1>
        </div>
      )}
      <button type="submit" onClick={createRequest}>
        Create room
      </button>
    </div>
  );
}

export default CreateChat;

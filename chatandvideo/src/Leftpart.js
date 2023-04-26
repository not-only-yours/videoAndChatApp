import React from 'react';
import './Leftpart.css';
import { IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import LeftChats from './LeftChats';
import { Link } from 'react-router-dom';
import { ExitToAppRounded } from '@material-ui/icons';
import { actionTypes } from './reducer';

function Leftpart() {
  const serv = require('./service');
  const sp = require('./StateProvider');
  const [rooms, setRooms] = React.useState([]);
  const [{ user }, dispatch] = sp.useStateValue();
  const [input, setInput] = sp.useStateValue();

  const exitToLogin = () => {
    dispatch({
      type: actionTypes.SET_USER,
      user: false,
    });
  };

  const onChangeHandler = (e) => {
    setInput({
      type: actionTypes.SET_INPUT,
      input: e.target.value,
    });
  };

  React.useEffect(() => {
    return serv.refreshDB(setRooms);
  }, [serv]);
  return (
    <div className="leftpart">
      <div className="leftpart_header">
        <div className="leftpart_headerRight">
          <IconButton>
            <ExitToAppRounded onClick={exitToLogin} />
          </IconButton>
        </div>
      </div>
      <div className="leftpart_search">
        <div className="leftpart_searchContainer">
          <SearchIcon />
          <input
            type="text"
            placeholder="Start print chat name"
            onChange={onChangeHandler}
            value={input.input}
          />
        </div>
      </div>
      <div className="leftpart_chats">
        <Link to={'/newRoom'}>
          <div className="leftpart_chat">
            <h2>Tap here to add new chat</h2>
          </div>
        </Link>
        {rooms.map((room) => (
          <LeftChats
            key={room.id}
            id={room.id}
            name={room.data.name}
            userId={user.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Leftpart;

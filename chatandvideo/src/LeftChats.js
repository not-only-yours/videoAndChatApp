import React from 'react';
import './LeftChats.css';
import { Link } from 'react-router-dom';
import { findPart, getRoomRoles, getUserRoles, isProperties } from './service';

function LeftChats({ id, name, userId }) {
  const sp = require('./StateProvider');
  const [input] = sp.useStateValue();
  const [messages] = React.useState('');
  const [userRoles, setRoles] = React.useState([]);
  const [roomRoles, setRolesR] = React.useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(async () => {
    //console.log(userId);
    const roomRole = await getRoomRoles(id);
    setRolesR(roomRole);
    const userRole = await getUserRoles(userId);
    if (userRole.length === 0) {
      userRole.push({
        id: 'GoogleLog',
        role: 'main role',
      });
    }
    setRoles(userRole);
  }, [id, userId]);
  return (
    <div>
      {isProperties(userRoles, roomRoles) && findPart(input, name) && (
        <Link to={`/rooms/${id}`}>
          <div className="leftpart_chat">
            <div className="leftpartChat_info">
              <h2>{name}</h2>
              <p>{messages[0]?.message}</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

export default LeftChats;

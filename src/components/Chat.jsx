import React from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import videoCall from '../assets/images/video.png';
import addUser from '../assets/images/add-user.png';
import menu from '../assets/images/menu-icon.png';
import { Messages, WriteMessage } from './index';
import { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

const Chat = () => {
  const [users, setUsers] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const user1 = currentUser.uid;

  const { data } = useContext(ChatContext);

  useEffect(() => {
    const usersRef = collection(db, 'users');
    // create query object
    const q = query(usersRef, where('uid', 'not-in', [user1]));
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  }, []);

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="chat-user">
          {data.user?.photoURL && (
            <img
              src={data.user?.photoURL}
              alt="person"
              className="chat-person"
            />
          )}
          <div className="chat-user-info">
            <span className="user-displayName">{data.user?.displayName}</span>
            {data.user?.displayName &&
              users.map(
                (user) =>
                  data.user.uid === user.uid && (
                    <span className="user-status" key={user.uid}>
                      {user.isOnline ? 'Online' : 'Offline'}
                    </span>
                  )
              )}
          </div>
        </div>
        <div className="chatIcons">
          <img src={videoCall} alt="video" />
          <img src={addUser} alt="user" />
          <img src={menu} alt="menu" />
        </div>
      </div>
      <Messages />
      <WriteMessage />
    </div>
  );
};

export default Chat;

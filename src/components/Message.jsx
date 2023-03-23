import React, { useEffect, useRef } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({ messages }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const timestamp = messages.date.seconds; // example timestamp value
  const date = new Date(timestamp * 1000); // convert to Date object
  const dateOptions = { month: 'long', day: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const dateString =
    date.toLocaleDateString('tr-TR', dateOptions) +
    ' ' +
    date.toLocaleTimeString('tr-TR', timeOptions);

  return (
    <div
      ref={ref}
      className={`message-container ${
        messages.senderId === currentUser.uid && 'owner'
      }`}
    >
      <div className="messageInfo">
        <img
          src={
            messages.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt="person"
        />
      </div>
      <div className="messageContent">
        <p>{messages.text}</p>
        {messages.img && <img src={messages.img} alt="person" />}
        <span>{dateString}</span>
      </div>
    </div>
  );
};

export default Message;

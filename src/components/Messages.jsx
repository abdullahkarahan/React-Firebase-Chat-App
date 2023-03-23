import React, { useState, useContext, useEffect } from 'react';
import { Message } from './index';
import { ChatContext } from '../context/ChatContext';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';

const Messages = () => {
  const { data } = useContext(ChatContext);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages-container">
      {messages.map((msg) => (
        <Message messages={msg} key={msg.id} />
      ))}
    </div>
  );
};

export default Messages;

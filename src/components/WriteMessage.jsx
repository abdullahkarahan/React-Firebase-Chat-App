import React from 'react';
import emoji from '../assets/images/smile1.png';
import Send from '../assets/images/send1.png';
import Img from '../assets/images/image2.png';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { useState, useEffect } from 'react';
import {
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Data } from 'emoji-mart';
import Picker from '@emoji-mart/react';
const WriteMessage = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      await uploadBytesResumable(storageRef, img).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          await updateDoc(doc(db, 'chats', data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
        });
      });
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    setText('');
    setImg(null);
  };

  useEffect(() => {
    if (currentEmoji) {
      setText((prevValue) => prevValue + currentEmoji);
      setCurrentEmoji(null);
    }
  }, [currentEmoji]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Call function to send message to server
      handleSend(text);
      // Clear input field
      setText('');
    }
  };

  return (
    <div className="message-input">
      <div className="input-container">
        <input
          type="text"
          placeholder="Message..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          value={text}
        />
        <div className="send-file">
          <img
            src={emoji}
            alt=""
            className="emoji"
            onClick={() => setIsPickerVisible(!isPickerVisible)}
          />
          <div className={isPickerVisible ? 'show-emoji' : 'hide-emoji'}>
            <Picker
              previewPosition="bottom"
              data={Data}
              onEmojiSelect={(e) => {
                setCurrentEmoji(e.native);
                setIsPickerVisible(!isPickerVisible);
              }}
            />
          </div>
          <input
            type="file"
            style={{ display: 'none' }}
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <label htmlFor="file">
            <img src={Img} alt="search" className="icon" />
          </label>
        </div>
      </div>

      <button onClick={handleSend}>
        <img src={Send} alt="search" className="send-icon" />
      </button>
    </div>
  );
};

export default WriteMessage;

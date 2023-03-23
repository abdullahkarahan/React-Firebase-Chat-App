import React, { useContext, useState } from 'react';
import search from '../assets/images/search.png';
import person from '../assets/images/person.jpg';
import online from '../assets/images/online-icon.png';
import offline from '../assets/images/offline-icon.png';
import {
  collection,
  query,
  where,
  getDoc,
  updateDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { AuthContext } from '../context/AuthContext';

const Search = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch();
  };

  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });

        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }
    setUser(null);
    setUsername('');
  };

  return (
    <div className="search">
      <div className="search-form">
        <img src={search} alt="search" className="search-icon" />
        <input
          type="text"
          placeholder="Search user..."
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && <div className="border" />}
      {user && (
        <div className="searched-person" onClick={handleSelect}>
          <img src={user.photoURL} alt="person" />
          <span>{user.displayName}</span>
          <img
            src={user.status === 'online' ? online : offline}
            alt="online"
            className="status"
          />
        </div>
      )}
    </div>
  );
};

export default Search;

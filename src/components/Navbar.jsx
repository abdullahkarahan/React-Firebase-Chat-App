import { signOut } from 'firebase/auth';
import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

import { doc, updateDoc } from 'firebase/firestore';
const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logOut = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth).then(() => {
        updateDoc(doc(db, 'users', currentUser.uid), {
          isOnline: false,
        });
      });

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  // Sign-out successful.

  return (
    <div className="navbar">
      <div className="user">
        <img src={currentUser.photoURL} alt="" />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="-2 0 28 28"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
          onClick={logOut}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      </div>
    </div>
  );
};

export default Navbar;

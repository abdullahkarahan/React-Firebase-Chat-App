import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, storage, db } from '../../firebase';
import './Register.scss';
import Add from '../../assets/images/add-image.png';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../../constants/Loader';
import logo from '../../assets/images/logo-no-background.png';
import { useAlert } from 'react-alert';

const Register = () => {
  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
              isOnline: true,
            });
            await setDoc(doc(db, 'userChats', res.user.uid), {});
            navigate('home');
          } catch (error) {
            setError(true);
            alert.error(
              'Sorry, something went wrong please check your information.'
            );
            setLoading(false);
          }
        });
      });
    } catch (error) {
      console.log(error);
      setError(true);
      alert.error('Sorry, something went wrong please check your information.');
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit} className="register">
            <img className="register-logo" src={logo} alt="logo" />
            <input type="text" placeholder="display name" />
            <input type="email" placeholder="email" />
            <input type="password" placeholder="password" />
            <input
              style={{ display: 'none' }}
              type="file"
              className="file"
              id="file"
            />
            <label htmlFor="file">
              <img src={Add} alt="add" />
              <span>Add an avatar</span>
            </label>
            <button className="register-btn">Sign Up</button>
            <p className="question">Do you have an account?</p>
            <h4>
              <Link to="/" className="login-link">
                Login
              </Link>
            </h4>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;

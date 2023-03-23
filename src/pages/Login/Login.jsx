import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.scss';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Loader from '../../constants/Loader';
import logo from '../../assets/images/logo-no-background.png';
import { useAlert } from 'react-alert';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const alert = useAlert();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await updateDoc(doc(db, 'users', res.user.uid), {
        isOnline: true,
      });
      navigate('home');
    } catch (err) {
      setErr(true);
      alert.error('Sorry, something went wrong please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit}>
            <img className="logo" src={logo} alt="logo" />
            <span className="title">Login</span>
            <input type="email" placeholder="email" />
            <input type="password" placeholder="password" />
            <button className="login-btn">Sign in</button>
            <p>You don't have an account?</p>
            <h4>
              <Link to="/register" className="register-link">
                Register
              </Link>
            </h4>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;

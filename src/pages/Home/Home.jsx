import React from 'react';
import { Sidebar, Chat } from '../../components/index';
import '../../style.scss';

const Home = () => {
  return (
    <div className="home">
      <div className="container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Home;

import React from 'react';
import Navbar from './Navbar';
import Search from './Search';
import ChatList from './ChatList';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <Navbar />
        <div className="person-container">
          <Search />
          <ChatList />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

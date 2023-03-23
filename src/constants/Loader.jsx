import React from 'react';
import './Loader.scss';

const Loader = () => {
  return (
    <section>
      <div className="spinner-square">
        <div className="square-1 square"></div>
        <div className="square-2 square"></div>
        <div className="square-3 square"></div>
      </div>
    </section>
  );
};

export default Loader;

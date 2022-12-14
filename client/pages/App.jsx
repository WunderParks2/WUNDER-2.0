import axios from 'axios';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import SidebarContainer from '../containers/SidebarContainer.jsx';
import MainContainer from '../containers/MainContainer.jsx';

const App = () => {
  // let codes = [];
  const [codes, setCodes] = useState([]);

  // const handleUpdate = (newData) => {
  //   setData([newData, ...data]);
  // };

  useEffect(() => {
    // withCredentials require cookies to be passed in to headers
    axios.get('http://localhost:3000/home/user', { withCredentials: true })
      .then((res) => {
        setCodes(res.data);
      })
      .catch((err) => console.log('Initial fetch GET request to DB: ERROR: ', err));
  }, []);


  return (
    <div className="app">
      <SidebarContainer codes={codes} />
      <div className="right">
        <div className="float">
          <h1> WÜNDER PARKS</h1>
        </div>
        <MainContainer codes={codes} />
      </div>
    </div>
  );
};

export default App;

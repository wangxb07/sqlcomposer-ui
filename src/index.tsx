import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import App from './App';

ReactDOM.render(
  <Router>
    <div className="App">
      <App/>
    </div>
  </Router>,
  document.getElementById('root')
);

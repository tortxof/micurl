import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

document.title = process.env.REACT_APP_NAME;

ReactDOM.render(<App />, document.getElementById('root'));

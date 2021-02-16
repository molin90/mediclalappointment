import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './bottomBar.scss';

const bottomBarRoot = document.getElementById('bottombar-root');

const BottomBar = ({ children }) => {
    return ReactDOM.createPortal(children, bottomBarRoot);
}

export default BottomBar;

import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';

import {
    configure
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({
    adapter: new Adapter()
});

export default function HeaderMainpage(props) {
    return (
        <header role="banner">
            <div className="topnav">
                <div className="nav-logo">
                    <i className="fas fa-handshake icon"></i>
                    <h1 className="logo-text">AnyBuddy</h1>
                </div>
                <div className="nav-list">
                    <span className="username">Nitish</span>
                    <span>|</span>
                    <span><button className="logout-button">Logout</button></span>
                </div>
            </div>

            <div className="subnav">
                <button className="nearby-events-button js-menu-button"><i className="fas fa-map-marker-alt"></i>  EVENTS NEAR ME</button>
                <button className="my-events-button"><i className="fas fa-map-pin"></i>  MY EVENTS</button>
            </div>
        </header>
    )
}

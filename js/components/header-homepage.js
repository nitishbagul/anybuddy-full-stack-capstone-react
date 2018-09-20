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

export default function HeaderHomepage(props) {
    return (
            <header className="title-container" role="banner">
            <h1>AnyBuddy</h1>
            <input type="hidden" id="loggedInUserId" data-lat="" data-lng="" value="" />
            </header>
    )
}

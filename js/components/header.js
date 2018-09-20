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

export default function Header(props) {
    return ( <
        header >
        <
        h1 > Not Just Luck < /h1> <
        a href = "#"
        id = "js-signin-link"
        alt = "Sign In" > Sign In < /a> <
        a href = "#"
        id = "js-signout-link"
        alt = "Sign Out" > Sign Out < /a> <
        /header>
    )
}

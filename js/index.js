import React from 'react';
import ReactDOM from 'react-dom';
const render = ReactDOM.render;
import {
    Provider
} from 'react-redux';

// import '../assets/css/main.css';

import HeaderHomepage from '../js/components/header-homepage';
import HeaderMainpage from '../js/components/header-mainpage';

document.addEventListener('DOMContentLoaded', () => {
    return ReactDOM.render( <HeaderHomepage /> ,
        document.getElementById('reactHeaderHomepage'));
});

document.addEventListener('DOMContentLoaded', () => {
    return ReactDOM.render( <HeaderMainpage /> ,
                           document.getElementById('reactHeaderMainpage'));
});

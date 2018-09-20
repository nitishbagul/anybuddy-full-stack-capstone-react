import React from 'react';
import ReactDOM from 'react-dom';
const render = ReactDOM.render;
import {
    Provider
} from 'react-redux';

// import '../assets/css/main.css';

import HeaderHomepage from '../js/components/header-homepage';

document.addEventListener('DOMContentLoaded', () => {
    return ReactDOM.render( <HeaderHomepage /> ,
        document.getElementById('reactHeaderHomepage'));
});

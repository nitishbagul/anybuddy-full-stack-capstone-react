import React from 'react';
import {
    shallow,
    mount,
    render
} from 'enzyme';

import HeaderMainpage from './header-mainpage';

describe('<HeaderMainpage />', () => {
    it('Renders without crashing', () => {
        shallow( < HeaderMainpage / > );
                });
    });

import React from 'react';
import {
    shallow,
    mount,
    render
} from 'enzyme';

import HeaderHomepage from './header-homepage';

describe('<HeaderHomepage />', () => {
    it('Renders without crashing', () => {
        shallow(<HeaderHomepage />);
    });
});

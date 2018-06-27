import React from 'react';
import { shallow } from 'enzyme';
import Carousel from '../lib/Carousel.js';

describe('<Carousel/>', () => {
  it('render a Carousel component', () => {
    const wrapper = shallow(
      <Carousel />
    );
    expect(wrapper.length).toBe(1);
  });
});

import React from 'react';
import Adapter from "enzyme-adapter-react-16";
import { TouchableOpacity } from 'react-native';
import { shallow, configure, mount } from 'enzyme';
import QrScanner from './QrScanner';

import { JSDOM } from "jsdom";

const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const { window } = jsdom;

const copyProps = (src, target) => {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === "undefined")
    .map((prop) => {
    	console.log(JSON.stringify(prop))
    	return Object.getOwnPropertyDescriptor(src, prop)
    });

  Object.defineProperties(target, props);
};

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: "node.js"
};
copyProps(window, global);

// Setup enzyme's react adapter
configure({ adapter: new Adapter() });

// Ignore React Web errors when using React Native
console.error = message => {
  return message;
};

describe('QrScanner Tests', () => {
  test('renders correctly', () => {
    const wrapper = shallow(<QrScanner />);
    expect(wrapper).toMatchSnapshot();
  });

  test('handles legacy Ethereum QR Code data', () => {
    const wrapper = shallow(<QrScanner />);
    expect(wrapper.state().type).toBe('back');
  });

  test('should have a reference to the React Native Camera module', () => {
    const wrapper = mount(<QrScanner />);
    expect(wrapper.instance().camera).toBeDefined();
  });

  test('on scan event', async () => {
    const onBarCodeRead = jest.fn(data => data.rawData);
    const wrapper = mount(<QrScanner onBarCodeRead={onBarCodeRead} />);
    await wrapper
      .find(TouchableOpacity)
      .at(1)
      .props()
      .onPress();
    expect(onBarCodeRead.mock.calls.length).toBe(1);
  });
});
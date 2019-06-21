import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RootAttributePanel from '../rootAttributePanel';

configure({adapter: new Adapter()});

test('RootAttributePanel non active render nothing', () => {
  const api = {
    on: () => {},
    off: () => {}
  };

  const panel = shallow(<RootAttributePanel api={api} active={false} />);

  expect(panel.text()).toEqual('');
});

test('RootAttributePanel render nothing by default', () => {
  const api = {
    on: () => {},
    off: () => {}
  };

  const panel = shallow(<RootAttributePanel api={api} active={true} />);

  expect(panel.text()).toEqual('');
});

test('RootAttributePanel render list', () => {
  let callback = null;
  const api = {
    on: (event, cb) => {
      callback = cb;
    },
    off: () => {
      callback = null;
    },
    getParameters: () => {
      return {
        defaultState: {
          name: 'Default',
          value: null
        },
        states: [
          {
            name: 'Dark',
            value: 'dark'
          }
        ]
      };
    },
    emit: () => {}
  };

  const panel = shallow(<RootAttributePanel api={api} active={true} />);
  callback();

  expect(panel.text()).toEqual('<Styled(Button) /><Styled(Button) />');
  expect(panel.state().currentOptions).toEqual({
    root: 'html',
    attribute: 'class',
    defaultState: {
      name: 'Default',
      value: null
    },
    states: [
      {
        name: 'Dark',
        value: 'dark'
      }
    ]
  });
  expect(panel.state().collectedStates).toEqual([
    {
      name: 'Default',
      value: null,
      selected: true
    },
    {
      name: 'Dark',
      value: 'dark'
    }
  ]);
});

test('RootAttributePanel render toolbar', () => {
  let callback = null;
  const api = {
    on: (event, cb) => {
      callback = cb;
    },
    off: () => {
      callback = null;
    },
    getParameters: () => {
      return {
        defaultState: {
          name: 'Default',
          value: null
        },
        states: [
          {
            name: 'Dark',
            value: 'dark'
          }
        ]
      };
    },
    emit: () => {}
  };

  const panel = shallow(<RootAttributePanel isToolBar={true} api={api} />);
  callback();

  expect(panel.text()).toEqual('<lifecycle(WithTooltipPure) />');
});

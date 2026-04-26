import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

// 1. Mock Storybook's new internal theming engine (Using ES5 to prevent Babel AST crash)
jest.mock('storybook/internal/theming', function() {
  return {
    styled: function() {
      return function() {
        function MockStyled() {
          return null;
        }
        MockStyled.displayName = 'Styled(Component)';
        return MockStyled;
      };
    }
  };
}, {virtual: true});

// 2. Mock Storybook's internal events
jest.mock('storybook/internal/core-events', function() {
  return {STORY_RENDERED: 'storyRendered'};
}, {virtual: true});

// 3. Mock Storybook's internal UI components
jest.mock('storybook/internal/components', function() {
  return {
    Button: function() { return null; },
    IconButton: function() { return null; },
    WithTooltip: function() { return null; },
    TooltipLinkList: function() { return null; }
  };
}, {virtual: true});

// 4. Mock the new standalone icons
jest.mock('@storybook/icons', function() {
  return {ComponentIcon: function() { return null; }};
}, {virtual: true});

// NOW import the component
import RootAttributePanel from '../rootAttributePanel';

configure({adapter: new Adapter()});

test('RootAttributePanel non active render nothing', () => {
  const api = {
    on: () => { },
    off: () => { }
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

  expect(panel.text()).toEqual('<Styled(Component) /><Styled(Component) />');
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

  const panel = shallow(<RootAttributePanel isToolbar={true} api={api} />);
  callback();

  expect(panel.text()).toEqual('<WithTooltip />');
});

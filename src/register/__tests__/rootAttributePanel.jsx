import React from 'react';
import {render, screen, act} from '@testing-library/react';
import '@testing-library/jest-dom'; // Gives us matchers like .toBeInTheDocument()

// Mock Storybook's new internal theming engine
// We make styled(Component) simply return the base Component directly
jest.mock('storybook/internal/theming', function() {
  return {
    styled: function(Component) {
      return function() {
        return Component;
      };
    }
  };
}, {virtual: true});

// Mock Storybook's internal events
jest.mock('storybook/internal/core-events', function() {
  return {STORY_RENDERED: 'storyRendered'};
}, {virtual: true});

// Mock Storybook's internal UI components to render actual HTML elements
jest.mock('storybook/internal/components', function() {
  // Prefixing the variable with "mock" bypasses Jest's scope linter completely!
  const mockReact = require('react');

  const filterProps = (props) => {
    const validDOMProps = {...props};

    delete validDOMProps.outline;
    delete validDOMProps.secondary;
    delete validDOMProps.active;
    return validDOMProps;
  };

  return {
    Button: function(props) { return mockReact.createElement('button', filterProps(props), props.children); },
    IconButton: function(props) { return mockReact.createElement('button', filterProps(props), props.children); },
    WithTooltip: function(props) { return mockReact.createElement('div', {'data-testid': 'with-tooltip'}, props.children); },
    TooltipLinkList: function() { return null; }
  };
}, {virtual: true});

// Mock the new standalone icons
jest.mock('@storybook/icons', function() {
  const mockReact = require('react');

  return {
    ComponentIcon: function() { return mockReact.createElement('svg', {'data-testid': 'component-icon'}); }
  };
}, {virtual: true});

import RootAttributePanel from '../rootAttributePanel';

describe('RootAttributePanel', () => {
  let mockApi;
  let storyRenderedCallback;

  beforeEach(() => {
    storyRenderedCallback = null;

    // Create a fresh mock API for every test
    mockApi = {
      on: jest.fn((event, cb) => {
        storyRenderedCallback = cb;
      }),
      off: jest.fn(),
      getParameters: jest.fn(),
      emit: jest.fn()
    };
  });

  test('renders nothing when not active', () => {
    const {container} = render(<RootAttributePanel api={mockApi} active={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders nothing by default when active but no state', () => {
    const {container} = render(<RootAttributePanel api={mockApi} active={true} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  test('renders list of state buttons when story changes', () => {
    mockApi.getParameters.mockReturnValue({
      defaultState: {name: 'Default', value: null},
      states: [
        {name: 'Dark', value: 'dark'}
      ]
    });

    render(<RootAttributePanel api={mockApi} active={true} />);

    // Simulate Storybook triggering the STORY_RENDERED event
    act(() => {
      storyRenderedCallback('story-id-1');
    });

    // Check that our mocked <button> elements rendered with the correct text
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  test('renders toolbar component with tooltip when isToolbar is true', () => {
    mockApi.getParameters.mockReturnValue({
      defaultState: {name: 'Default', value: null},
      states: [{name: 'Dark', value: 'dark'}]
    });

    render(<RootAttributePanel isToolbar={true} api={mockApi} />);

    act(() => {
      storyRenderedCallback('story-id-1');
    });

    // Check that our mocked WithTooltip div is present
    expect(screen.getByTestId('with-tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('component-icon')).toBeInTheDocument();
  });
});

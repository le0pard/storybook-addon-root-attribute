import React from 'react';
import _merge from 'lodash/merge';
import _uniq from 'lodash/uniq';
import {EVENTS, PARAM_KEY} from './constants';
import {styled} from '@storybook/theming';
import {STORY_RENDERED} from '@storybook/core-events';
import {darken} from 'polished';

const Button = styled.button((props) => ({
  fontSize: props.theme.typography.size.s2 - 1,
  fontWeight: props.theme.typography.weight.bold,
  lineHeight: 1,
  borderRadius: '3em',
  cursor: 'pointer',
  display: 'inline-block',
  overflow: 'hidden',
  padding: '13px 20px',
  margin: '5px 10px',
  position: 'relative',
  textAlign: 'center',
  textDecoration: 'none',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  background: 'transparent',
  transition: 'all 150ms ease-out',
  transform: 'translate3d(0, 0, 0)',
  opacity: 1,

  ...(props.selected && {
    background: props.theme.color.secondary,
    color: props.theme.color.lightest,
    '&:hover': {
      background: darken(0.05, props.theme.color.secondary)
    }
  })
}));

const DEFAULT_VALUES = {
  root: 'html',
  attribute: 'class',
  defaultState: {},
  states: []
};

export default class RootAttributePanel extends React.Component {
  constructor(props) {
    super(props);
    this.onStoryChange = this.onStoryChange.bind(this);
    this.emit = this.emit.bind(this);
    this.state = {
      currentStoryId: null,
      currentOptions: DEFAULT_VALUES,
      collectedStates: []
    };
  }

  componentDidMount() {
    const {api} = this.props;
    api.on(STORY_RENDERED, this.onStoryChange);
  }

  componentWillUnmount() {
    const {api} = this.props;
    api.off(STORY_RENDERED, this.onStoryChange);
  }

  onStoryChange(id) {
    const {currentStoryId, collectedStates} = this.state;
    const {api} = this.props;
    const params = api.getParameters(id, PARAM_KEY);

    if (params && id !== currentStoryId) {
      const existingNames = collectedStates.reduce((arr, res) => {
        arr[res.name] = res;
        return arr;
      }, {});

      const options = _merge(DEFAULT_VALUES, params);
      const statesList = [options.defaultState].concat(options.states);

      let mergedList = statesList.map((res) => {
        const existingItem = existingNames[res.name];

        if (existingItem && existingItem.selected) {
          return {
            ...res,
            selected: existingItem.selected
          };
        }

        return res;
      });

      if (!mergedList.some((st) => !!st.selected)) {
        mergedList = [
          {...mergedList[0], selected: true},
          ...mergedList.slice(1)
        ];
      }

      if (mergedList.filter((st) => !!st.selected).length > 1) {
        mergedList = [
          {...mergedList[0], selected: true},
          ...mergedList.slice(1).map(({name, value}) => ({name, value}))
        ];
      }

      this.setState(() => ({
        currentOptions: options,
        collectedStates: mergedList,
        currentStoryId: id
      }), () => {
        this.emit();
      });
    }
  }

  onSelected(selectedName) {
    const {collectedStates} = this.state;
    const newStates = collectedStates.map(({name, value}) => {
      if (selectedName === name) {
        return {
          name,
          value,
          selected: true
        };
      }
      return {name, value};
    });
    this.setState((prevState) => ({
      ...prevState,
      collectedStates: newStates
    }), () => {
      this.emit();
    });
  }

  emit() {
    const {api} = this.props;
    const {currentOptions: {root, attribute}, collectedStates} = this.state;
    const currentState = collectedStates.find((st) => !!st.selected);

    api.emit(EVENTS.UPDATE, {
      root,
      attribute,
      currentState
    });
  }

  invalidOptions(collectedStates) {
    if (collectedStates && collectedStates.length > 0) {
      const haveValues = collectedStates.every((st) => (
        st.hasOwnProperty('name') && st.hasOwnProperty('value')
      ));
      if (!haveValues) {
        return [true, 'All states should have name and value keys'];
      }

      const names = collectedStates.map((st) => st.name);
      if (names.length !== _uniq(names).length) {
        return [true, 'Found non unique name values'];
      }
    }
    return [false, null];
  }

  render() {
    const {active} = this.props;

    if (!active) {
      return null;
    }

    const {collectedStates} = this.state;

    const [isInvalid, errorMessage] = this.invalidOptions(collectedStates);
    if (isInvalid) {
      return (
        <p>ERROR: {errorMessage}</p>
      );
    }

    return (
      <div>
        {collectedStates && collectedStates.map(({name, selected}) => (
          <Button
            key={name}
            onClick={() => this.onSelected(name)}
            selected={!!selected}>
            {name}
          </Button>
        ))}
      </div>
    );
  }
}

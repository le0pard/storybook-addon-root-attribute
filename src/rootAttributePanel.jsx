import React from 'react';
import _merge from 'lodash/merge';
import {EVENTS, PARAM_KEY} from './constants';
import {STORY_RENDERED} from '@storybook/core-events';

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
      currentOptions: DEFAULT_VALUES
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

  onStoryChange (id) {
    const {currentOptions, currentStoryId} = this.state;
    const {api} = this.props;
    const params = api.getParameters(id, PARAM_KEY);

    if (params && id !== currentStoryId) {
      const existingNames = currentOptions.states.reduce((arr, res) => {
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
          }
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
        currentOptions: {
          ...options,
          states: mergedList
        },
        currentStoryId: id
      }), () => {
        this.emit();
      });
    }
  }

  emit() {
    const {api} = this.props;
    const {currentOptions: {root, attribute, states}} = this.state;
    const currentState = states.find((st) => !!st.selected);

    api.emit(EVENTS.UPDATE, {
      root,
      attribute,
      currentState
    });
  }

  render() {
    return (
      <h2>Hello</h2>
    )
  }
}

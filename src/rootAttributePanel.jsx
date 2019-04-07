import React from 'react';
import {EVENTS, PARAM_KEY} from './constants';
import {STORY_RENDERED} from '@storybook/core-events';

export default class RootAttributePanel extends React.Component {
  state = {value: ''};

  constructor(props) {
    super(props);
    this.onStoryChange = this.onStoryChange.bind(this);
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
    const {api} = this.props;
    console.log(id);
    const params = api.getParameters(id, PARAM_KEY);
    console.log('params', params);
  };

  render() {
    return (
      <h2>Hello</h2>
    )
  }
}

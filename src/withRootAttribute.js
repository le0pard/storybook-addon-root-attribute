import document from 'global/document';
import {EVENTS, PARAM_KEY} from './constants';
import {addons, makeDecorator} from '@storybook/addons';

const updateRootAttribute = ({root = 'html', attribute, currentState}) => {
  const element = (() => {
    if (root === 'body') {
      return document.body;
    }
    if (root === 'html') {
      return document.documentElement;
    }
    return document.querySelector(root) || document.documentElement;
  })();

  element.removeAttribute(attribute);

  if (currentState.value !== null) {
    element.setAttribute(attribute, currentState.value);
  }
};

export const withRootAttribute = makeDecorator({
  name: 'withRootAttribute',
  parameterName: PARAM_KEY,
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: false,
  wrapper: (getStory, context) => {
    addons.getChannel().on(EVENTS.UPDATE, updateRootAttribute);

    return getStory(context);
  }
});

import {EVENTS, PARAM_KEY} from './register/constants';
import {addons, makeDecorator} from 'storybook/preview-api';

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

let isListening = false;

export const withRootAttribute = makeDecorator({
  name: 'withRootAttribute',
  parameterName: PARAM_KEY,
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: false,
  wrapper: (getStory, context) => {
    if (!isListening) {
      addons.getChannel().on(EVENTS.UPDATE, updateRootAttribute);
      isListening = true;
    }

    return getStory(context);
  }
});

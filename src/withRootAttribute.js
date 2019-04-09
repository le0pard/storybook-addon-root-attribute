import document from 'global/document';
import {EVENTS, PARAM_KEY} from './constants';
import {addons, makeDecorator} from '@storybook/addons';

const updateRootAttribute = (currentOptions) => {
  const element = ((root) => {
    if (root === 'body') {
      return document.body;
    }
    return document.documentElement;
  })(currentOptions.root)

  if (currentOptions.attribute === 'class') {
    element.className = '';

    if (currentOptions.currentState.value !== null) {
      element.classList.add(currentOptions.currentState.value);
    }
  } else {
    element.removeAttribute(currentOptions.attribute);

    if (currentOptions.currentState.value !== null) {
      element.setAttribute(
        currentOptions.attribute,
        currentOptions.currentState.value
      );
    }
  }
}

export const withRootAttribute = makeDecorator({
  name: 'withRootAttribute',
  parameterName: PARAM_KEY,
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: false,
  wrapper: (getStory, context) => {
    addons.getChannel().on(EVENTS.UPDATE, updateRootAttribute);

    return getStory(context);
  }
})


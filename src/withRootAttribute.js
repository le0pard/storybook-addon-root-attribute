import document from 'global/document';
import {EVENTS, PARAM_KEY} from './constants';
import {addons, makeDecorator} from '@storybook/addons';

const updateRootAttribute = ({root, attribute, currentState}) => {
  const element = (() => {
    if (root === 'body') {
      return document.body;
    }
    return document.documentElement;
  })()

  element.removeAttribute(attribute);

  if (currentState.value !== null) {
    element.setAttribute(
      attribute,
      currentState.value
    );
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


import {EVENTS, PARAM_KEY} from './constants';
import {addons, makeDecorator} from '@storybook/addons';

const updateRootAttribute = () => {
  // TODO
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


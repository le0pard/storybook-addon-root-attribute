# Storybook Addon Root Attribute [![Build Status](https://travis-ci.com/le0pard/storybook-addon-root-attribute.svg?branch=master)](https://travis-ci.com/le0pard/storybook-addon-root-attribute)

Storybook Addon Root Attribute to switch html or body attribute at runtime for your story [Storybook](https://storybook.js.org)

## Installation

```sh
yarn add -D storybook-addon-root-attribute
```

## Configuration

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import 'storybook-addon-root-attribute/register';
```

## Usage

You need add the all the css resources at compile time using the `withRootAttribute` decorator. They can be added globally or per story. You can then choose which ones root attribute activate on addon ui:

```js
// Import from @storybook/X where X is your framework
import { configure, addDecorator, addParameters, storiesOf } from '@storybook/react';
import { withRootAttribute } from 'storybook-addon-root-attribute';

// global
addDecorator(withRootAttribute)
addParameters({
  rootAttribute: {
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
  },
});

You can use the `rootAttribute` parameter to override resources on each story individually:

// per story
storiesOf('Addons|RootAttribute', module)
  .add('Camera Icon', () => <i className="fa fa-camera-retro"> Camera Icon</i>, {
      rootAttribute: {
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
      },
  });
```

## Configuration

Configuration params for `rootAttribute` parameter:

| **Name**     | *Default* | *Variants*                                                                | **Description**                                                                                                         |
| ------------ | --------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| root         | 'html'    | 'html', 'body'                                                            | Root node, which attribute will changed by addon                                                                        |
| attribute    | 'class'   | any valid attribute name                                                  | Attribute name                                                                                                          |
| defaultState | {}        | should contain `name` and `value`                                         | Default state for attribute. Value `nil` will remove attribute from root                                                |
| states       | []        | array with objects, which contain unique `name` and `value` for attribute | All needed states for attribute values. Each object should contain unique `name` (for button) and `value` for attribute |

Configuration example:

```js
addDecorator(withRootAttribute)
addParameters({
  rootAttribute: {
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
  },
})
```

# Storybook Addon Root Attribute [![Build Status](https://travis-ci.com/le0pard/storybook-addon-root-attribute.svg?branch=master)](https://travis-ci.com/le0pard/storybook-addon-root-attribute)

Storybook Addon Root Attribute to switch html, body or some element attribute at runtime for your story [Storybook](https://storybook.js.org)

## [Demo](https://storybook-addon-root-attribute.leopard.in.ua)

## Installation

```sh
yarn add -D storybook-addon-root-attribute
```

## Configuration

Then create a file called `addons.js` in your storybook config and add following content to it:

```js
import "storybook-addon-root-attribute/register";
```

or create a file called `main.js` and add addong in `addons` section:

```js
module.exports = {
  ...
  addons: [
    ...
    'storybook-addon-root-attribute/register'
  ]
};
```

## Usage

You need add the all the attribute values at compile time using the `withRootAttribute` decorator. They can be added globally or per story. You can then choose which ones root attribute activate on addon ui:

```js
// Import from @storybook/X where X is your framework
import {
  configure,
  addDecorator,
  addParameters,
  storiesOf
} from "@storybook/react";
import { withRootAttribute } from "storybook-addon-root-attribute";

// global
addDecorator(withRootAttribute);
addParameters({
  rootAttribute: {
    defaultState: {
      name: "Default",
      value: null
    },
    states: [
      {
        name: "Dark",
        value: "dark"
      }
    ]
  }
});
```

You can use the `rootAttribute` parameter to override resources on each story individually:

```js
// per story
storiesOf("Addons|RootAttribute", module).add(
  "Camera Icon",
  () => <i className="fa fa-camera-retro"> Camera Icon</i>,
  {
    rootAttribute: {
      defaultState: {
        name: "Default",
        value: null
      },
      states: [
        {
          name: "Dark",
          value: "dark"
        }
      ]
    }
  }
);
```

If you want to use a tooltip (panel will not dissapear), you need to set `tooltip` in parameters with `true` value:

```js
addParameters({
  rootAttribute: {
    tooltip: true,
    defaultState: {
      name: "Default",
      value: null
    },
    states: [
      {
        name: "Dark",
        value: "dark"
      }
    ]
  }
});
```

Tooltip and panel will not sync about change attribute.

## Configuration

Configuration params for `rootAttribute` parameter:

| **Name**     | _Default_ | _Variants_                                                                                          | **Description**                                                                                                         |
|--------------|-----------|-----------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| root         | 'html'    | 'html', 'body', or first element returned by 'document.querySelector(), or if none found -- 'html'' | Root node, which attribute will changed by addon                                                                        |
| attribute    | 'class'   | any valid attribute name                                                                            | Attribute name                                                                                                          |
| defaultState | {}        | should contain `name` and `value`                                                                   | Default state for attribute. Value `nil` will remove attribute from root                                                |
| states       | []        | array with objects, which contain unique `name` and `value` for attribute                           | All needed states for attribute values. Each object should contain unique `name` (for button) and `value` for attribute |
| tooltip      | false     | boolean value                                                                                       | Add tooltip button for storybook                                                                                        |

Configuration example:

```js
addDecorator(withRootAttribute);
addParameters({
  rootAttribute: {
    root: "html",
    attribute: "class",
    defaultState: {
      name: "Default",
      value: null
    },
    states: [
      {
        name: "Dark",
        value: "dark"
      },
      {
        name: "A11Y",
        value: "accessibility"
      }
    ]
  }
});
```

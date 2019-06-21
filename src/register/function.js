import React from 'react';
import RootAttributePanel from './rootAttributePanel';
import {addons, types} from '@storybook/addons';
import {ADDON_ID, PANEL_ID} from './constants';

export const register = (initToolBar = false) => {
  addons.register(ADDON_ID, (api) => {
    if (initToolBar) {
      addons.add(PANEL_ID, {
        type: types.TOOL,
        title: '',
        match: ({viewMode}) => viewMode === 'story',
        render: () => (
          <RootAttributePanel isToolBar={true} key={PANEL_ID} api={api} />
        )
      });
    } else {
      addons.add(PANEL_ID, {
        type: types.PANEL,
        title: 'Root attribute',
        render: ({active}) => (
          <RootAttributePanel key={PANEL_ID} api={api} active={active} />
        )
      });
    }
  });
};

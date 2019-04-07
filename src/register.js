import React from 'react';
import RootAttributePanel from './rootAttributePanel';
import {addons, types} from '@storybook/addons';
import {ADDON_ID, PANEL_ID} from './constants';

addons.register(ADDON_ID, (api) => {
  const render = ({active}) => (
    <RootAttributePanel key={PANEL_ID} api={api} active={active} />
  );
  const title = 'Root attribute';

  addons.add(PANEL_ID, {
    type: types.PANEL,
    title,
    render
  });
});

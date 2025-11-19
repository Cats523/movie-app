/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import AppNavigator from '../app/navigation/AppNavigator.tsx';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<AppNavigator />);
  });
});

/**
 * @format
 */

import 'react-native';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
// import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

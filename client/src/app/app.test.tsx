import {render} from '@testing-library/react';
import React from 'react';

import '../ram-context';

import {AppView} from './app.view';

test('renders learn react link', () => {
  const {getByText} = render(<AppView {...{
    Shell: {} as Shell,
  }} />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

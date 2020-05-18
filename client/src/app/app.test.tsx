import {render} from '@testing-library/react';
import React from 'react';

import '../ram-context';

import {AppView} from './app.view';

test('renders routes', () => {
  const {getByText} = render(
    <AppView {...{
      Shell: {
        foo: () => <div>foo</div>,
        LoginStatusView: () => null,
      } as any,
      router: {
        routeConfig: {
          '/foo': 'foo',
        },
      },
    }} />,
  );
  const linkElement = getByText(/\/foo/i);
  expect(linkElement).toBeInTheDocument();
});

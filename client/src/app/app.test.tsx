import {render} from '@testing-library/react';

import '../ram-context';

import {AppView} from './app.view';

test('renders routes', () => {
  const {getByText} = render(
    <AppView {...{
      Shell: {
        foo: () => <div>foo</div>,
        LoginStatusView: () => null,
      } as any,
      routerRoot: {
        routeConfig: {
          '/': 'foo',
        },
      } as any,
    }} />,
  );
  const linkElement = getByText('foo');
  expect(linkElement).toBeInTheDocument();
});

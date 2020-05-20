import React from 'react';

import {ReactComponent as RefreshSvg} from './cw.svg';

export function ButtonRefresh(props: React.ButtonHTMLAttributes<{}>) {
  const {className, ...rest} = props;
  const styles = [
    'transition duration-100 ease-in-out transform hover:scale-150',
    className ?? '',
  ];
  return (
    <button {...{
      type: 'button',
      className: styles.join(' '),
      ...rest,
    }}>
      <RefreshIcon />
    </button>
  );
}

Object.assign(ButtonRefresh, {[Symbol.for('ram.deps')]: []});

function RefreshIcon() {
  return (
    <div className="inline-block h-4 w-4">
      <RefreshSvg stroke="currentColor" />
    </div>
  );
}


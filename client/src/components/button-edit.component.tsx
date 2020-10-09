import type {React} from '@ram-stack/core';

import {ReactComponent as RefreshSvg} from './edit.svg';

export function ButtonEdit(props: React.ButtonHTMLAttributes<{}>) {
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

function RefreshIcon() {
  return (
    <div className="inline-block h-4 w-4">
      <RefreshSvg stroke="currentColor" />
    </div>
  );
}


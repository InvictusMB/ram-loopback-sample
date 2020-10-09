import type {React} from '@ram-stack/core';
import {ReactComponent as CancelSvg} from '../components/ccw.svg';

export function ButtonCancel(props: React.ButtonHTMLAttributes<{}>) {
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
      <CancelIcon />
    </button>
  );
}

function CancelIcon() {
  return (
    <div className="inline-block h-4 w-4">
      <CancelSvg stroke="currentColor" />
    </div>
  );
}


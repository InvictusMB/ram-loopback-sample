import type {React} from '@ram-stack/core';

export function ButtonPrimary(props: React.ButtonHTMLAttributes<{}>) {
  const {className, ...rest} = props;
  const styles = [
    'py-1 px-2 my-2 mx-1 flex-shrink-0',
    'text-sm text-white bg-teal-500 border-teal-500 border-2 rounded',
    'hover:bg-teal-700 hover:border-teal-700',
    className ?? '',
  ];
  return (
    <button {...{
      type: 'button',
      className: styles.join(' '),
      ...rest,
    }} />
  );
}

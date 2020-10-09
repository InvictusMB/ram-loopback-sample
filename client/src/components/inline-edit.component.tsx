export function InlineEdit(props: ButtonAcceptProps) {
  const {
    Shell,
    className,
    value,
    onChange,
    onAccept,
    onCancel,
    placeholder,
  } = props;
  return (
    <div{...{
      className: className ?? '',
    }}>
      <div className="flex w-full px-2 font-semibold text-gray-500">
        <div className="border-b border-b-2 border-teal-500">
          <input
            className="bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight"
            type="text"
            {...{
              value,
              placeholder,
              onChange: e => onChange(e.target.value),
              onClick: e => e.preventDefault(),
            }}
          />
        </div>
        <Shell.ButtonAccept {...{
          className: 'text-green-500',
          onClick: e => {
            e.preventDefault();
            onAccept();
          },
        }} />
        <Shell.ButtonCancel{...{
          onClick: e => {
            e.preventDefault();
            onCancel();
          },
        }} />
      </div>
    </div>
  )
    ;
}

InlineEdit.dependencies = [
  Injected.Shell,
];
type ButtonAcceptProps = PickInjected<typeof InlineEdit.dependencies> & {
  className?: string,
  value: string,
  placeholder?: string,
  onChange: (v: string) => void,
  onAccept: () => void,
  onCancel: () => void,
}



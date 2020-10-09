import {
  hooks,
  view,
} from '@ram-stack/core';

export function CommentEdit(props: CommentEditProps) {
  const {
    value,
    placeholder,
    onChange,
    className = '',
  } = props;
  const showPlaceholder = !value && placeholder;
  return (
    <div className={`relative mx-4 px-2 py-2 bg-gray-200 ${className}`}>
      {showPlaceholder && (
        <div className="top-0 pt-4 pl-2 absolute text-gray-300 pointer-events-none">
          {placeholder}
        </div>
      )}
      <MemoEditable {...{
        value,
        onChange,
      }} />
    </div>
  );
}

type CommentEditProps = {
  value: string;
  placeholder?: string;
  onChange?: (v: string) => void
  className?: string;
};

function Editable(props: EditableProps) {
  const {
    value,
    onChange = (v: string) => {
    },
  } = props;
  const contentDiv = hooks.useRef(null);

  function handleChange() {
    onChange((contentDiv.current as any).innerHTML);
  }

  return (
    <div className="rounded-lg border-black bg-white p-2" {...{
      ref: contentDiv,
      onInput: handleChange,
      onBlur: handleChange,
      onKeyUp: handleChange,
      onKeyDown: handleChange,
      contentEditable: true,
      spellCheck: true,
      dangerouslySetInnerHTML: {__html: value},
    }} />
  );
}

type EditableProps = {
  value: string;
  onChange?: (v: string) => void
  className?: string;
};

const MemoEditable = view.memo(Editable, (old, {value}) => {
  return !!value;
});

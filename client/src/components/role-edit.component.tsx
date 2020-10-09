import {UserRolesEnum} from '../openapi/models';

export function RoleEdit(props: RoleEditProps) {
  const {value = [], onChange} = props;
  const roles = Object.values(UserRolesEnum);
  return (
    <div className="flex">
      {roles.map(r => {
        if (value.includes(r)) {
          return (
            <button
              key={r}
              className="font-bold ml-2 text-gray-200 bg-teal-600 px-2 rounded-lg self-center"
              onClick={() => onChange(value.filter(v => v !== r))}
            >
              {r}
            </button>
          );
        }
        return (
          <button
            key={r}
            className="font-bold ml-2 text-teal-600 bg-gray-200 px-2 rounded-lg self-center"
            onClick={() => onChange(value.concat([r]))}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}

type RoleEditProps = {
  value?: string[],
  onChange: (v: string[]) => void
}

import _ from 'lodash';
import React, {useState} from 'react';

export function LoginFormView({Shell, sessionStore}: PickInjected<typeof dependencies>) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  if (sessionStore.isFetching) {
    return (
      <Shell.Spinner />
    );
  }

  const errors = extractMessages(sessionStore.error);

  return (
    <form className="w-full">
      <div className="flex items-center">
        <div className="w-full w-2/6 mx-3 py-2">
          <div className="border-b border-b-2 border-teal-500">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              aria-label="Login"
              placeholder="Login"
              value={login}
              onChange={e => setLogin(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full w-2/6 mx-3 py-2">
          <div className="border-b border-b-2 border-teal-500">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="password"
              aria-label="Password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>
        <Shell.ButtonPrimary {...{
          onClick: () => sessionStore.login({login, password}),
          children: 'Sign In',
        }} />
        <Shell.ButtonSecondary {...{
          className: 'mr-2',
          onClick: () => sessionStore.createUser({login, password}),
          children: 'Register',
        }} />
      </div>
      {errors.map((e, i) => (
        <p className="text-red-500 text-xs italic px-3" key={i}>{e}</p>
      ))}
    </form>
  );
}

function extractMessages(e: any): string[] {
  if (!e) {
    return [];
  }
  if (e.details) {
    return (e.details ?? []).map((d: any) => {
      const path = _.capitalize(_.trimStart((d?.path ?? '').replace('/', ' ')));
      return `${path} ${d?.message}`;
    });
  }
  if (e.message) {
    return [e.message];
  }
  return ['Login failed'];
}

const dependencies = [Injected.Shell, Injected.sessionStore] as const;

Object.assign(LoginFormView, {[Symbol.for('ram.deps')]: dependencies});

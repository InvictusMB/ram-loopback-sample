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
        <button
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-2 text-white py-1 px-2 m-1 rounded"
          type="button"
          onClick={() => sessionStore.login({login, password})}
        >
          Sign In
        </button>
        <button
          className="flex-shrink-0 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-teal-500 hover:text-white text-sm border-2 text-white py-1 px-2 m-1 rounded"
          type="button"
          onClick={() => sessionStore.createUser({login, password})}
        >
          Register
        </button>
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

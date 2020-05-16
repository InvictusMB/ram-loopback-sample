/*eslint-disable @typescript-eslint/no-explicit-any*/
export function createFluentAPI<T, U extends ExtensionSet<T>>(factory: Factory<T>, extensions: U) {
  class FluentAPIImpl<T> {
    result?: Promise<T>;

    constructor(public data: Partial<T>) {
    }

    reset() {
      this.result = undefined;
      return this;
    }
  }

  const mappedExtensions = {};
  Object.keys(extensions).forEach(key => {
    Object.assign(mappedExtensions, {
      [key](...args: any[]) {
        const data = extensions[key].call(this, cloneShallow(this.data as Partial<T>), ...args);
        return new FluentAPIImpl(data);
      },
    } as Partial<FluentAPIImpl<T>>);
  });

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  Object.assign(FluentAPIImpl.prototype, Promise.prototype, mappedExtensions, {
    then(cb: (v: T) => any, ecb?: (e: Error) => any) {
      this.result = this.result ?? new Promise<T>(resolve => {
        return resolve(factory(this.data as T));
      });
      return this.result.then(cb, ecb);
    },
  } as Partial<FluentAPIImpl<T>>);

  return (data: Partial<T> = {}) => (new FluentAPIImpl(cloneShallow(data)) as any) as FluentAPIWithPromise<T, U>;
}

type ExtensionSet<T> = {
  [name: string]: (data: Partial<T>, ...args: any[]) => Partial<T>
}

type MappedExtensions<T, U> = {
  [name in keyof U]: ToApiExtension<U[name], FluentAPIWithPromise<T, U>>
};

type ToApiExtension<T, R> = T extends (a1: any, ...args: infer U) => any ? (...args: U) => R : never;

type FluentAPI<T, U> = MappedExtensions<T, U> & {
  reset: () => FluentAPI<T, U>
};

export type FluentAPIWithPromise<T, U> = FluentAPI<T, U> & Promise<T>;

type Factory<T> = (data: T) => Promise<T>

function cloneShallow<T>(data: T): T {
  return {...data};
}

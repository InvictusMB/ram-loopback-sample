import _ from 'lodash';

export class PersistedValue<T> {
  private readonly key: string;
  private readonly defaultValue: any;

  constructor(key: string, defaultValue: any = null) {
    this.key = key;
    this.defaultValue = defaultValue;
  }

  public get(): T {
    const serialized = window.localStorage.getItem(this.key);
    if (serialized) {
      try {
        return JSON.parse(serialized);
      } catch (e) {
        console.error(`Invalid value in localStorage: ${this.key}`);
      }
    }
    return _.cloneDeep(this.defaultValue);
  }

  public set(value: T) {
    return window.localStorage.setItem(this.key, JSON.stringify(value));
  }

  public clear() {
    return window.localStorage.removeItem(this.key);
  }
}

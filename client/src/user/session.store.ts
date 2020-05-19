import {computed, observable, qs, task} from '../core';
import {Configuration, LoginCredentials} from '../openapi';
import {UserControllerApi} from '../openapi/apis';
import {PersistedValue} from './persisted-value';

const AUTH_LOCAL_STORAGE_KEY = 'sessionData';

export class SessionStore {
  @observable session: Session;

  apiService: SessionStoreDeps[typeof Injected.apiService];
  userApi: UserControllerApi;

  login = task.resolved(async (credentials: LoginCredentials) => {
    try {
      const {token} = await this.userApi.userControllerLogin({loginCredentials: credentials});
      if (!token) {
        return Promise.reject(new Error('No token received'));
      }

      this.session = {
        isLoggedIn: true,
        token,
      };
      this.storedSession.set(this.session);
      this.createUser.reset()
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  });
  createUser = task.resolved(async (credentials: LoginCredentials) => {
    try {
      await this.userApi.userControllerCreate({newUser: credentials});
      await this.login(credentials);
    } catch (response) {
      const error = await this.apiService.parseResponseError(response);
      return Promise.reject(error);
    }
  });
  logout = task.resolved(async () => {
    this.storedSession.clear();
    this.session = this.storedSession.get();
  });
  private storedSession: PersistedValue<Session>;

  constructor(deps: PickInjected<typeof dependencies>) {
    this.apiService = deps.apiService;
    this.storedSession = createStoredValue();
    this.session = this.storedSession.get();

    this.userApi = new UserControllerApi(new Configuration({
      queryParamsStringify: qs.stringify,
    }));
  }

  @computed get isFetching() {
    return (
      this.login.pending
      || this.createUser.pending
    );
  }

  @computed get isLoggedIn() {
    return (
      this.session.isLoggedIn
    );
  }

  @computed get error() {
    return this.login.error || this.createUser.error;
  }
}

const dependencies = [Injected.apiService] as const;
type SessionStoreDeps = PickInjected<typeof dependencies>;

type Session = LoggedInSession | NoSession;

type NoSession = {
  isLoggedIn: false;
}

type LoggedInSession = {
  isLoggedIn: true,
  token: string,
}

function createStoredValue() {
  return new PersistedValue<Session>(AUTH_LOCAL_STORAGE_KEY, {
    isLoggedIn: false,
  });
}

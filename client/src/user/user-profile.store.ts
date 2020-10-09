import {
  computed,
  IReactionDisposer,
  observable,
  reaction,
  task,
} from '@ram-stack/core';

import {qs} from '../utils';
import {
  Configuration,
  UserControllerApi,
  User as UserProfile,
} from '../openapi';


export class UserProfileStore {
  static dependencies = [
    Injected.apiService,
    Injected.sessionStore,
  ];

  @observable userProfile: UserProfile | null = null;

  sessionStore: Injected.classes.SessionStore;
  loginReaction: IReactionDisposer;
  userApi?: UserControllerApi;

  constructor({sessionStore}: UserProfileStoreDeps) {
    this.sessionStore = sessionStore;

    this.loginReaction = reaction(
      () => sessionStore.session,
      (session) => {
        if (session.isLoggedIn) {
          this.userApi = new UserControllerApi(new Configuration({
            queryParamsStringify: qs.stringify,
            accessToken: session.token
          }));
          this.load();
        } else {
          this.reset();
        }
      },
      {fireImmediately: true},
    );
  }

  @computed get isFetching() {
    return (
      // @ts-ignore
      this.load.pending
    );
  }

  @task.resolved
  async load() {
    this.userProfile = await this.userApi!.userControllerPrintCurrentUser();
  }

  reset() {
    this.userProfile = null;
  }
}

type UserProfileStoreDeps = PickInjected<typeof UserProfileStore.dependencies>;

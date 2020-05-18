import {qs, task, computed, observable, reaction, IReactionDisposer} from '../core';
import {
  Configuration,
  UserControllerApi,
  User as UserProfile,
} from '../openapi';


export class UserProfileStore {
  @observable userProfile: UserProfile | null = null;

  sessionStore: UserProfileStoreDeps[typeof Injected.sessionStore];
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

const dependencies = [
  Injected.apiService,
  Injected.sessionStore,
] as const;
type UserProfileStoreDeps = PickInjected<typeof dependencies>;

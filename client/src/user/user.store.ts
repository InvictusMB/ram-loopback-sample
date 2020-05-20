import fp from 'lodash/fp';

import {task, computed, observable, reaction, IReactionDisposer} from '../core';
import {
  User,
} from '../openapi';


export class UserStore {
  @observable users: User[] | null = null;

  sessionStore: UserStoreDeps[typeof Injected.sessionStore];
  userService: UserStoreDeps[typeof Injected.userService];
  loginReaction: IReactionDisposer;

  load = task.resolved(async () => {
    this.users = await this.userService.getUsers();
  });

  delete = task.resolved(async (user) => {
    await this.userService.deleteUser(user);
    this.users = fp.filter(u => u.id !== user.id, this.users);
  });

  update = task.resolved(async (user) => {
    await this.userService.updateUser(user);
  });

  constructor({sessionStore, userService}: UserStoreDeps) {
    this.sessionStore = sessionStore;
    this.userService = userService;

    this.loginReaction = reaction(
      () => sessionStore.session,
      (session) => {
        if (session.isLoggedIn) {
        } else {
          this.reset();
        }
      },
      {fireImmediately: true},
    );
  }

  @computed get isFetching() {
    return (
      this.load.pending
    );
  }

  reset() {
    this.users = null;
  }
}

const dependencies = [
  Injected.apiService,
  Injected.sessionStore,
  Injected.userService,
] as const;
type UserStoreDeps = PickInjected<typeof dependencies>;

import {
  computed,
  IReactionDisposer,
  observable,
  reaction,
  task,
} from '@ram-stack/core';
import fp from 'lodash/fp';

import {
  User,
} from '../openapi';


export class UserStore {
  static dependencies = [
    Injected.apiService,
    Injected.sessionStore,
    Injected.userService,
  ];

  @observable users: User[] | null = null;

  sessionStore: Injected.classes.SessionStore;
  userService: Injected.classes.UserService;
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

type UserStoreDeps = PickInjected<typeof UserStore.dependencies>;

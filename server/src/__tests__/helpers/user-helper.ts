import {ServerApplication} from '../../application';
import {PasswordHasherBindings} from '../../keys';
import {User, UserRole} from '../../models';
import {UserRepository} from '../../repositories';

export async function createAUser(app: ServerApplication, userPassword: string, roles: UserRole[] = ['user']) {
  const userRepo: UserRepository = await app.get('repositories.UserRepository');
  const passwordHasher = await app.get(PasswordHasherBindings.PASSWORD_HASHER);

  const encryptedPassword = await passwordHasher.hashPassword(userPassword);
  const newUser = await userRepo.create({
    name: getUniqueUserName(),
    roles,
  });
  // MongoDB returns an id object we need to convert to string
  newUser.id = newUser.id.toString();

  await userRepo.userCredentials(newUser.id).create({
    password: encryptedPassword,
  });

  return newUser;
}

let count = 0;

export function getUniqueUserName() {
  return 'user' + (++count);
}

export function toCredentials(user: Partial<User>) {
  return {
    login: user.name,
    roles: user.roles,
  };
}

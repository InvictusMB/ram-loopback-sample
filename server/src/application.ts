import {AuthenticationComponent} from '@loopback/authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
  AuthorizationDecision,
  AuthorizationTags,
} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {
  JWTAuthenticationStrategy,
  JWTOptionalAuthenticationStrategy,
} from './authentication-strategies';
import {bootOptions} from './boot-options';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from './keys';
import {MySequence} from './sequence';
import {
  adminAuthorization,
  BcryptHasher,
  JWTService,
  MyUserService
} from './services';

const defaultOptions = {
  disablePersistence: false,
};

export class ServerApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  options: ServerConfig;

  constructor(options: ServerConfig = defaultOptions) {
    super(options);

    this.setUpBindings();

    this.configure(AuthorizationBindings.COMPONENT).to({
      precedence: AuthorizationDecision.ALLOW,
      defaultDecision: AuthorizationDecision.ALLOW,
    });

    // Bind authentication component related elements
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    // authentication
    this.add(createBindingFromClass(JWTAuthenticationStrategy));
    this.add(createBindingFromClass(JWTOptionalAuthenticationStrategy));

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = bootOptions;
  }

  setUpBindings(): void {
    if (this.options.disablePersistence) {
      this.bind('datasources.config.memory').to({
        name: 'memory',
        connector: 'memory',
        localStorage: 'restaurant-reviews-db'
      });
    }

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);

    this.bind('authorizationProviders.admin').to(adminAuthorization).tag(AuthorizationTags.AUTHORIZER);
  }
}

type ServerConfig = ApplicationConfig & {
  disablePersistence?: boolean,
}

import {BootOptions} from '@loopback/boot';

export const bootOptions: BootOptions = {
  controllers: {
    dirs: ['controllers'],
    extensions: ['.controller.js', '.controller.ts'],
    nested: true,
  },
  datasources: {
    dirs: ['datasources'],
    extensions: ['.datasource.js', '.datasource.ts'],
    nested: true,
  },
  interceptors: {
    dirs: ['interceptors'],
    extensions: ['.interceptor.js', '.interceptor.ts'],
    nested: true,
  },
  observers: {
    dirs: ['observers'],
    extensions: ['.observer.js', '.observer.ts'],
    nested: true,
  },
  models: {
    dirs: ['models'],
    extensions: ['.model.js', '.model.ts'],
    nested: true,
  },
  repositories: {
    dirs: ['repositories'],
    extensions: ['.repository.js', '.repository.ts'],
    nested: true,
  },
  services: {
    dirs: ['services'],
    extensions: ['.service.js', '.service.ts'],
    nested: true,
  },
};

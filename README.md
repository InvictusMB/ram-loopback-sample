# RAM Stack + LoopBack 4 sample application

This project consists of
* a Node.js [LoopBack 4](https://github.com/strongloop/loopback-next) back-end application strictly typed with TypeScript and 95% test coverage
* a React front-end application with [MobX](https://github.com/mobxjs/mobx) state management, [Awilix DI](https://github.com/jeffijoe/awilix) and [TailwindCSS](https://github.com/tailwindcss/tailwindcss) UI and autowiring of the components via [RAM Stack](https://github.com/InvictusMB/ram-stack/tree/master/packages/ram-composition-root) composition root
* an API explorer as a live documentation of the back-end
* a fully automated, strongly typed, seamless integration between front-end and back-end parts based on [OpenAPI](https://github.com/OpenAPITools/openapi-generator) standard

To run the project the following commands should be used
```bash
npm install
npm start
```
The default browser should open automatically as soon as everything builds and starts
The API documentation is available at `/api`.

Node v10 is expected

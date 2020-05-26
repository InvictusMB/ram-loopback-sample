const shell = require('shelljs');

const prettier = shell.which('prettier');
shell.env['TS_POST_PROCESS_FILE'] = `${prettier} --single-quote --trailing-comma all --no-bracket-spacing --parser typescript --write`
const generator = 'openapi-generator';
shell.exec(generator + ' generate -DdebugModels -i http://localhost:3000/api/explorer/openapi.json -g typescript-fetch --skip-validate-spec -t scripts/openapi/template -c scripts/openapi/config.yaml -o src/openapi --enable-post-process-file > openapi-generator.log')

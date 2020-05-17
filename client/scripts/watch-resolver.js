const fs = require('fs');
const chokidar = require('chokidar');

const updateFile = './src/index.tsx';

const watcher = chokidar.watch([
  './src/**/*.tsx',
  './src/**/*.ts',
], {
  ignored: updateFile,
  persistent: true,
});

watcher.on('ready', () => {
  watcher
    .on('add', path => {
      console.log(`File ${path} has been added`);
      return invalidateCache(updateFile);
    })
    .on('unlink', path => {
      console.log(`File ${path} has been removed`);
      return invalidateCache(updateFile);
    });
});

function invalidateCache(fileName) {
  fs.utimesSync(fileName, new Date(), new Date());
}

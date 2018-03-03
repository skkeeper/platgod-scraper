const pino = require('pino');
const pretty = pino.pretty();
pretty.pipe(process.stdout);
const log = pino({level: 'debug'}, pretty);

module.exports = log;
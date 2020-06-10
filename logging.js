/* eslint-env node */
/* eslint-disable no-console */

module.exports = function (mode) {
  mode = mode && mode.toLowerCase() || 'small';
  switch (mode) {
    case 'none':
      return function (req, res, next) {
        next();
      }
    case 'tiny':
      return function (req, _, next) {
        console.log(`Request for ${req.url}`);
        next();
      }
    case 'small':
      return function (req, _, next) {
        console.log(`${req.headers['x-forwarded-for'] || req.connection.remoteAddress}: ${req.method} request for ${req.url}`)
        next();
      }
    case 'lots':
      return function (req, _, next) {
        console.log(`[${(new Date()).toLocaleString()}] ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}: ${req.method} request for ${req.url}`)
        next();
      }
    case 'tons':
      return function (req, _, next) {
        console.log(`[${(new Date()).toLocaleString()}] ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}: ${req.method} request for ${req.url}`)
        next();
      }
    case 'everything':
      return function (req, res, next) {
        console.log('========req=========')
        console.log(req);
        console.log('========res=========')
        console.log(res);
        next();
      }
    default:
      throw new Error("Impossible?")
  }
}

/* eslint-disable no-undef */
const defaults = require('./config.development');

let BASE = null;
if (SP_SERVER_ENV) {
  BASE = require(`./config.${SP_SERVER_ENV}`);
}
export default Object.assign(defaults, BASE);

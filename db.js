const postgres = require('postgres');

module.exports.sql = postgres({
  types: {
    number: {
      to: 0,
      from: 1700,
      serialize: (x) => `${x}`,
      parse: (x) => +x,
    },
  },
});

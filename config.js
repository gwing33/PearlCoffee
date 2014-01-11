var env = process.env.NODE_ENV || "development";

var settings = {
  production: {
    conn_str: 'mongodb://localhost/pearl'
  },
  staging: {
    conn_str: 'mongodb://localhost/pearl'
  },
  development: {
    conn_str: 'mongodb://localhost/pearl'
  }
};

module.exports.settings = settings[env];
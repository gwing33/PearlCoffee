var env = process.env.NODE_ENV || "development";

var settings = {
  production: {
    conn_str: 'mongodb://admin:' + process.env.MONGODB_PW + '@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/prod'
  },
  staging: {
    conn_str: 'mongodb://admin:' + process.env.MONGODB_PW + '@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/dev'
  },
  development: {
    conn_str: 'mongodb://localhost/pearl'
  }
};

module.exports.settings = settings[env];
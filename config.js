var env = process.env.NODE_ENV || "development";

var settings = {
  production: {
    conn_str: 'mongodb://admin:iNpCfTwZXBTZ@$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/dev'
  },
  staging: {
    conn_str: 'mongodb://admin:iNpCfTwZXBTZ@$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/dev'
  },
  development: {
    conn_str: 'mongodb://localhost/pearl'
  }
};

module.exports.settings = settings[env];
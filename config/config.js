var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

var config = {
    root: rootPath,
    app: {
      name: 'mamahomepage'
    },
    db: 'mongodb://localhost/alenatomasek'
};

module.exports = config;

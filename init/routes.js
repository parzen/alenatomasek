module.exports = function(app) {

  //home route
  var home = require('../app/controllers/home');

  app.get('/', home.index);
  app.get('/home', home.index);
  app.get('/biografie', home.biografie);
  app.get('/impressum', home.impressum);
}

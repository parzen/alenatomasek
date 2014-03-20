module.exports = function(app) {

  //home route
  var home = require('../app/controllers/home');

  app.get('/', home.index);
  app.get('/home', home.index);
  app.get('/malerei', home.malerei);
  app.get('/grafik', home.grafik);
  app.get('/keramik', home.keramik);
  app.get('/biografie', home.biografie);
  app.get('/impressum', home.impressum);
}

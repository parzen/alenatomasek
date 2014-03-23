var express = require('express');

module.exports = function(app, config, User) {
    app.configure(function() {
        app.use(express.compress());
        app.use(express.static(config.root + '/public'));
        app.set('views', config.root + '/app/views');
        app.set('view engine', 'jade');
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session({ secret: 'my secret' }));
        app.use(function (req, res, next) {
          if (req.session.loggedIn) {
            res.locals.authenticated = true;
            User.findById(req.session.loggedIn, function (err, doc) {
              if (err) return next(err);
              res.locals.me = doc;
              //console.log("Ist authenticated")
              next();
            });
          } else {
            res.locals.authenticated = false;

            // JUST FOR DEBUGGING
            res.locals.authenticated = true;
            res.locals.me = 'blaa';
            // JUST FOR DEBUGGING


            next();
          }
        });
        app.use(app.router);
        app.use(function(req, res) {
            res.status(404).render('404', {
                title: '404'
            });
        });
    });
};
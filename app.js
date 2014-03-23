var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var express   = require("express");
var app       = express();
var config    = require('./config/config');
var mongoose  = require('mongoose');
var server    = require('http').createServer(app);
var helper    = require('./app/controllers/helper');
var fs        = require('fs');
var ipPort    = "http://" + ipaddress + ":" + port;

/**
* Define model.
*/
var Schema = mongoose.Schema
var User = mongoose.model('User', new Schema({
  name: { 
    type: String, 
    unique: true 
  },
  password: {
   type: String,
   index: true 
 }
}));
var Ausstellung = mongoose.model('Ausstellung', new Schema({
  titel: {
    type: String,
    default: '',
    unique: true
  },
  strasse: {
    type: String,
    default: ''
  },
  plzstadt: {
    type: String,
    default: ''
  },
  homepage: {
    type: String,
    default: ''
  },
  datumVon: {
    type: String,
    default: ''
  },
  datumBis: {
    type: String,
    default: ''
  },
  beteiligung: {
    type: Boolean,
    default: false
  },
  kritik: {
    type: [String]
  },
  bilder: {
    type: [String]
  }
}));


/**
* Database connect
*/
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function() {
  throw new Error('unable to connect to database at ' + config.db);
});

/**
* Init processes
*/
require('./init/express')(app, config, User);
require('./init/routes')(app);

/**
* Authentication middleware.
*/


/**
* Login route
*/
app.get('/login', function (req, res) {
  res.render('login', { signupEmail: '' });
});

app.get('/login/:signupEmail', function (req, res) {
  res.render('login', { signupEmail: req.params.signupEmail });
});

/**
* Logout route.
*/
app.get('/logout', function (req, res) {
  req.session.loggedIn = null;
  res.redirect('/');
});

/**
* Get route
*/
app.get('/ausstellungen', function (req, res) {
  Ausstellung.find({}, function (err, docs) {
    if (err) return next(err);

    docs2 = helper.ausstellungenFormatter(docs);

    res.render('ausstellungen', {
      footerimg: "image/ausstellungen.jpg",
      headerimg: "image/ausstellungen_o.jpg",
      bcblock: "#bfc6b0",
      bcheader: "#9fa97b",
      path: "ausstellungen",
      ausstellungen: docs2,
      inputs: ""
    });
  });
});

/**
* Signup route
*/
app.get('/signup', function (req, res) {
  res.render('signup');
});

/**
* Post routes
*/
app.post('/login', function (req, res) {
  User.findOne({ name: req.body.user.name, password: req.body.user.password},
   function (err, doc) {
    if (err) return next(err);
    if (!doc) return res.render('login', { errortext: 'User oder Passwort ist falsch!' });
    req.session.loggedIn = doc._id.toString();
    res.redirect('/');
  });
});

app.post('/signup', function (req, res, next) {
  var user = new User(req.body.user)
  user.save(function (err) {
    if (err) return next(err);
    res.redirect('/login/' + user.name);
  });
});


app.post('/ausstellungen', function (req, res, next) {
  var errortext = '';
  var error = false;
  var b = req.body.ausstellung;
  if(b.datumVon == '') {
    error = true;
    errortext = "Kein Datum 'Von' angegeben!";
  }
  if(!error && b.datumBis == '') {
    error = true;
    errortext = "Kein Datum 'Bis' angegeben!";
  }
  if(!error && b.titel == '') {
    error = true;
    errortext = "Kein titel angegeben!";
  }
  Ausstellung.find({titel: b.titel}, function (err, titelDoc) {
    if(titelDoc.length > 0) {
      error = true;
      errortext = "Diesen Titel gibt es bereits!";
    }

    console.log("req.files");
    console.log(req.files);


    if(error) {
      Ausstellung.find({}, function (err, docs) {
        if (err) return next(err);

        docs2 = helper.ausstellungenFormatter(docs);

        return res.render('ausstellungen', {
          footerimg: "/image/ausstellungen.jpg",
          headerimg: "/image/ausstellungen_o.jpg",
          bcblock: "#bfc6b0",
          bcheader: "#9fa97b",
          path: "ausstellungen",
          ausstellungen: docs2,
          inputs: b,
          errortext: errortext
        });
      });
    } else {
      b.datumVon = helper.dateFormatter(b.datumVon);
      b.datumBis = helper.dateFormatter(b.datumBis);

      // New Ausstellung opject
      var aus = new Ausstellung(b);

      // Read Kritik
      fs.readFile(req.files.ausstellung.kritik.path, function (err, data) {
        var newPath = __dirname + "/public/uploads/"+req.files.ausstellung.kritik.name;
        console.log("newPath: " + newPath);
        fs.writeFile(newPath, data, function (err) {
          if (req.files.ausstellung.kritik.name != '' && err) throw err;

          if (req.files.ausstellung.kritik.name != '') {
            aus.kritik.push("/uploads/"+req.files.ausstellung.kritik.name);
          }

          // Read Bild
          fs.readFile(req.files.ausstellung.bilder.path, function (err, data) {
            var newPath = __dirname + "/public/uploads/"+req.files.ausstellung.bilder.name;
            console.log("newPath: " + newPath);
            fs.writeFile(newPath, data, function (err) {
              if (req.files.ausstellung.bilder.name != '' && err) throw err;

              if (req.files.ausstellung.bilder.name != '') {
                aus.bilder.push("/uploads/"+req.files.ausstellung.bilder.name); 
              }

              // Write to Database
              console.log("Write New Ausstellung in db:")
              console.log(aus)
              aus.save(function (err) {
                if (err) return next(err);
                res.redirect('/ausstellungen');
              });
            });
          });
        });
      });
    }
  });
});

/**
* Edit routes
*/
app.get("/edit/ausstellung/:id" , function(req,res) {
  Ausstellung.find({ _id: req.params.id }, function (err, docs) {
    console.log(docs[0])
    res.render("ausedit", { 
        footerimg: "/image/ausstellungen.jpg",
        headerimg: "/image/ausstellungen_o.jpg",
        bcblock: "#bfc6b0",
        bcheader: "#9fa97b",
        path: "ausstellungen",
        inputs: docs[0]});
  });
});

/**
* Update routes
*/
app.put("/update/ausstellung/:id", function(req,res) {
  var b = req.body.ausstellung;
  console.log("Update Ausstellung:")
  console.log(b)

  Ausstellung.update(
    { _id: req.params.id},
    { titel: b.titel, 
      strasse: b.strasse,
      plzstadt: b.plzstadt,
      homepage: b.homepage,
      datumVon: b.datumVon,
      datumBis: b.datumBis,
      beteiligung: b.beteiligung
      //,kritik: b.kritik,
      //bilder: b.bilder
      },
    function (err) {
      if(err) console.log(err)
      res.redirect('/ausstellungen');
  });
});
app.put("/new/kritik/ausstellung/:id", function(req,res) {
  console.log(req.files)

  Ausstellung.find({ _id: req.params.id }, function (err, docs) {
    console.log(docs[0])
    
    fs.readFile(req.files.neueKritik.path, function (err, data) {
      var newPath = __dirname + "/public/uploads/"+req.files.neueKritik.name;
      console.log("newPath: " + newPath);
      fs.writeFile(newPath, data, function (err) {
        if (req.files.neueKritik.name != '' && err) throw err;

        if (req.files.neueKritik.name != '') {
          docs[0].kritik.push("/uploads/"+req.files.neueKritik.name);
        }

        console.log("Neue Kritik:")
        console.log(docs[0])
        Ausstellung.update(
          { _id: req.params.id },
          { kritik: docs[0].kritik },
          function (err) {
            if(err) console.log(err)
            res.redirect('/edit/ausstellung/'+req.params.id);
        });
      });
    });
  });
});
app.put("/new/bild/ausstellung/:id", function(req,res) {
  console.log(req.files)

  Ausstellung.find({ _id: req.params.id }, function (err, docs) {
    console.log(docs[0])
    
    fs.readFile(req.files.neuesBild.path, function (err, data) {
      var newPath = __dirname + "/public/uploads/"+req.files.neuesBild.name;
      console.log("newPath: " + newPath);
      fs.writeFile(newPath, data, function (err) {
        if (req.files.neuesBild.name != '' && err) throw err;

        if (req.files.neuesBild.name != '') {
          docs[0].bilder.push("/uploads/"+req.files.neuesBild.name);
        }

        console.log("Neues Bild:")
        console.log(docs[0])
        Ausstellung.update(
          { _id: req.params.id },
          { bilder: docs[0].bilder },
          function (err) {
            if(err) console.log(err)
            res.redirect('/edit/ausstellung/'+req.params.id);
        });
      });
    });
  });
});

/**
* Destroy routes
*/
app.delete("/delete/ausstellung/:id", function(req,res) {
  console.log("Delete Ausstellung:")
  console.log(req.params.id)
  Ausstellung.remove({_id: req.params.id}, function (err) {
    res.redirect('/ausstellungen');
  });
});
app.delete("/delete/kritik/ausstellung/:id/*", function(req,res) {
  console.log("Kritik zu entfernen: " + req.params[0])
  Ausstellung.find({ _id: req.params.id }, function (err, docs) {
    console.log("Kritik davor: " + docs[0])
    var index = docs[0].kritik.indexOf(req.params[0]);
    if (index > -1) {
      docs[0].kritik.splice(index, 1);
    }
    console.log("Kritik danach: " + docs[0])

    Ausstellung.update(
      { _id: req.params.id },
      { kritik: docs[0].kritik },
      function (err) {
        if(err) console.log(err)
          res.redirect('/edit/ausstellung/'+req.params.id);
      });
  });
});
app.delete("/delete/bild/ausstellung/:id/*", function(req,res) {
  console.log("Bild zu entfernen: " + req.params[0])
  Ausstellung.find({ _id: req.params.id }, function (err, docs) {
    console.log("Bild davor: " + docs[0])
    var index = docs[0].bilder.indexOf(req.params[0]);
    if (index > -1) {
      docs[0].bilder.splice(index, 1);
    }
    console.log("Bild danach: " + docs[0])

    Ausstellung.update(
      { _id: req.params.id },
      { bilder: docs[0].bilder },
      function (err) {
        if(err) console.log(err)
          res.redirect('/edit/ausstellung/'+req.params.id);
      });
  });
});


/** 
* Start server
*/
server.listen( port, ipaddress, function() {
  console.log((new Date()) + ' Server is listening on port ' + port);
});
console.log("Listening to " + ipaddress + ":" + port + "...");


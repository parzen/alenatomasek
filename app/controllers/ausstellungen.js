var Ausstellung = require('mongoose').model('Ausstellungen');
var db = require('mongoose');

exports.addAusstellung = function(req, res) {
	var aus = new Ausstellung({
		titel: "Supertitel",
		ort: "Nürnberg",
		datum: "",
		beteiligung: true,
		kritik: "Blafooo",
		bilder: "picurl ist die folgendeeee"
	});
	aus.save((function (err) {
    if (err) return next(err);
    res.redirect('/ausstellungen');
  });
}
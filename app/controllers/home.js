exports.index = function(req, res) {
  res.render('index', {
  	footerimg: "",
  	headerimg: "",
  	bcblock: "#C0C0C0",
  	bcheader: "#C6C7C1",
    path: "index"
  });
};

exports.malerei = function(req, res) {
  res.render('malerei', {
  	footerimg: "/image/malerei.jpg",
  	headerimg: "/image/malerei_o.jpg",
  	bcblock: "#b4b4b4",
  	bcheader: "#808080",
    path: "malerei"
  });
};

exports.grafik = function(req, res) {
  res.render('grafik', {
  	footerimg: "/image/grafik.jpg",
  	headerimg: "/image/grafik_o.jpg",
  	bcblock: "#bea29a",
  	bcheader: "#905f50",
    path: "grafik"
  });
};

exports.keramik = function(req, res) {
  res.render('keramik', {
  	footerimg: "/image/keramik.jpg",
  	headerimg: "/image/keramik_o.jpg",
  	bcblock: "#d1dfdd",
  	bcheader: "#a5bdb9",
    path: "keramik"
  });
};

exports.kurse = function(req, res) {
  res.render('kurse', {
    footerimg: "/image/kurse.jpg",
    headerimg: "/image/kurse_o.jpg",
    bcblock: "#fed8a3",
    bcheader: "#c79550",
    path: "kurse"
  });
};

exports.biografie = function(req, res) {
  res.render('biografie', {
  	footerimg: "/image/biografie.jpg",
  	headerimg: "/image/biografie_o.jpg",
  	bcblock: "#bfcbcd",
  	bcheader: "#9ab7be",
    path: "biografie"
  });
};

exports.impressum = function(req, res) {
  res.render('impressum', {
  	footerimg: "/image/impressum.jpg",
  	headerimg: "/image/impressum_o.jpg",
  	bcblock: "#cc7e7c",
  	bcheader: "#b8544c",
    path: "impressum"
  });
};
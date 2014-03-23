exports.dateFormatter = function(date) {
	var months = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
	// yyyy mm dd
	var datum = date.split('-');
	var datum = datum[2] + ". " + months[parseInt(datum[1])-1] + " " + datum[0];
	return datum;
}

exports.invDateFormatter = function(date) {
	var monthsD = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
	var monthsE = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	var datum = date.split(' ');
	datum[1] = monthsE[monthsD.indexOf('März')];

	var datum = new Date(datum[0] + " " + datum[1] + " " + datum[2]);
	return datum;
}

exports.ausstellungenFormatter = function(docs) {
	for(var i=0; i<docs.length; i++) {
		var Von = docs[i].datumVon;
		var Bis = docs[i].datumBis;
		//console.log("von: " + Von + " Bis: " + Bis)
		var year = parseInt(Von.split(' ')[2]);
		if (year != parseInt(Bis.split(' ')[2]))
			year = year + "/" + parseInt(Bis.split(' ')[2])
		docs[i].year = year;
	}
	return docs;
}
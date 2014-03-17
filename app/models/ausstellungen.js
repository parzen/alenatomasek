var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AusstellungenSchema = new Schema({
  titel: {
    type: String,
    default: '',
    unique: true
  },
  ort: {
    type: String,
    default: ''
  },
  datumVon: {
    type: Date,
    default: ''
  },
  datumBis: {
    type: Date,
    default: ''
  },
  beteiligung: {
    type: Boolean,
    default: false
  },
  kritik: {
    type: String,
    default: ''
  },
  bilder: {
    type: String,
    default: ''
  }
});

mongoose.model('Ausstellungen', AusstellungenSchema);
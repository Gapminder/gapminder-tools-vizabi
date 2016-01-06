var mongoose = require('mongoose');

mongoose.model('Menu', {
  menu_label : {type : String, default: 'Home'},
  caption : {type : String, default: null},
  url : {type : String, default: null},
  children : {type : Object, default: {}}
});
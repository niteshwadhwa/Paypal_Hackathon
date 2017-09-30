
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var index = require('./routes/index');
var users = require('./routes/user');
var clientPDFReader = require('./routes/clientPDFReader');
var adminLogIN = require('./routes/adminLogIN');
var adminOperations = require('./routes/adminOperations');
var careTakerLogIN = require('./routes/careTakerLogIN');
var careTakerLogIN = require('./routes/careTakerLogIN');
var careTakerOperations= require('./routes/careTakerOperations');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', index.index);
app.get('/users', users.users);
app.post('/clientPDFReader',clientPDFReader.clientPDFReader);
app.post('/adminLogIN',adminLogIN.adminLogIN);
app.post('/getCareTakerDetails',adminOperations.getCareTakerDetails);
app.post('/adminFetchAllDocuments',adminOperations.adminFetchAllDocuments);
app.post('/careTakerSubmittedDocuments',adminOperations.careTakerSubmittedDocuments);
app.post('/showRequiredDocument',adminOperations.showRequiredDocument);
app.post('/showSubmittedDocument',adminOperations.showSubmittedDocument);
app.post('/adminhomePage',adminOperations.adminhomePage);
app.post('/send',adminOperations.send);
app.post('/careTakerSignUp',careTakerLogIN.careTakerSignUp);
app.post('/careTakerLogIN',careTakerLogIN.careTakerLogIN);
app.post('/careTakerShowDocument',careTakerOperations.careTakerShowDocument);
app.post('/careTakerHomePage',careTakerOperations.careTakerHomePage);
app.post('/nitesh',careTakerOperations.nitesh);
app.post('/deleteFromTable',careTakerOperations.deleteFromTable);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

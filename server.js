// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var testCalls = require('./routes/test');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

//databse config
MongoClient = require('mongodb').MongoClient; //mongodb
assert = require('assert');                 //something for mongoDB
ObjectId = require('mongodb').ObjectID;     // uid?
dbUrl = 'mongodb://localhost:27017/robot'; // databse url
db = require('mongodb').db;


//init db connection
MongoClient.connect(dbUrl, function(err, result) {
    if (err) {
        throw err;
    } else {
        console.log('Successfully connected to the database');
        db = result //sets the db connection
    }
});



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('req: ' + req);
    console.log('res: ' + res.message);
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
 router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
 });


//add routes here and in the route directory
router.get('/bear', testCalls.bear)
router.get('/bearById/:id', testCalls.bearById)
router.get('/getBears', testCalls.getBears)
router.post('/insert/:id', testCalls.insertBear)


// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

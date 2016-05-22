// PAckeges needed
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var robotCalls = require('./routes/robotControl');


// configure app to use bodyParser()
// Gets the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

//databse config
//MongoClient = require('mongodb').MongoClient; //mongodb
assert = require('assert');                
ObjectId = require('mongodb').ObjectID;     // uid
dbUrl = 'mongodb://localhost:27017/robot'; // databse url
db = require('mongodb').db;


//uncomment to get mongo db working
//init db connection
// MongoClient.connect(dbUrl, function(err, result) {
//     if (err) {
//         throw err;
//     } else {
//         console.log('Successfully connected to the database');
//         db = result //sets the db connection
//     }
// });



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
 router.get('/', function(req, res) {
    res.json({ message: 'Server is running' });
 });


//add routes here and in the route directory
router.post('/start/', robotCalls.start)
router.post('/stop/', robotCalls.stop)
router.get('/weather/', robotCalls.weather)
router.get('/status/', robotCalls.status)




// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

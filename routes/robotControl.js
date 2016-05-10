var syncInterval = 30000;

var weatherApiKey = '92560990856b47ee7dfbba79557d93de'
var http = require('http');
var file = require("fs");
robotIsRunning = false;
var weatherData = "";
var isDone = false;


var startRobot = function () {

    var fileContent =
        "   1.0000000e+00\r\n" +
        "   0.0000000e+00\r\n" +
        "   0.0000000e+00\r\n"
    //start
    //stop
    //is finished

    console.log("Starting Robot...");
    var contents = file.writeFileSync("./var.txt", fileContent);
    console.log(contents);

    console.log(" done ...");
}

var stopRobot = function () {

    var fileContent =
        "   0.0000000e+00\r\n" +
        "   1.0000000e+00\r\n" +
        "   0.0000000e+00\r\n"
    //start
    //stop
    //is finished

    console.log("Stopping Robot...");
    var contents = file.writeFileSync("./var.txt", fileContent);
    console.log(contents);
    console.log(" done ...");
}

var cleaningStatus = function () {
    var dir = "C:\Users\super\Documents\github\UberUltimateRoboWashingMANchine\var.txt"
    var content = file.readFileSync('var.txt', 'utf8');
    //console.log(content.toString());
    //console.log(" done ...");
    contentArray = content.split("\r\n");
    //console.log(contentArray[2]);

    if (contentArray[2] == 1.0000000e+00) {
        isDone = true
        robotIsRunning = false;
        console.log('Done cleaning windows');
    } else if (contentArray[1] == 1.0000000e+00) {
        isDone = false
        robotIsRunning = false;
        console.log('Stopped cleaning windows');
    } else {
        isDone = false
        console.log('Cleaning windows');
        robotIsRunning = true;
    }
}

var safeWeather = function () {

  console.log(getNewWeather())
}

//see when the robot is done cleaning
setInterval(cleaningStatus, syncInterval)
//setInterval(safeWeather, 5000)



//adds a json object to a collection (db)
exports.start = function (req, res) {
    startRobot();
    robotIsRunning = true;
    startRobot();
    res.status(200).json({ msg: "robot started" });
};

exports.stop = function (req, res) {
    stopRobot();
    robotIsRunning = false
    res.status(200).json({ msg: "robot stopped" });
};


exports.status = function (req, res) {
    console.log('robotIsRunning ' + robotIsRunning);
    if (isDone)
        res.status(200).json({ robotIsRunning: robotIsRunning, isDone: isDone });
    else //If user stopped
        res.status(200).json({ robotIsRunning: robotIsRunning, isDone: isDone });
    // res.status(200).json({ msg: robotIsRunning });
    //else the robot is running

};

getNewWeather = function () {

    //waiting 10 minutes between updating weather info ( provide only updates every ten minutes)
    if (weatherData.created_at && weatherData.created_at < weatherData.created_at.getTime() + 10 * 60000) {
        console.log('Loading weather');

    } else {
        //downloading weatherdata
        console.log('Downloading weather');

        http.get(wUrl, function (response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                var jsonObject = JSON.parse(body);
                

                jsonObject.created_at = new Date();
                weatherData = jsonObject;
            });
        });
    }
    return weatherData

}

//openweathermap api adress for getting weather from århus
// aarhus city id 2624647
//api id 92560990856b47ee7dfbba79557d93d

//http://openweathermap.org/Maps?zoom=12&lat=56.153&lon=10.2049&layers=B0FTTFF
// var wUrl = 'http://api.openweathermap.org/data/2.5/weather?id=2172797&units=metric&APPID=92560990856b47ee7dfbba79557d93de'
var wUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=56.153&lon=10.2049&units=metric&APPID=92560990856b47ee7dfbba79557d93de'

exports.weather = function (req, res) {

    //waiting 10 minutes between updating weather info ( provide only updates every ten minutes)
    if (weatherData.created_at && weatherData.created_at < weatherData.created_at.getTime() + 10 * 60000) {
        console.log('Loading weather');

        res.status(200).json(weatherData);
    } else {
        //downloading weatherdata
        console.log('Downloading weather');

        return http.get(wUrl, function (response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                var jsonObject = JSON.parse(body);
                res.status(200).json(jsonObject);

                jsonObject.created_at = new Date();
                weatherData = jsonObject;

                // db.collection('weather').insertOne(jsonObject)
            });
        });
    }

}


//test function
exports.getWeather = function (req, res) {

    // db.collection('weather').find().sort({ $natural: -1 }).limit(1).toArray(function (err, result) {
    //     if (err) {
    //         throw err;
    //     } else {
    //         res.status(200).json(result);
    //         // console.log(result);
    //     }
    // })

    res.status(200).json(weatherData);

}
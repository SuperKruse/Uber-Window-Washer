var syncInterval = 30000;
var maxWindSpeed = 9;
var controlVariables = "C:/Users/super/Dropbox/TVPROB-01/Navigation/ControlVariables.txt";

var weatherApiKey = '92560990856b47ee7dfbba79557d93de'
var http = require('http');
var file = require("fs");
robotIsRunning = false;
var weatherData = "";
var isDone = false;



/**
 * Starting the robot by writing to the communication file
 */
var startRobot = function () {
    //The content of the file \r\n is to make line shift
    var fileContent =
        "   1.0000000e+00\r\n" +
        "   0.0000000e+00\r\n" +
        "   0.0000000e+00\r\n"
    //start
    //stop
    //is finished

    console.log("Starting Robot...");
    //Writting to the file
    var contents = file.writeFileSync(controlVariables, fileContent);
    console.log(contents);

    console.log(" done ...");
}

/**
 * Stopping the robot by writing to the communication file
 */
var stopRobot = function () {

    var fileContent =
        "   0.0000000e+00\r\n" +
        "   1.0000000e+00\r\n" +
        "   0.0000000e+00\r\n"
    //start
    //stop
    //is finished

    console.log("Stopping Robot...");
    var contents = file.writeFileSync(controlVariables, fileContent);
    console.log(contents);
    console.log(" done ...");
}

/**
 * reading the content of the communication file.
 * the file is loaded in and split into an array efter every \r\n and according to what is read 
 * isDone, robotIsRunning is set.
 * isDone == true if the robot is done cleaning the windows or if the robot is back to the start position after the user have stopped it
 * robotIsRunning == true if the robot is in teh progress of cleaning
 */
var cleaningStatus = function () {

    //loading in the communication file
    var content = file.readFileSync(controlVariables, 'utf8');
    //splitting the array
    contentArray = content.split("\r\n");


    // if contentArray[0] == 1 the robot is running
    // if contentArray[1] == 1 the robot is not running
    // if contentArray[2] == 1 the robot is back at start position

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

/**
 * Checking on the weather to see if it is safe to be operating
 */
var safeWeather = function () {

    getNewWeather(); //updates the weather

    //if the weather data exists  if the wind speed is < maxWindSpeed the robot is stopped and returns to start position
    if (weatherData.wind && weatherData.wind.speed) {
        if (weatherData.wind.speed > maxWindSpeed) {
            stopRobot()
            console.log('too much wind');
        }
        console.log('controlling wind speed');

    }
}

//Statring a recurring event 
//Runs cleaningStatus every "syncInterval" 
setInterval(cleaningStatus, syncInterval)
//Runs safeWeather
setInterval(safeWeather, 1 * 60000)

//setInterval(safeWeather, 5000)


/**
 * The start-command called from the rest service
 * calls startRobot();
 * sets robotIsRunning = true;
 * and return 200: robot started
 */
exports.start = function (req, res) {
    startRobot();
    robotIsRunning = true;
    // startRobot();
    res.status(200).json({ msg: "robot started" });
};

/**
 * The stop-command called from the rest service
 * calls stopRobot();
 * sets robotIsRunning = false;
 * and return 200: robot stopped
 */
exports.stop = function (req, res) {
    stopRobot();
    robotIsRunning = false
    res.status(200).json({ msg: "robot stopped" });
};

/**
 * The status-command called from the rest service
 * returns 200 and robotIsRunning, isDone,
 */
exports.status = function (req, res) {
    console.log('robotIsRunning ' + robotIsRunning);
    res.status(200).json({ robotIsRunning: robotIsRunning, isDone: isDone });
};

/**
 * updates weatherData
 * If the last downloaded weather data us older than 10 minutes it downloads new data from openweather
 */
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


//api id 92560990856b47ee7dfbba79557d93d
var wUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=56.153&lon=10.2049&units=metric&APPID=92560990856b47ee7dfbba79557d93de'

/**
 * the weather-command called from the rest service
 * If the last downloaded weather data us older than 10 minutes it downloads new data from openweather
 * and returns 200 and the weather data
 */
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

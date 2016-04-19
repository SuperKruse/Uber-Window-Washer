var weatherApiKey = '92560990856b47ee7dfbba79557d93de'
var http = require('http');
robotIsRunning = false;
var weatherData = "";

//adds a json object to a collection (db)
exports.start = function (req, res) {
    robotIsRunning = true;
    res.status(200).json({ msg: "robot started" });
};

exports.stop = function (req, res) {
    robotIsRunning = false
    res.status(200).json({ msg: "robot stopped" });
};

exports.status = function (req, res) {
    console.log('robotIsRunning ' + robotIsRunning);

    res.status(200).json({ msg: robotIsRunning });
};


//openweathermap api adress for getting weather from århus
// aarhus city id 2624647
//api id 92560990856b47ee7dfbba79557d93d
var wUrl = 'http://api.openweathermap.org/data/2.5/weather?id=2172797&units=metric&APPID=92560990856b47ee7dfbba79557d93de'

exports.weather = function (req, res) {

//waiting 10 minutes between uodating weather info ( provide only updates every ten minutes)
    if (weatherData.created_at && weatherData.created_at < weatherData.created_at.getTime() + 10 * 60000) {
        res.status(200).json(weatherData);
    } else {

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

                db.collection('weather').insertOne(jsonObject)
            });
        });
    }

}


//test function
exports.getWeather = function (req, res) {

    db.collection('weather').find().sort({ $natural: -1 }).limit(1).toArray(function (err, result) {
        if (err) {
            throw err;
        } else {
            res.status(200).json(result);
            // console.log(result);
        }
    })

}
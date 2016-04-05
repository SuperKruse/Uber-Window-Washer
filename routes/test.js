//Returns simple json object
exports.bear = function(req, res) {
    res.json({ message: 'en bjørn' });
};

//returns json object with a parameter (somthing.com/api/bearById/"parameter")
exports.bearById = function(req, res) {
    console.log(req.params.id);

    res.json({ id: req.params.id });
};



//adds a json object to a collection (db)
exports.insertBear = function(req, res) {

        db.collection('bears').insertOne({         
                "name": req.params.id,
                "age": "10075",
                "xp": "1480",
                 "created_at": new Date()
            
        }, function(err, result) {
            
            if (err) {
                throw err;// if error throws an error
            } else {
               res.status(200).json(result);//response ok (200) and the result
            }

        });
    };


//returns a object from a collection
exports.getBears = function(req, res) {

        var contentCollection = db.collection('bears');
        contentCollection.find({}).toArray(function(err, result) {
            if (err) {
                throw err;
            } else {
                res.status(200).json(result);
                // console.log(result);
            }
        });
   

}


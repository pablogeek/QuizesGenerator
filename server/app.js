//Sometimes You need to do this on the terminal

/*
rm -rf node_modules
npm cache clean
npm install
*/

var application_root = __dirname,
    express = require("express"),
    app        = express(),
    path = require("path"),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

// Database

mongoose.connect('mongodb://root:inputboxxp@proximus.modulusmongo.net:27017/aton5yHy');

//Base setup

var Game = require('./model/game.js');
//var User = require('./models/user.js');
//var PetAlert = require('./models/petAlert.js');


// Config

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//var port = process.env.PORT || 8888;        // set our port
//var ipaddr = process.env.OPENSHIFT_NODEJS_IP;
//var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 9000;
var port = 80

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Hey! welcome to quizs!'});   
});

//create alerts

/*router.post('/createalert', function(req,res){
    console.log('call createalert');

    var petAlert = new PetAlert();
    

    var geoParametter = new Array(req.body.latitude, req.body.longitude);
    petAlert.geo = geoParametter;

    petAlert.desc = req.body.desc;
    petAlert.user= req.body.userId;

    petAlert.save(function(err) {
        if (err)
            res.send(500, 'Alert not created');

        else{
            res.json({ message: 'Alert created!' });
        }
        });

});*/


router.post('/level', function(req,res){
    //var query = Game.find();

    //var geo = new Array(req.body.latitude, req.body.longitude);
    //var lonLat = { $geometry :  { type : "Point" , coordinates : geo } ,$maxDistance: req.body.maxdistance};
    Game.random(parseInt(req.body.level),function(err, quote) {
        res.json(quote);
        //req.user.lastQuote = quote._id;
        //req.user.save();
      });

 
    /*query.findOne({'game.level':2}).exec(function(err,venues){
        if (err)
            res.send(500, 'Error #101: '+err);
        else 
            res.json(venues);
        }); */

    
    
    //res.json({message:'okay'});



});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
///app.listen(port,ipaddr);
app.listen(port);
console.log('Magic happens on port ' + port);

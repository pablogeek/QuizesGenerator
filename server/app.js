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

/*var ursa = require("ursa");

var keySizeBits = 1024;
var keyPair = ursa.generatePrivateKey(keySizeBits, 65537);

var pubPem = keyPair.toPublicPem('base64');

var pub = ursa.createPublicKey(pubPem, 'base64');

console.log('first ' +keyPair);*/

// Database

mongoose.connect('mongodb://root:inputboxxp@proximus.modulusmongo.net:27017/aton5yHy');
//mongoose.connect('mongodb://127.0.0.1:27017/local');
//Base setup

var Game = require('./model/game.js');
var Ranking = require('./model/ranking.js');


// Config

/*app.use(function(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
        data += chunk;
    });
    req.on('end', function() {
        req.rawBody = data;
        next();
    });
});*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//var port = process.env.PORT || 8888;        // set our port
//var ipaddr = process.env.OPENSHIFT_NODEJS_IP;
//var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 9000;
var port = 3030

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {

    /*var clearText = "Hola me llamo Pablo"
    var bigText = "";
    for(var i = 0; i < 100; i++){
        bigText += i +" " + clearText + "\n"; 
    }

    //var keySizeBits = 1024;
    //var keyPair = ursa.generatePrivateKey(keySizeBits, 65537);


    var encrypted = encrypt(bigText, keySizeBits/8);
    //console.log(encrypted);

    var decrypted = decrypt(encrypted, keySizeBits/8);
    console.log(decrypted);*/

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

/*router.get('/ranking', function(req,res){
    var query = Ranking.find();
    query.sort([['points', 'descending']]);
    query.limit(100);

    query.exec(function (err, results) {
      if (err) throw err;

      res.json({rankings : results});

    });
    //query.find().sort([['points', 'descending']]).all(function (posts) {
        // do something with the array of posts
        
    //});


});

router.post('/ranking', function(req,res){

    var parseBody = JSON.parse(req.rawBody);
    var points = new Ranking(parseBody);
    console.log(points.playerName);
    

    points.save(function(err) {
        if (err){
            console.log(err);
            res.status(500).send('Error registering the ranking');

        }else{
            res.json({message: 'OK'});
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


function encrypt(clearText, keySizeBytes){
    var buffer = new Buffer(clearText);
    var maxBufferSize = keySizeBytes - 42; //according to ursa documentation
    var bytesDecrypted = 0;
    var encryptedBuffersList = [];

    //loops through all data buffer encrypting piece by piece
    while(bytesDecrypted < buffer.length){
        //calculates next maximun length for temporary buffer and creates it
        var amountToCopy = Math.min(maxBufferSize, buffer.length - bytesDecrypted);
        var tempBuffer = new Buffer(amountToCopy);

        //copies next chunk of data to the temporary buffer
        buffer.copy(tempBuffer, 0, bytesDecrypted, bytesDecrypted + amountToCopy);

        //encrypts and stores current chunk
        var encryptedBuffer = pub.encrypt(tempBuffer);
        encryptedBuffersList.push(encryptedBuffer);

        bytesDecrypted += amountToCopy;
    }

    //concatenates all encrypted buffers and returns the corresponding String
    return Buffer.concat(encryptedBuffersList).toString('base64');
}

function decrypt(encryptedString, keySizeBytes){

    var encryptedBuffer = new Buffer(encryptedString, 'base64');
    var decryptedBuffers = [];

    //if the clear text was encrypted with a key of size N, the encrypted 
    //result is a string formed by the concatenation of strings of N bytes long, 
    //so we can find out how many substrings there are by diving the final result
    //size per N
    var totalBuffers = encryptedBuffer.length / keySizeBytes;

    //decrypts each buffer and stores result buffer in an array
    for(var i = 0 ; i < totalBuffers; i++){
        //copies next buffer chunk to be decrypted in a temp buffer
        var tempBuffer = new Buffer(keySizeBytes);
        encryptedBuffer.copy(tempBuffer, 0, i*keySizeBytes, (i+1)*keySizeBytes);
        //decrypts and stores current chunk
        var decryptedBuffer = keyPair.decrypt(tempBuffer);
        decryptedBuffers.push(decryptedBuffer);
    }

    //concatenates all decrypted buffers and returns the corresponding String
    return Buffer.concat(decryptedBuffers).toString();
}


// more routes for our API will happen here

app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('/home/myName/allMyMedia/'));


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
///app.listen(port,ipaddr);
app.listen(port);
console.log('Magic happens on port ' + port);

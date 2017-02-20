var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var jade = require('jade');
var http = require('http');
var server = http.createServer(app);
var Twit = require('twit');
var io = require('socket.io').listen(server);
var path = require('path');

var keys = require('./keys');
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var visitorsData = {};

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser());

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});
app.get('/config', function (req, res) {
    res.sendFile(__dirname + "/views/config.html");
});
app.get('/dashboard', function (req, res) {
    res.sendFile(__dirname + "/views/analytics.html");
});
var error = false;
try {
    var T = new Twit({
        consumer_key: keys.consumer_key,
        consumer_secret: keys.consumer_secret,
        access_token: keys.access_token,
        access_token_secret: keys.access_token_secret,
    });
} catch (e) {
    console.log(e.message);
    error = true;
}


io.sockets.on('connection', function (socket) {
    console.log('Socket.io connected');

    socket.on('hash', function (hash) {
        if (!error) { 
            var streamHash = hash.hash;//, locations: '-51.92528,-14.235004'
            var stream = T.stream('statuses/filter', { track: streamHash });

            stream.on('tweet', function (tweet) {
                console.log('tweeted');
                io.sockets.emit('stream', { text: tweet.text, name: tweet.user.name, username: tweet.user.screen_name, icon: tweet.user.profile_image_url, hash: streamHash });
            });

            socket.on('stoptwit', function (socket) {
                console.log('stop called');
                stream.stop();
            });

        }
    });

    //For analytics on real-time.
    socket.on('visitor-data', function (data) {
        visitorsData[socket.id] = data;
        io.emit('updated-stats', visitorsData);
        console.log('stas is updated');
    });

    socket.on('disconnect', function () {
        delete visitorsData[socket.id];
        io.emit('updated-stats', visitorsData);
        console.log('disconnected id: ' + socket.id);
    });
});

server.listen(port, ip);
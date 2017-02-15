var app = angular.module('twitterBricks', []);

app.controller("BricksController", function ($scope) {
    $scope.buttonStartStopText = "Stop";
    $scope.hash = '';
    var url = "http://nodejs-project122.44fs.preview.openshiftapps.com/";
    //var url = "http://localhost:5000";
    var socket = io.connect(url);

    function init() {
        socket.on("stream", function (tweet) {
            $("#thewall").prepend('<li class="tweetli"><a href="http://www.twitter.com/'+tweet.username+'" target="_blank"><img src="' + tweet.icon + '" alt="" /></a><div class="name">' + tweet.name + ' (@' + tweet.username + ')</div><div class="message">' + tweet.text + '</div></li>');
            //$(".list").html(tweet.hash);
            $scope.hash = tweet.hash;

            var colors = ["#3F602B", "#77896C", "#008B8B", "#528B8B", "#567E3A", "#55AE3A", "#458B74", "#174038", "#20BF9F", "#01C5BB", "#457371", "#78AB46", "#FF4040", "#EE5C42", "#CD3700", "#29242", "#B87333", "#8B795E"];
            var rand = Math.floor(Math.random() * colors.length);
            $("li:first-child").css("background-color", colors[rand]);
        });
    }

    $scope.clickStartStop = function () {
        if ($scope.buttonStartStopText == "Start") {
            socket.emit("hash", {
                hash: $scope.hashTag
            });
            $scope.buttonStartStopText = "Stop";
        }
        else {
            socket.removeAllListeners("stream");
            $scope.buttonStartStopText = "Start";
        }
    }

    init();
});
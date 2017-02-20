var app = angular.module("AnalyticsRealTime", []);

app.factory('socket', function ($rootScope) {
    var url = "http://nodejs-project122.44fs.preview.openshiftapps.com/";
    //var url = "http://localhost:5000";
    var socket = io.connect(url);

    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

app.controller("DashboardController", function ($scope, socket) {
    $scope.data = {};


    socket.on('updated-stats', function (data) {
        $scope.count = Object.keys(data).length;
        $scope.data = data;
    });
});

/* geo structure
        $('#country').html(location.country_name);
        $('#state').html(location.state);
        $('#city').html(location.city);
        $('#latitude').html(location.latitude);
        $('#longitude').html(location.longitude);
        $('#ip').html(location.IPv4);
*/


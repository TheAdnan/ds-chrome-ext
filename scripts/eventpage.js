"use strict";

//Setting initial/default settings values 
if (localStorage.getItem('locationIndex') === null) {
    localStorage.setItem('locationIndex', '-1');
}

if (localStorage.getItem('notificationTime') === null) {
    localStorage.setItem('notificationTime', '15');
}

if (localStorage.getItem('jumuahNotificationTime') === null) {
    localStorage.setItem('jumuahNotificationTime', '35');
}

if (localStorage.getItem('showNotifications') === null) {
    localStorage.setItem('showNotifications', 'true');
}

if (localStorage.getItem('dhuhrStandardTime') === null) {
    localStorage.setItem('dhuhrStandardTime', 'true');
}

var placeIndex = localStorage.getItem('locationIndex');
if (placeIndex !== '-1') {
    getSalahTimes(placeIndex);
}

function getSalahTimes(placeIndex) {

    var apiEndpoint = 'http://207.154.194.134:8090/times/';

    var deferred = $.Deferred();
    var promise = deferred.promise();


    $.getJSON(apiEndpoint + placeIndex, function (data) {

        var dhuhrStandardTime = JSON.parse(localStorage.getItem("dhuhrStandardTime"));

        var salahTimes = data;

        if (dhuhrStandardTime) {

            var hoursMinutes = salahTimes.dhuhr.split(':')

            if (hoursMinutes[0] === '11')
                salahTimes.dhuhr = "12:00";
            else
                salahTimes.dhuhr = "13:00";

            localStorage.setItem("salahTimes", JSON.stringify(salahTimes));
            deferred.resolve(salahTimes);
        }
        else {
            localStorage.setItem("salahTimes", JSON.stringify(salahTimes));
            deferred.resolve(salahTimes);
        }
    })
        .error(function () {
            alert("Problem sa konekcijom...")
        })

    return promise;
}
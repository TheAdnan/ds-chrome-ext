"use strict";

var d = new Date();

//Setting initial/default settings values 
if (localStorage.getItem('locationIndex') == null) {
    localStorage.setItem('locationIndex', '-1');
}

if (localStorage.getItem('notificationTime') == null) {
    localStorage.setItem('notificationTime', '15');
}

if (localStorage.getItem('jumuahNotificationTime') == null) {
    localStorage.setItem('jumuahNotificationTime', '35');
}

if (localStorage.getItem('showNotifications') == null) {
    localStorage.setItem('showNotifications', 'true');
}

if (localStorage.getItem('dhuhrStandardTime') == null) {
    localStorage.setItem('dhuhrStandardTime', 'true');
}

// var notificationSound = new Audio("office-2.ogg");

// var formatter = new Intl.DateTimeFormat("bs-BA-u-ca-islamic");

var placeIndex = localStorage.getItem('locationIndex');
if (placeIndex != '-1') {
    getSalahTimes(placeIndex);
}


chrome.alarms.onAlarm.addListener(function (alarm) {
    //If the difference between Date.now() and alarm.scheduledTime is greater than 1000
    //that means that Chrome window was in a state in which alarmListener() could not been fired (either PC went to sleep, or Chrome was closed)
    if ((Date.now() - alarm.scheduledTime) < 1000) {
        showSalahNotification(alarm.name);
        notificationSound.play();
    }
});

//----------------------------------------------------------------------------------------
//HELPER FUNCTIONS------------------------------------------------------------------------
//----------------------------------------------------------------------------------------

function getSalahTimes(placeIndex) {

    var apiEndpont = 'http://207.154.194.134:8090/times/';

    var deferred = $.Deferred();
    var promise = deferred.promise();


    $.getJSON(apiEndpont + placeIndex, function (data) {

        var dhuhrStandardTime = JSON.parse(localStorage.getItem("dhuhrStandardTime"));

        var salahTimes = data;

        if (dhuhrStandardTime) {
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


// function alarmListener(alarm) {

//     console.log("Date.now() - alarm.scheduledTime = ", (Date.now() - alarm.scheduledTime));
//     console.log("onAlarm " + alarm.scheduledTime + " == " + Date.now() + " --- ", (alarm.scheduledTime == Date.now()));
//     console.log("onAlarm " + alarm.scheduledTime + " > " + Date.now() + " --- ", (alarm.scheduledTime > Date.now()));
//     console.log("onAlarm " + alarm.scheduledTime + " < " + Date.now() + " --- ", (alarm.scheduledTime < Date.now()));

//     //If the difference between Date.now() and alarm.scheduledTime is greater than 1000
//     //that means that Chrome window was in a state in which alarmListener() could not been fired (either PC went to sleep, or Chrome was closed)
//     if ((Date.now() - alarm.scheduledTime) < 1000) {
//         showSalahNotification(alarm.name);
//         notificationSound.play();
//         console.log("****** GOT AN ALALRM", alarm);
//         console.log("****** " + alarm.name + " je zakazan za " + new Date(alarm.scheduledTime));
//         // alert(alarm.name + " je zakazan za " + new Date(alarm.scheduledTime) + "\n\n" + "onAlarm listener se okinuo u " + new Date());
//     }
// }

//Fires the chrome notification
function showSalahNotification(salah) {
    var notificationTime = JSON.parse(localStorage.getItem("notificationTime"));
    var message;

    switch (salah) {
        case "fajr":
            message = notificationTime + " minuta do zore!"
            break;
        case "sunrise":
            message = notificationTime + " minuta do izlaska sunca!"
            break;
        case "dhuhr":
            message = notificationTime + " minuta do podne namaza!"
            break;
        case "asr":
            message = notificationTime + " minuta do ikindije namaza!"
            break;
        case "maghrib":
            message = notificationTime + " minuta do akšam namaza!"
            break;
        case "isha":
            message = notificationTime + " minuta do jacije namaza!"
            break;
    }

    var notificationOptions = {
        type: "basic",
        title: "Dnevna Vaktija",
        message: message,
        iconUrl: "img/icon.png"
    }

    chrome.notifications.create(notificationOptions, function () {
        // console.log(Date() + "- Kreirana notifikacija za " + salah);
    });
}

//Creates chrome.alarms for all of the salah times
function createAlarms(salahTimes) {
    console.log("createAlarms() ----- CREATED ALARMS", salahTimes)

    var notificationTime = JSON.parse(localStorage.getItem("notificationTime"));
    var jumahNotificationTime = JSON.parse(localStorage.getItem("jumuahNotificationTime"));

    var dateNow = new Date();

    var dateNowZeroHours = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), 0, 0, 0, 0);

    //String representation of the time at the moment the script is loaded
    var timeNow = dateNow.getHours().toString() + ":" + dateNow.getMinutes().toString();
    var timeNowInMiliseconds = timeToMiliseconds(timeNow);

    var fajrInMiliseconds = timeToMiliseconds(salahTimes.zora);
    var sunriseInMiliseconds = timeToMiliseconds(salahTimes.izlazakSunca);
    var dhuhrInMiliseconds = timeToMiliseconds(salahTimes.podne);
    var asrInMiliseconds = timeToMiliseconds(salahTimes.ikindija);
    var maghribInMiliseconds = timeToMiliseconds(salahTimes.aksam);
    var ishaInMiliseconds = timeToMiliseconds(salahTimes.jacija);

    console.log("FAJR TIME    ++++++++++++ ", new Date(dateNowZeroHours.getTime() + fajrInMiliseconds));
    console.log("SUNRISE TIME ++++++++++++ ", new Date(dateNowZeroHours.getTime() + sunriseInMiliseconds));
    console.log("DHUHR TIME   ++++++++++++ ", new Date(dateNowZeroHours.getTime() + dhuhrInMiliseconds));
    console.log("ASR TIME     ++++++++++++ ", new Date(dateNowZeroHours.getTime() + asrInMiliseconds));
    console.log("MAGHRIB TIME ++++++++++++ ", new Date(dateNowZeroHours.getTime() + maghribInMiliseconds));
    console.log("ISHA TIME    ++++++++++++ ", new Date(dateNowZeroHours.getTime() + ishaInMiliseconds));
    console.log("TIME NOWW MS ++++++++++++ ", new Date(dateNowZeroHours.getTime() + timeNowInMiliseconds));
    console.log("IKINDIJA ALARM+++++++++++ ", new Date((dateNowZeroHours.getTime() + asrInMiliseconds) - (notificationTime * 60000)));
    console.log("IKINDIJA ALARM U MS +++++ ", (dateNowZeroHours.getTime() + asrInMiliseconds) - (notificationTime * 60000));

    //Creating chrome.alarms for every salah prayer

    if (fajrInMiliseconds > timeNowInMiliseconds) {
        if (((dateNowZeroHours.getTime() + fajrInMiliseconds) - (notificationTime * 60000)) > Date.now()) {
            chrome.alarms.create("fajr", {
                when: (dateNowZeroHours.getTime() + fajrInMiliseconds) - (notificationTime * 60000),
            });
        }
    }

    if (sunriseInMiliseconds > timeNowInMiliseconds) {

        if (((dateNowZeroHours.getTime() + sunriseInMiliseconds) - (notificationTime * 60000)) > Date.now()) {
            chrome.alarms.create("sunrise", {
                when: (dateNowZeroHours.getTime() + sunriseInMiliseconds) - (notificationTime * 60000),
            });
        }
    }

    if (dhuhrInMiliseconds > timeNowInMiliseconds) {
        //Checking to see if it is Friday
        if (dateNow.getDay() == 5) {
            if (((dateNowZeroHours.getTime() + dhuhrInMiliseconds) - (jumahNotificationTime * 60000)) > Date.now()) {
                chrome.alarms.create("dhuhr", {
                    when: (dateNowZeroHours.getTime() + dhuhrInMiliseconds) - (jumahNotificationTime * 60000),
                });
            }
        } else {
            if (((dateNowZeroHours.getTime() + dhuhrInMiliseconds) - (notificationTime * 60000)) > Date.now()) {
                chrome.alarms.create("dhuhr", {
                    when: (dateNowZeroHours.getTime() + dhuhrInMiliseconds) - (notificationTime * 60000),
                });
            }
        }
    }

    if (asrInMiliseconds > timeNowInMiliseconds) {
        if (((dateNowZeroHours.getTime() + asrInMiliseconds) - (notificationTime * 60000)) > Date.now()) {
            chrome.alarms.create("asr", {
                when: (dateNowZeroHours.getTime() + asrInMiliseconds) - (notificationTime * 60000),
            });
        }
    }

    if (maghribInMiliseconds > timeNowInMiliseconds) {
        if (((dateNowZeroHours.getTime() + maghribInMiliseconds) - (notificationTime * 60000)) > Date.now()) {
            chrome.alarms.create("maghrib", {
                when: (dateNowZeroHours.getTime() + maghribInMiliseconds) - (notificationTime * 60000),
            });
        }
    }

    if (ishaInMiliseconds > timeNowInMiliseconds) {
        if (((dateNowZeroHours.getTime() + ishaInMiliseconds) - (notificationTime * 60000)) > Date.now()) {
            chrome.alarms.create("isha", {
                when: (dateNowZeroHours.getTime() + ishaInMiliseconds) - (notificationTime * 60000),
            });
        }
    }
}

//Converts string representation if time (hours and minutes) to miliseconds
function timeToMiliseconds(time) {
    var hoursAndMinutes = time.split(":");
    var hours = hoursAndMinutes[0];
    var minutes = hoursAndMinutes[1];

    return (hours * 3600000) + (minutes * 60000);
}

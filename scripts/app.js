"use strict";

generatePlacesSelectList();

var dhuhrTimeSettingChanged = false;

var date = new Date();

$(document).ready(function () {

    $(".spinner-wrapper").hide();

    if (localStorage.getItem("locationIndex") !== '-1') {
        $('.initial-loaction-selection').hide();
        displaySalahTimes(localStorage.getItem("locationIndex"), false, false);

        app.init();
    }
    else {
        $('.initial-loaction-selection').show();

        $("#initial-locations").on("change", function () {
            var locationIndex = $('#initial-locations').val();
            localStorage.setItem('locationIndex', locationIndex);

            displaySalahTimes(locationIndex, true, true);
        })
    }

});

var app = {
    init: function () {
        this.date();
        this.feedback();
        this.sharingButtons();
        this.settingsScreen();
        this.dhuhrTimeSetting();
    },
    date: function () {
        var monthNames = [
            "Januar", "Februar", "Mart",
            "April", "Maj", "Juni", "Juli",
            "August", "Septembar", "Oktobar",
            "Novembar", "Decembar"
        ];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        $('.date p').text(day + ". " + monthNames[monthIndex] + " " + year + ".");
    },
    settingsScreen: function () {
        $(".fa.fa-times").hide();

        //This is current location index if there is no new selection
        var newLocationIndex = localStorage.getItem('locationIndex');

        $('#locations-list').val(localStorage.getItem('locationIndex'));
        $('#locations-list').on('change', function () {

            newLocationIndex = $('#locations-list').val();
            //localStorage.setItem('locationIndex', newLocationIndex);
        });

        $("#settings-button").click(function () {


            if ($(".settings-screen").css("top") == "500px") { //Slide down settings screen
                $(".settings-screen").animate({
                    top: "0px"
                }, 170);
                $(".settings-screen-overlay").animate({
                    top: "0px"
                }, 170);
                $(".settings-screen-bg").animate({
                    top: "0px"
                }, 170);
                $(".fa.fa-cog").hide(170);
                $(".fa.fa-times").show(170);
            } else {

                if (dhuhrTimeSettingChanged) {
                    dhuhrTimeSettingChanged = false;
                    displaySalahTimes(newLocationIndex, true, false);
                }

                if (localStorage.getItem('locationIndex') != newLocationIndex) {
                    localStorage.setItem('locationIndex', newLocationIndex);
                    displaySalahTimes(newLocationIndex, true, false);
                }

                $(".settings-screen").animate({
                    top: "500px"
                }, 170);

                $(".settings-screen-overlay").animate({
                    top: "500px"
                }, 170);

                $(".settings-screen-bg").animate({
                    top: "500px"
                }, 170);

                $(".fa.fa-cog").show(170);
                $(".fa.fa-times").hide(170);
            }
        });
    },
    feedback: function () {
        $(".feedback").on("click", function () {
            var url = "mailto:inel.a.pandzic@gmail.com";
            chrome.tabs.create({
                url: url
            });
        });
    },
    sharingButtons: function () {
        $(".fa.fa-facebook-square").on("click", function () {
            var url = "https://www.facebook.com/sharer/sharer.php?u=https%3A//chrome.google.com/webstore/detail/dnevna-vaktija-bih/hiinlfchblibgjbfpkppokkfkgofgjjn";
            chrome.tabs.create({
                url: url
            });
        });

        $(".fa.fa-twitter-square").on("click", function () {
            var url = "https://chrome.google.com/webstore/detail/dnevna-vaktija-bih/hiinlfchblibgjbfpkppokkfkgofgjjn";
            chrome.tabs.create({
                url: url
            });
        });

        $(".fa.fa-google-plus-square").on("click", function () {
            var url = "https://plus.google.com/share?url=https%3A//chrome.google.com/webstore/detail/dnevna-vaktija-bih/hiinlfchblibgjbfpkppokkfkgofgjjn";
            chrome.tabs.create({
                url: url
            });
        });
    },
    dhuhrTimeSetting: function () {

        var dhuhrStandardTime = localStorage.getItem("dhuhrStandardTime");
        if (dhuhrStandardTime == 'true') {
            localStorage.setItem("dhuhrStandardTime", "true");
            $("#dhuhr-time").attr("checked", "checked");
        } else {
            $("#dhuhr-time").removeAttr("checked");
            localStorage.setItem("dhuhrStandardTime", "false");
        }

        $("#dhuhr-time").on("change", function () {
            if ($("#dhuhr-time").is(':checked')) {
                dhuhrTimeSettingChanged = true;
                localStorage.setItem("dhuhrStandardTime", "true");
            } else {
                dhuhrTimeSettingChanged = true;
                localStorage.setItem("dhuhrStandardTime", "false");
            }
        });
    },
    spinner: function () {
        var opts = {
            lines: 13 // The number of lines to draw
            , length: 24 // The length of each line
            , width: 8 // The line thickness
            , radius: 30 // The radius of the inner circle
            , scale: 0.25 // Scales overall size of the spinner
            , corners: 1 // Corner roundness (0..1)
            , color: '#000' // #rgb or #rrggbb or array of colors
            , opacity: 0.25 // Opacity of the lines
            , rotate: 0 // The rotation offset
            , direction: 1 // 1: clockwise, -1: counterclockwise
            , speed: 1 // Rounds per second
            , trail: 60 // Afterglow percentage
            , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
            , zIndex: 2e9 // The z-index (defaults to 2000000000)
            , className: 'spinner' // The CSS class to assign to the spinner
            , top: '50%' // Top position relative to parent
            , left: '50%' // Left position relative to parent
            , shadow: false // Whether to render a shadow
            , hwaccel: false // Whether to use hardware acceleration
            , position: 'absolute' // Element positioning
        }

        var spinner = new Spinner(opts);
        return spinner;
    }
}

//Gets the salah time from localstorage and writes them in popup.html
function displaySalahTimes(locationIndex, isLocationChanged, initialLocationSelection) {

    $(".spinner-wrapper").show();
    app.spinner().spin(document.getElementById('spinner'))


    getSalahTimes(locationIndex, isLocationChanged).then(function (result) {

        var salahTimes = result;

        if (initialLocationSelection) {
            app.init();
            $('.initial-loaction-selection').hide();

        }

        $("#fajr").html(salahTimes.fajr);
        $("#sunrise").html(salahTimes.sunrise);
        $("#dhuhr").html(salahTimes.dhuhr);
        $("#asr").html(salahTimes.asr);
        $("#maghrib").html(salahTimes.maghrib);
        $("#isha").html(salahTimes.isha);

        app.spinner().stop();
        $(".spinner-wrapper").hide();


        displaySalahDetails(salahTimes);

    });
}

//Shows salah details (Countdown and next-salah message)
function displaySalahDetails(salahTimes) {

    var salahDetails = getSalahDetails(salahTimes);

    var midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 0)

    var finalDate = dateFomater() + ' ' + salahDetails.nextSalahTime;

    if (salahDetails.name == "isha") {
        if (Date.now() < midnight.getTime()) {
            finalDate = dateFomater(true) + ' ' + salahDetails.nextSalahTime;
        } else {
            finalDate = dateFomater() + ' ' + salahDetails.nextSalahTime;
        }
    }

    $("#next-salah").text(salahDetails.message);
    $(".salah-details").css("background-color", salahDetails.bgColor);

    $("#salah-countdown").countdown(finalDate, function (event) {
        $(this).text(event.strftime('%H:%M:%S'));
    });

}

function getSalahTimes(locationIndex, isLocationChanged) {

    var deferred = $.Deferred();

    //isLocationChanged = (typeof isLocationChanged !== 'undefined') ? isLocationChanged : false;

    var salahTimes = JSON.parse(localStorage.getItem("salahTimes"));


    if ((salahTimes != null && salahTimes.day != date.getDate()) || isLocationChanged) {
        chrome.runtime.getBackgroundPage(function (backgroundPage) {
            backgroundPage.getSalahTimes(locationIndex).then(function (result) {
                deferred.resolve(result)
            });
        });

    } else {
        deferred.resolve(salahTimes);
    }

    return deferred.promise();
}

//Gets the details of the current salah
function getSalahDetails(salahTimes) {

    var salah = {};

    var currentTime = date.getHours().toString() + ":" + date.getMinutes().toString();
    var referanceDate = '08/13/2015';

    var isSunrise = Date.parse(referanceDate + " " + currentTime) > Date.parse(referanceDate + " " + salahTimes.sunrise) &&
        Date.parse(referanceDate + " " + currentTime) < Date.parse(referanceDate + " " + salahTimes.dhuhr);

    var isDhuhr = Date.parse(referanceDate + " " + currentTime) > Date.parse(referanceDate + " " + salahTimes.dhuhr) &&
        Date.parse(referanceDate + " " + currentTime) < Date.parse(referanceDate + " " + salahTimes.asr);

    var isAsr = Date.parse(referanceDate + " " + currentTime) > Date.parse(referanceDate + " " + salahTimes.asr) &&
        Date.parse(referanceDate + " " + currentTime) < Date.parse(referanceDate + " " + salahTimes.maghrib);

    var isMaghrib = Date.parse(referanceDate + " " + currentTime) > Date.parse(referanceDate + " " + salahTimes.maghrib) &&
        Date.parse(referanceDate + " " + currentTime) < Date.parse(referanceDate + " " + salahTimes.isha);

    var isIsha = (Date.parse(referanceDate + " " + currentTime) > Date.parse(referanceDate + " " + salahTimes.isha) &&
        Date.parse(referanceDate + " " + currentTime) < Date.parse(referanceDate + " 23:59")) ||
        (Date.parse("08/14/2015 " + currentTime) > Date.parse(referanceDate + " 00:01") &&
        Date.parse(referanceDate + " " + currentTime) < Date.parse(referanceDate + " " + salahTimes.fajr));

    //Checking between which two salah times is the currentTime, than the first one is the current salah
    if (isSunrise) {
        salah.name = "sunrise";
        salah.currentSalahTime = salahTimes.sunrise;
        salah.nextSalahTime = salahTimes.dhuhr;
        salah.message = 'preostalo do dhuhr namaza';
        salah.bgColor = '#DE7B6C';
    } else if (isDhuhr) {
        salah.name = "dhuhr";
        salah.currentSalahTime = salahTimes.dhuhr;
        salah.nextSalahTime = salahTimes.asr;
        salah.message = 'preostalo do ikindije namaza';
        salah.bgColor = '#DE676F';
    } else if (isAsr) {
        salah.name = "asr";
        salah.currentSalahTime = salahTimes.asr;
        salah.nextSalahTime = salahTimes.maghrib;
        salah.message = 'preostalo do akšam namaza';
        salah.bgColor = '#B1637B';
    } else if (isMaghrib) {
        salah.name = "maghrib";
        salah.currentSalahTime = salahTimes.maghrib;
        salah.nextSalahTime = salahTimes.isha;
        salah.message = 'preostalo do jacije namaza';
        salah.bgColor = '#675673';
    } else if (isIsha) {
        salah.name = "isha";
        salah.currentSalahTime = salahTimes.isha;
        salah.nextSalahTime = salahTimes.fajr;
        salah.message = 'preostalo za jaciju namaz';
        salah.bgColor = '#3C5A73';
    } else {
        salah.name = "fajr";
        salah.currentSalahTime = salahTimes.fajr;
        salah.nextSalahTime = salahTimes.sunrise;
        salah.message = 'preostalo do izlaska sunca';
        salah.bgColor = '#E6A184';
    }

    return salah;
}

//Generates locations select list
function generatePlacesSelectList() {

    var locations = ["Banovići", "Banja Luka", "Bihać", "Bijeljina", "Bileća", "Bos.Brod", "Bos.Dubica", "Bos.Gradiška", "Bos.Grahovo", "Bos.Krupa", "Bos.Novi", "Bos.Petrovac", "Bos.Šamac", "Bratunac", "Brčko", "Breza", "Bugojno", "Busovača", "Bužim", "Cazin", "Čajniče", "Čapljina", "Čelić", "Čelinac", "Čitluk", "Derventa", "Doboj", "Donji Vakuf", "Drvar", "Foča", "Fojnica", "Gacko", "Glamoč", "Goražde", "Gornji Vakuf", "Gračanica", "Gradačac", "Grude", "Hadžići", "Han-Pijesak", "Ilijaš", "Jablanica", "Jajce", "Kakanj", "Kalesija", "Kalinovik", "Kiseljak", "Kladanj", "Ključ", "Konjic", "Kotor-Varoš", "Kreševo", "Kupres", "Laktaši", "Livno", "Lopare", "Lukavac", "Ljubinje", "Ljubuški", "Maglaj", "Modriča", "Mostar", "Mrkonjić-Grad", "Neum", "Nevesinje", "Novi Travnik", "Odžak", "Olovo", "Orašje", "Pale", "Posušje", "Prijedor", "Prnjavor", "Prozor", "Rogatica", "Rudo", "Sanski Most", "Sarajevo", "Skender-Vakuf", "Sokolac", "Srbac", "Srebrenica", "Srebrenik", "Stolac", "Šekovići", "Šipovo", "Široki Brijeg", "Teslić", "Tešanj", "Tomislav-Grad", "Travnik", "Trebinje", "Trnovo", "Tuzla", "Ugljevik", "Vareš", "V.Kladuša", "Visoko", "Višegrad", "Vitez", "Vlasenica", "Zavidovići", "Zenica", "Zvornik", "Žepa", "Žepče", "Živinice"];

    var locationList = $('#locations-list');
    var initialLocationList = $('#initial-locations');

    for (var i = 0; i < locations.length; i++) {
        initialLocationList.append('<option value="' + i.toString() + '">' + locations[i] + '</option>');
        locationList.append('<option value="' + i.toString() + '">' + locations[i] + '</option>');
    }
}

//Formates date to "yyyy-mm-dd"
function dateFomater(isIsha) {
    var d = date;

    if (isIsha) {
        d = new Date(date.getTime() + 86400000);
    }

    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = d.getDate().toString();

    if (mm < 10) {
        mm = '0' + mm;
    }

    return yyyy + '-' + mm + '-' + dd;
}

var settings = {
    sequence: [],
    round: 0,
    playNumber: 0,
    speed: 1000,
    clicked: 0

}


$(document).ready(function() {
    var audio = $("#sound");

    function animate(divid) {


        // Increase round speed.
        if (settings.round > 5) {
            settings.speed = 500
        }

        if (divid == "a") {
            $("#a").css("border-color", "#1aff00");
            $("#tune").attr("src", "http://www.chiptape.com/chiptape/sounds/medium/Sound17.wav");
            setTimeout(function() {
                $("#a").css("border-color", "#0b7000");
            }, 200);
        } else if (divid == "b") {
            $("#b").css("border-color", "#ff0b00");
            $("#tune").attr("src", "http://www.chiptape.com/chiptape/sounds/medium/R2chirp.wav");
            setTimeout(function() {
                $("#b").css("border-color", "#c30800");
            }, 200);
        } else if (divid == "c") {
            $("#c").css("border-color", "#ffec00");
            $("#tune").attr("src", "http://www.chiptape.com/chiptape/sounds/medium/BEEP2.wav");
            setTimeout(function() {
                $("#c").css("border-color", "#c3b400");
            }, 200);
        } else if (divid == "d") {
            $("#d").css("border-color", "#29abd0");
            $("#tune").attr("src", "http://www.chiptape.com/chiptape/sounds/medium/blob.wav");
            setTimeout(function() {
                $("#d").css("border-color", "#196d85");
            }, 200);
        }

        audio[0].pause();
        audio[0].load();
        audio[0].play();

    }




    function makeid() {
        var text = "";
        var possible = "abcd";

        for (var i = 0; i < 1; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            settings.sequence.push(text);

        }




        function myLoop() {
            setTimeout(function() {
                animate(settings.sequence[settings.playNumber]);
                settings.playNumber++;
                if (settings.playNumber < settings.sequence.length) {
                    myLoop();
                } else {
                    settings.playNumber = 0;
                    listen();
                }
            }, settings.speed)
        }

        myLoop();

    }


    // LISTEN 

    function listen() {

        $("#a, #b, #c, #d").on("mousedown", function() {


            if (this.id == settings.sequence[settings.clicked]) {

                if (settings.clicked === settings.sequence.length - 1) {
                    $("#a, #b, #c, #d").off("mousedown");
                    settings.clicked = 0;
                    $("#start").trigger("click");
                } else {
                    console.log("Right!");
                    settings.clicked++;
                }



            } else {
                console.log("WRONG");
                $("#fail").show();
                $("#fail").addClass("bigEntrance");
                $("#tune").attr("src", "http://www.chiptape.com/chiptape/sounds/medium/MidwaySatanSOUND45.WAV");
                audio[0].pause();
                audio[0].load();
                audio[0].play();
                $("#simon, #count").css("filter", "blur(5px)");
                $("#simon, #count").css("-webkit-filter", "blur(5px)");
                settings.clicked = 0;
                $("#a, #b, #c, #d").off("mousedown");

            }

        });

    }



    //BEGIN GAME

    $("#a, #b, #c, #d").on("click", function() {
        animate(this.id)
    });
    $("#start").on("click", function() {
        $("#start").hide();
        $("#simon, #count").css("filter", "blur(0px)");
        $("#simon, #count").css("-webkit-filter", "blur(0px)");
        settings.round++;
        makeid(); // make id and play it
        $("#count").html(settings.round);
        //playit();




    });

    $("#fail").on("click", function() {
        $("#fail").hide();
        settings.sequence = [];
        settings.round = 0;
        settings.playNumber = 0,
            settings.speed = 1000;
        settings.clicked = 0;
        $("#start").trigger("click");
    });

}); //document ready
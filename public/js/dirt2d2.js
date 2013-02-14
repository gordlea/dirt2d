'use strict';
var requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(callback) {
    return window.setTimeout(callback, 1000 / 60);
};

var ASPECT_RATIO = 1.6;

$(function() {
    var d2d = new Dirt2d();
});

var Dirt2d = dejavu.Class.declare({
    $name: 'Dirt2d',
    __playerCount: 4,
    __worldDimensions: {
        x: 1440,
        y: 900
    },
    __worldScreenScale: {
        x: 0,
        y: 0
    },
    __ground: null,
    __space: null,
    __canvas: null,
    __stage: null,
    __units: [],


    initialize: function() {


        this.__space = new cp.Space();
        this.__space.iterations = 60;
        this.__space.gravity = cp.v(0, -200);
        this.__space.sleepTimeThreshold = 0.5;
        this.__space.collisionSlop = 0.5;
        this.__space.sleepTimeThreshold = 0.5;

        this.__canvas = document.getElementById('canvas');
        this.__stage = new Stage(this.__canvas);

        this.createTerrain();

        this.createUnits();

        this.handleWindowResize();
        $(window).resize(this.handleWindowResize.bind(this));
        var spinner = $( "#angle_value" ).spinner({
            min: 0,
            max: 180,
            step: 1,
            value: 0,
            spin: this.handleAngleSpinnerChange.bind(this),
            change: this.handleAngleSpinnerChange.bind(this)
        });

        $( "#angle_slider" ).slider({
            min: 0,
            max: 180,
            step: 1,
            value: 0,
            slide: this.handleAngleSliderChange.bind(this)
        });

//        $( "#angle_value" ).spinner("value",0);


    },

    handleAngleSliderChange: function(event, ui) {
        $( "#angle_value").spinner("value", ui.value);
        for (var i = 0; i < this.__units.length; i++) {
            this.__units[i].setGunAngleDegrees(ui.value);
        }
    },
    handleAngleSpinnerChange: function(event, ui) {
        $( "#angle_slider" ).slider("value", ui.value);
        for (var i = 0; i < this.__units.length; i++) {
            this.__units[i].setGunAngleDegrees(ui.value);
        }
    },

    createTerrain: function() {
        this.__ground = new Ground(7, this.__worldDimensions, this.__playerCount, this.__stage);
//        console.dir(this.__ground.segments);

    },

    drawTerrain: function() {
        this.__ground.draw(this.__worldScreenScale.x, this.__worldScreenScale.y);

    },

    createUnits: function() {
        var colors = ["FF0000", "00FF00", "0000FF", "0F0F0F"];
        for (var i = 0; i < this.__playerCount; i++) {
            this.__ground.platforms[i]
            this.__units.push(new Unit(this.__ground.platforms[i], this.__stage, this.__worldDimensions, colors[i]));
        }
    },

    drawUnits: function() {
        for (var i = 0; i < this.__units.length; i++) {
            this.__units[i].updateScale(this.__worldScreenScale.x, this.__worldScreenScale.y);

            if (!this.__units[i].drawn) {
                this.__units[i].draw();
            }
        }
    },


    handleWindowResize: function() {
        var controlsHeight = $('#controls').outerHeight();

        //use a 16:10 ratio ideally
        var availableHeight = $(window).innerHeight() - controlsHeight - 5;
        var availableWidth =  $(window).width();
        var newHeight = availableHeight;
        var newWidth = availableWidth;
        var availableRatio = availableWidth/availableHeight;
        if (availableRatio !== ASPECT_RATIO) {
//            console.log("width too small, make it shorter");

            newHeight = availableWidth/ASPECT_RATIO;
            newWidth = availableWidth;
            if (newHeight > availableHeight) {
                //change width
                newHeight = availableHeight;
                newWidth =  availableHeight*ASPECT_RATIO;
            }
        }


        this.__worldScreenScale.y = newHeight/this.__worldDimensions.y;
        this.__worldScreenScale.x = newWidth/this.__worldDimensions.x;

//        console.log("availableWidth: %d, availableHeight: %d", availableWidth, availableHeight);

        $('#canvas').attr("height", newHeight);
        $('#canvas').attr("width", newWidth);

        $('#controls').css("width", newWidth);

        this.drawTerrain();
        this.drawUnits();
    },
    $statics: {
        getRandom: function(low, high) {
            return low + Math.floor(Math.random() * (high - low + 1));
        }
    }
});
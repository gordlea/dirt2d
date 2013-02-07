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

        this.handleWindowResize();
        $(window).resize(this.handleWindowResize.bind(this));

    },

    createTerrain: function() {
        this.__ground = new Ground(7, this.__worldDimensions, this.__playerCount, this.__stage);
//        console.dir(this.__ground.segments);

    },

    drawTerrain: function() {
        this.__ground.draw(this.__worldScreenScale.x, this.__worldScreenScale.y);

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

        this.drawTerrain();
    },
    $statics: {
        getRandom: function(low, high) {
            return low + Math.floor(Math.random() * (high - low + 1));
        }
    }
});
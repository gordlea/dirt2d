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
var v = cp.v;
var physSpace = new cp.Space();
physSpace.iterations = 60;
physSpace.gravity = v(0, -0.0002);



//physSpace.sleepTimeThreshold = 0.5;
physSpace.collisionSlop = 0.5;
physSpace.sleepTimeThreshold = 0.5;

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
    units: [],
    projectiles: {},


    initialize: function() {


        this.__space = physSpace;

        this.__canvas = document.getElementById('canvas');
        this.__stage = new createjs.Stage(this.__canvas);

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

        var powerSpinner = $( "#power_value" ).spinner({
            min: 0,
            max: 100,
            step: 1,
            value: 50,
            spin: this.handlePowerSpinnerChange.bind(this),
            change: this.handlePowerSpinnerChange.bind(this)
        });

        $( "#power_slider" ).slider({
            min: 0,
            max: 100,
            step: 1,
            value: 50,
            slide: this.handlePowerSliderChange.bind(this)
        });

//        $( "#angle_value" ).spinner("value",0);

        $("#fire_button").button().click(function (event) {
            console.log("fire");
            for (var i = 0; i < 1; i++) {
                var p  = this.units[i].fire();
                this.projectiles[p.id] = p;
            }
        }.bind(this));
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", this.handleTick.bind(this));
        physSpace.addCollisionHandler(6127, 224, function(a, b) {
//            console.log('collision');
            var pid = a.body_a.projectileId;
            var p = this.projectiles[pid];
            p.explode();
        }.bind(this));

    },

    handleTick: function() {
                     var deadProjectiles = [];
        var interval = createjs.Ticker.getInterval();
        physSpace.step(interval);
//        for (var i = 0; i < this.projectiles.length; i++) {
        for (var pid in this.projectiles) {
//            console.log("drawing projectile");
            var p  = this.projectiles[pid];
            p.updateScale(this.__worldScreenScale.x,this.__worldScreenScale.y)

            if (!p.drawn) {
                p.draw();
            }
            if (p.exploding === true) {
                p.stopPhysics();
            }

            if (p.dead === true) {

                    p.die();
                    delete this.projectiles[pid];

            } else {

                p.tick();
            }



        }


//        for (var dpi = 0; dpi < deadProjectiles.length; dpi++) {
////            var dp = this.projectiles.splice(deadProjectiles[dpi], 1);
//            var dpid = deadProjectiles[dpi];
//            var dp = this.projectiles[dpid];
//
//            physSpace.removeBody(dp);
//            delete this.projectiles[dpid];
//            dp = null;
//
//
//        }

        this.__stage.update();


     },

    handleAngleSliderChange: function(event, ui) {
        $( "#angle_value").spinner("value", ui.value);
        for (var i = 0; i < this.units.length; i++) {
            this.units[i].setGunAngleDegrees(ui.value);
        }
    },
    handleAngleSpinnerChange: function(event, ui) {
        $( "#angle_slider" ).slider("value", ui.value);
        for (var i = 0; i < this.units.length; i++) {
            this.units[i].setGunAngleDegrees(ui.value);
        }
    },


    handlePowerSliderChange: function(event, ui) {
        $( "#power_value").spinner("value", ui.value);
        for (var i = 0; i < this.units.length; i++) {
            this.units[i].setGunPower(ui.value);
        }
    },
    handlePowerSpinnerChange: function(event, ui) {
        $( "#power_slider" ).slider("value", ui.value);
        for (var i = 0; i < this.units.length; i++) {
            this.units[i].setGunPower(ui.value);
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
            this.units.push(new Unit(this.__ground.platforms[i], this.__stage, this.__worldDimensions, colors[i]));
        }
    },

    drawUnits: function() {
        for (var i = 0; i < this.units.length; i++) {
            this.units[i].updateScale(this.__worldScreenScale.x, this.__worldScreenScale.y);

            if (!this.units[i].drawn) {
                this.units[i].draw();
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
'use strict';
var requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(callback) {
    return window.setTimeout(callback, 1000 / 60);
};

$(function() {
    var d2d = new Dirt2d();
});

var Dirt2d = dejavu.Class.declare({
    $name: 'Dirt2d',
    __ground: null,
    __space: null,
    __groundOffset: 100,
    __ctx: null,
    __scale_x: null,
    __scale_y: null,
    __unitCount: 4,
    units: [],

    initialize: function() {


        this.__ground = new Ground(8, this.__groundOffset, this.__unitCount);

        this.__space = new cp.Space();
        this.__space.iterations = 60;
        this.__space.gravity = cp.v(0, -200);
        this.__space.sleepTimeThreshold = 0.5;
        this.__space.collisionSlop = 0.5;
        this.__space.sleepTimeThreshold = 0.5;
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        this.__ctx = ctx;

        this.handleWindowResize();
        this.createTerrain();
        this.createUnits();
        this.handleWindowResize();
        $(window).resize(this.handleWindowResize.bind(this));

    },

    createTerrain: function() {
        var segWidthPixels = 1000 / this.__ground.segments.length;
        var pixelOffset = 1000/2;
        var pixelOffsetScaler = 1000/this.__groundOffset;
        console.log("segWidthPixels: %d", segWidthPixels);

        for (var x = 0; x < this.__ground.segments.length; x++) {

            var segment = this.__ground.segments[x];
            var verts = [
                x*segWidthPixels, 1000*segment[0]/(this.__groundOffset*2),
                (x+1)*segWidthPixels, 1000*segment[1]/(this.__groundOffset*2),
                (x+1)*segWidthPixels, 0,
                x*segWidthPixels, 0
            ];

            this.__space.addShape(new cp.PolyShape(this.__space.staticBody, verts, cp.v(0,0)));
        }

//        var singlePieceVerts =
    },

    createUnits: function() {
        var segWidthPixels = 1000 / this.__ground.segments.length;

        for (var i = 0; i < this.__unitCount; i++) {
            var space = this.__space;
            var width = 4;
            var height = 4;
            var mass = width * height * (1/1000);
            var projectileBody = new cp.Body(mass, cp.momentForBox(mass, width, height));
//            projectileBody.id = UUIDjs.create().hex;
            var tank = space.addBody(projectileBody);
            console.log("position? %d %d", this.__ground.platforms[i][0], this.__ground.platforms[i][1])
            tank.setPos(cp.v(this.__ground.platforms[i][0]*segWidthPixels, this.__ground.platforms[i][1]*1000/(this.__groundOffset*2)));
//            rock.setAngle(1);
//            shape = space.addShape(new cp.RectShape(rock, 4, v(0,0)));


            console.log("creating unit %d of %d", i + 1, this.__unitCount);
//
//            var unit = new Unit(this.__ground.platforms[i]);
//
//            this.__units.push(unit);

//            var verts = unit.getVerts(segWidthPixels, 1000/(this.__groundOffset*2));
            var shape = new cp.PolyShape(tank, [-8, 16, 8, 16, 8, 0, -8, 0], cp.v(0,0))
            shape.setFriction(0.3);
            shape.setElasticity(0.3);
            shape.setCollisionType(2);
            this.__space.addShape(shape);
//            rock.applyImpulse(cp.v(3, 3));


        }
    },


    draw: function() {
        var ctx = this.__ctx;
        ctx.strokeStyle = 'black';
        ctx.clearRect(0, 0, $('#canvas').width(), $('#canvas').height());

        ctx.font = "16px sans-serif";
        ctx.lineCap = 'round';

        var scale_x = this.__scale_x;
        var scale_y = this.__scale_y;

        this.__space.eachShape(function(shape) {
            ctx.fillStyle = shape.style();
            shape.draw(ctx, scale_x, scale_y, point2canvas);
        });
    },

    handleWindowResize: function() {
        var controlsHeight = $('#controls').height();

        $('#canvas').attr("height", ($(window).innerHeight() - controlsHeight));
        $('#canvas').attr("width", ($(window).width()));

        this.__scale_x = $('#canvas').attr("width")/1000;
        this.__scale_y = $('#canvas').attr("height")/1000;

//        this.draw();
//        this.drawTerrain();
        this.draw();
    },

    $statics: {
        getRandom: function(low, high) {
            return low + Math.floor(Math.random() * (high - low + 1));
        }
    }
});

cp.Shape.prototype.style = function() {
    var body;
    if (this.sensor) {
        return "rgba(255,255,255,0)";
    } else {
        body = this.body;
        if (body.isSleeping()) {
            return "rgb(50,50,50)";
        } else if (body.nodeIdleTime > this.physSpace.sleepTimeThreshold) {
            return "rgb(170,170,170)";
        } else {
            return styles[this.hashid % styles.length];
        }
    }
};

// **** Draw methods for Shapes

cp.PolyShape.prototype.draw = function(ctx, scale_x, scale_y, point2canvas)
{
    ctx.beginPath();

    var verts = this.tVerts;
    var len = verts.length;
    var lastPoint = point2canvas(new cp.Vect(verts[len - 2], verts[len - 1]), scale_x, scale_y);
    ctx.moveTo(lastPoint.x, lastPoint.y);

    for(var i = 0; i < len; i+=2){
        var p = point2canvas(new cp.Vect(verts[i], verts[i+1]),  scale_x, scale_y);
        ctx.lineTo(p.x, p.y);
    }
    ctx.fill();
    ctx.stroke();
};

cp.SegmentShape.prototype.draw = function(ctx, scale, point2canvas) {
    var oldLineWidth = ctx.lineWidth;
    ctx.lineWidth = Math.max(1, this.r * scale * 2);
    drawLine(ctx, point2canvas, this.ta, this.tb);
    ctx.lineWidth = oldLineWidth;
};

cp.CircleShape.prototype.draw = function(ctx, scale, point2canvas) {
    drawCircle(ctx, scale, point2canvas, this.tc, this.r);

    // And draw a little radian so you can see the circle roll.
    drawLine(ctx, point2canvas, this.tc, cp.v.mult(this.body.rot, this.r).add(this.tc));
};


// Draw methods for constraints

cp.PinJoint.prototype.draw = function(ctx, scale, point2canvas) {
    var a = this.a.local2World(this.anchr1);
    var b = this.b.local2World(this.anchr2);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "grey";
    drawLine(ctx, point2canvas, a, b);
};

cp.SlideJoint.prototype.draw = function(ctx, scale, point2canvas) {
    var a = this.a.local2World(this.anchr1);
    var b = this.b.local2World(this.anchr2);
    var midpoint = v.add(a, v.clamp(v.sub(b, a), this.min));

    ctx.lineWidth = 2;
    ctx.strokeStyle = "grey";
    drawLine(ctx, point2canvas, a, b);
    ctx.strokeStyle = "red";
    drawLine(ctx, point2canvas, a, midpoint);
};

cp.PivotJoint.prototype.draw = function(ctx, scale, point2canvas) {
    var a = this.a.local2World(this.anchr1);
    var b = this.b.local2World(this.anchr2);
    ctx.strokeStyle = "grey";
    ctx.fillStyle = "grey";
    drawCircle(ctx, scale, point2canvas, a, 2);
    drawCircle(ctx, scale, point2canvas, b, 2);
};

cp.GrooveJoint.prototype.draw = function(ctx, scale, point2canvas) {
    var a = this.a.local2World(this.grv_a);
    var b = this.a.local2World(this.grv_b);
    var c = this.b.local2World(this.anchr2);

    ctx.strokeStyle = "grey";
    drawLine(ctx, point2canvas, a, b);
    drawCircle(ctx, scale, point2canvas, c, 3);
};

cp.DampedSpring.prototype.draw = function(ctx, scale, point2canvas) {
    var a = this.a.local2World(this.anchr1);
    var b = this.b.local2World(this.anchr2);

    ctx.strokeStyle = "grey";
    drawSpring(ctx, scale, point2canvas, a, b);
};

var randColor = function() {
    return Math.floor(Math.random() * 256);
};

var styles = [];
for (var i = 0; i < 100; i++) {
    styles.push("rgb(" + randColor() + ", " + randColor() + ", " + randColor() + ")");
}
var drawCircle = function(ctx, scale, point2canvas, c, radius) {
    var c = point2canvas(c);
    ctx.beginPath();
    ctx.arc(c.x, c.y, scale * radius, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.stroke();
};

var drawLine = function(ctx, point2canvas, a, b) {
    a = point2canvas(a); b = point2canvas(b);

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
};

function point2canvas(point, scale_x, scale_y) {
//        return v(point.x * self.scale, (480 - point.y) * self.scale);
    return cp.v(point.x*scale_x, ($('#canvas').height()-point.y*scale_y));
//        return point;
};
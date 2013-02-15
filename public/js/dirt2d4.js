var v = cp.v;

//var canvas = document.getElementById('canvas1');
//var ctx = canvas.getContext('2d');
//
//canvas.style.position = "absolute";
//canvas.style.top = "0";
//canvas.style.left = "0";

var requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(callback) {
    return window.setTimeout(callback, 1000 / 60);
};

var Dirt2d = klass(function() {
    var space = this.physSpace = new cp.Space();
    space.iterations = 60;
    space.gravity = v(0, -200);
    space.sleepTimeThreshold = 0.5;
    space.collisionSlop = 0.5;
    space.sleepTimeThreshold = 0.5;

//    space.addCollisionHandler(1,2, null, this.handleProjectileImpact.bind(this));

    this.remainder = 0;
    this.fps = 0;
    this.mouse = v(0,0);
    this.canvas = canvas;
    this.ctx = ctx;
    var self = this;
    var canvas2point = this.canvas2point = function(x, y) {
//        return v(x / self.scale, 480 - y / self.scale);
        return point;
    };

    this.point2canvas = function(point) {
//        return v(point.x * self.scale, (480 - point.y) * self.scale);
        return v(point.x, canvas.height-point.y);
//        return point;
    };

    this.deadBodies = {};

    var width = this.width = canvas.width = window.innerWidth;
    var height = this.height = canvas.height = window.innerHeight - 64;
//    if (width/height > 640/480) {
//        this.scale = height / 480;
//    } else {
//        this.scale = width / 640;
//    }



}).methods({



        generateTerrain: function() {
            this.ground = new Ground({
                width: this.width,
                height: this.height
            });



//            var segs = this.ground.segments;

//            var floor = this.space.addShape(new cp.SegmentShape(this.space.staticBody, v(0, 0), v(640, 0), 0));
//            floor.setElasticity(1);
//            floor.setFriction(1);
//
//            var wall_l = this.space.addShape(new cp.SegmentShape(this.space.staticBody, v(0,0), v(0,640), 0));
//            var wall_r = this.space.addShape(new cp.SegmentShape(this.space.staticBody, v(640,0), v(640,640), 0));
//            var ceiling = this.space.addShape(new cp.SegmentShape(this.space.staticBody, v(0,640), v(640,640), 0));
//            floor.setLayers(NOT_GRABABLE_MASK);
             this.createTerrain();
        },

        createTerrain: function() {
            if (this.groundSegments === undefined) {
                this.groundSegments = [];
            } else {
                //remove em all
                for (var j = 0; j < this.groundSegments.length; j++) {
                    var deadSeg = this.groundSegments[j];

                    this.physSpace.removeShape(deadSeg);

//                }

                }
                this.groundSegments = [];

//                }

            }

            var verts = this.ground.getVerts();
            for (var vi = 0; vi < verts.length; vi++) {
//                console.log("adding vert[%d]", vi);
                this.physSpace.addShape(new cp.PolyShape(this.physSpace.staticBody, verts[vi], v(0,0)));
            }

//            var ground = new cp.PolyShape(this.space.staticBody, verts, v(0,0));
//            this.space.addShape(ground);

//            var segs = this.ground.toSegmentArray();
//            console.dir(segs);
//
//            for (var i = 0; i < segs.length; i++) {
////                var start = segs[i][0];
////                var end = segs[i][1];
//
//                var groundSegment = new cp.SegmentShape(this.space.staticBody, v(segs[i][0][0],segs[i][0][1]), v(segs[i][1][0],segs[i][1][1]), 0);
//                groundSegment.setCollisionType(1);
//                this.space.addShape(groundSegment);
//                this.groundSegments.push(groundSegment);
//            }

            this.draw();

            this.terrainDirty = false;
        },

        fireProjectile: function() {
            var space = this.physSpace;
            var width = 5;
            var height = 5;
            var mass = width * height * (1/1000);
            var projectileBody = new cp.Body(mass, cp.momentForBox(mass, width, height));
            projectileBody.id = UUIDjs.create().hex;
            var rock = space.addBody(projectileBody);
            rock.setPos(v(100, 300));
            rock.setAngle(1);
            shape = space.addShape(new cp.CircleShape(rock, 4, v(0,0)));
            shape.setFriction(0.3);
            shape.setElasticity(0.3);
          shape.setCollisionType(2);
            rock.applyImpulse(v(3, 3));

        },



        fireBall: function() {
            var space = this.physSpace;
            var radius = Dirt2d.getRandom(2,8)
            var mass = radius * radius * (1/500) * Dirt2d.getRandom(1,10);
            var moment = cp.momentForCircle(mass, 0, radius, v(0,0))
            var projectileBody = new cp.Body(mass, moment);
            projectileBody.id = UUIDjs.create().hex;
            var rock = space.addBody(projectileBody);
            rock.setPos(v(Dirt2d.getRandom(100,540), Dirt2d.getRandom(100,380)));
            rock.setAngle(1);
            shape = space.addShape(new cp.CircleShape(rock, radius, v(0,0)));
            shape.setFriction(0.9);
            shape.setElasticity(0.1);
            shape.setCollisionType(5);
            rock.applyImpulse(v(Dirt2d.getRandom(-6,6), Dirt2d.getRandom(-6,6)), v(Dirt2d.getRandom(-6,6), Dirt2d.getRandom(-6,6)));
        },

        fireTriangle: function() {
            var space = this.physSpace;
            var radius = Dirt2d.getRandom(6,16)
            var mass = radius * radius * (1/500) * Dirt2d.getRandom(1,10);
            var verts = [
                Dirt2d.getRandom(6, 16),
                Dirt2d.getRandom(6, 16),
                Dirt2d.getRandom(6, 16),
                Dirt2d.getRandom(-6, -16),
                Dirt2d.getRandom(-3, -8),
                Dirt2d.getRandom(-1,1)

            ];
            var moment = cp.momentForPoly(mass, verts, v(0,0))
            var projectileBody = new cp.Body(mass, moment);
            projectileBody.id = UUIDjs.create().hex;
            var rock = space.addBody(projectileBody);
            rock.setPos(v(Dirt2d.getRandom(100,540), Dirt2d.getRandom(100,380)));
            rock.setAngle(1);
            shape = space.addShape(new cp.PolyShape(rock, verts, v(0,0)));
            shape.setFriction(0.01);
            shape.setElasticity(0.4);
            shape.setCollisionType(5);
            rock.applyImpulse(v(Dirt2d.getRandom(-6,6), Dirt2d.getRandom(-6,6)), v(Dirt2d.getRandom(-6,6), Dirt2d.getRandom(-6,6)));
        },

    update: function(dt) {
        this.physSpace.step(dt);
    },

        draw: function() {
            var ctx = this.ctx;

            var self = this;

            // Draw shapes
            ctx.strokeStyle = 'black';
            ctx.clearRect(0, 0, this.width, this.height);

            this.ctx.font = "16px sans-serif";
            this.ctx.lineCap = 'round';

            this.physSpace.eachShape(function(shape) {
                ctx.fillStyle = shape.style();
                shape.draw(ctx, self.scale, self.point2canvas);
            });
        },

        run: function() {
            this.running = true;

            var self = this;
            var step = function() {
                self.step();
                if (self.running) {
                    requestAnimationFrame(step);
                }
            };

            this.lastStep = Date.now();
            step();
        },

    stop: function() {
        this.running = false;
    },

        step: function() {
            if (document.getElementById('spew').checked) {
                this.fireBall();
            }
            if (document.getElementById('spewtri').checked) {
                this.fireTriangle();
            }


            var now = Date.now();
            var dt = (now - this.lastStep) / 1000;
            this.lastStep = now;

            if (this.terrainDirty) {
                this.createTerrain();
            }

//            while (this.deadBodies.length > 0) {
            for (bodyId in this.deadBodies) {

//                for (var i = 0; i < this.deadBodies.length; i++) {
                var db =this.deadBodies[bodyId];
                db.eachShape(function(shape) {
                    this.physSpace.removeShape(shape);
                }.bind(this));
                    this.physSpace.removeBody(db);

//                }
            }
            this.deadBodies = {};

            this.draw();

            // Update FPS
            if(dt > 0) {
                this.fps = 0.7*this.fps + 0.3*(1/dt);
            }
            var lastNumActiveShapes = this.physSpace.activeShapes.count;

            // Limit the amount of time thats passed to 0.1 - if the user switches tabs or
            // has a slow computer, we'll just slow the simulation down.
            dt = Math.min(dt, 1/25);

            this.remainder += dt;

            while(this.remainder > 1/60) {
                // Chipmunk works better with a constant framerate, because it can cache some results.
                this.remainder -= 1/60;
                this.update(1/60);
            }

            // Only redraw if the simulation isn't asleep.
            if (lastNumActiveShapes > 0 ) {
                this.draw();
//                Demo.resized = false;
            }
        }
}).statics({
        getRandom: function(min, max) {
            return min + Math.floor(Math.random() * (max - min + 1));
        }
    });

// **** Draw methods for Shapes

cp.PolyShape.prototype.draw = function(ctx, scale, point2canvas)
{
    ctx.beginPath();

    var verts = this.tVerts;
    var len = verts.length;
    var lastPoint = point2canvas(new cp.Vect(verts[len - 2], verts[len - 1]));
    ctx.moveTo(lastPoint.x, lastPoint.y);

    for(var i = 0; i < len; i+=2){
        var p = point2canvas(new cp.Vect(verts[i], verts[i+1]));
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

//styles = ['rgba(255,0,0,0.5)', 'rgba(0,255,0,0.5)', 'rgba(0,0,255,0.5)'];

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

var canvas = null;
var ctx = null;
var d2d;
function start() {
    canvas = document.getElementById('canvas1');
    ctx = canvas.getContext('2d');

//    canvas.style.position = "absolute";
//    canvas.style.top = "0";
//    canvas.style.left = "0";
    d2d = new Dirt2d();
    d2d.generateTerrain();
    d2d.run()
}

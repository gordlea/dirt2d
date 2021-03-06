var Graphics = createjs.Graphics;
var Shape = createjs.Shape;

var Ground = dejavu.Class.declare({
    $name: "Ground",
    _maxOffset: null,
    _minOffset: null,
    segments: [],
    platforms: [],
    __bodyShape: null,
    __stage: null,
    __worldDimensions: null,
    __platformWidth: 3,
    __body: null,
    shapes: null,
    needsUpdate: null,

    initialize: function(divCount, dimensions, platforms, stage) {
        this.__stage = stage;
        this.__worldDimensions = dimensions;
        this._maxOffset = dimensions.y/2;
        this._minOffset = -1 * this._maxOffset;

        this.segments.push([
            this._maxOffset, this._maxOffset
        ]);

        for (var di = 0; di < divCount; di++) {
            this.divide();
        }
        this.createPlatforms(platforms);
        console.log("line now has %d segments", this.segments.length);

          this.needsUpdate = false;

        this.updateGroundPhysics();
    },

    updateGroundPhysics: function() {

        if (this.shapes === null) {
            this.shapes = [];
        } else {
            for (var si = 0; si < this.shapes.length; si++) {
                var sha = this.shapes[si];
                physSpace.removeShape(sha);

            }
            this.shapes = [];
        }

        var verts = [];

        var segmentWidth = this.__worldDimensions.x/this.segments.length;

        for (var i = 0; i < this.segments.length; i++) {
            var verty = [];

            var segment = this.segments[i];


            verty.push(i*segmentWidth);
            verty.push(segment[0]);


            verty.push((i+1)*segmentWidth);
            verty.push(segment[1]);

            verty.push((i+1)*segmentWidth);
            verty.push(0);

            verty.push(i*segmentWidth);
            verty.push(0);

            verts.push(verty);
//            console.dir(verty);
        }
//        console.dir(verts);




        for (var vi = 0; vi < verts.length; vi++) {
            var shp = new cp.PolyShape(physSpace.staticBody, verts[vi], v(0,0));
            shp.setCollisionType(6127);
            physSpace.addShape(shp);
            this.shapes.push(shp);

        }
    },

    divide: function() {
        var newSegments = [];

        var firstTime = this.segments.length === 1;
        console.log(firstTime);

        for (var i = 0; i < this.segments.length; i++) {


            var offset =  null;
            if (firstTime) {
                offset = Dirt2d.getRandom(this._minOffset, 0);
            } else{
                offset = Dirt2d.getRandom(this._minOffset, this._maxOffset);
            }


            var seg = this.segments[i];

            var midY = (seg[0]+seg[1])/2;

            newSegments.push([seg[0], midY+offset]);
            newSegments.push([midY+offset, seg[1]]);

        }

        this._minOffset /= 2;
        this._maxOffset /= 2;

        this.segments = newSegments;

    },

    createPlatforms: function(number) {
        var segmentWidth = this.__worldDimensions.x/this.segments.length;

        var steps = Math.floor(this.segments.length / 5);

        for (var i = 0; i < number; i++) {
            var xCoord = steps*(i+1);//Dirt2d.getRandom(this.__platformWidth, this.segments.length - this.__platformWidth);


            var height = this.segments[xCoord][0];

            this.platforms.push([xCoord*segmentWidth, height]);
            this.segments[xCoord][1] = height

            var phw = Math.floor(this.__platformWidth/2)

            this.segments[xCoord-phw][1] = height;
            for (var j = -1*phw; j <= phw; j++) {
                this.segments[xCoord+j][0] = height;
                this.segments[xCoord+j][1] = height;
            }
            this.segments[xCoord+phw+1][0] = height;
        }
    },

    draw: function(scale_x, scale_y) {
        if (this.__bodyShape !== null) {
           this.__stage.removeChild(this.__bodyShape);
        }

        this.__bodyShape = new Shape();
        this.__bodyShape.graphics.beginStroke(Graphics.getRGB(0,0,0)).setStrokeStyle(3*scale_x);
        this.__bodyShape.graphics.beginFill("FFFFFF")   ;

        var segmentWidth = this.__worldDimensions.x/this.segments.length;

        for (var i = 0; i < this.segments.length; i++) {


            var segment = this.segments[i];
            if (i === 0) {
                this.__bodyShape.graphics.moveTo(0,this.__worldDimensions.y*scale_y - segment[0]*scale_y)
            }

            this.__bodyShape.graphics.lineTo((i+1)*segmentWidth*scale_x,this.__worldDimensions.y*scale_y - segment[1]*scale_y)

        }

        this.__bodyShape.graphics.lineTo(this.__worldDimensions.x*scale_x, this.__worldDimensions.y*scale_y);
        this.__bodyShape.graphics.lineTo(0, this.__worldDimensions.y*scale_y);
        this.__bodyShape.graphics.closePath();

        this.__bodyShape.graphics.endStroke();
        this.__stage.addChild(this.__bodyShape);
        this.__stage.update();
    },


    explosion: function(projectile) {

//        var segment5 = this.segments[5];
//        segment5[0] -= 5;
//        segment5[1] -= 5;
//
//                var segmentWidth = this.__worldDimensions.x/this.segments.length;

//        projectile.x;
//        var segx = Math.floor(projectile.x/segmentWidth);
//        var r = 5*segmentWidth;
//        var impact_y = (this.segments[segx][0] + this.segments[segx][1])/2;
//
//        for (var i = -5; i <=5; i++) {
//            var seg = this.segments[segx + i];
//            var y = Math.sqrt((r*r) - ((i*segmentWidth)*(i*segmentWidth)));
//            seg[0] = impact_y - y;
//            y = Math.sqrt((r*r) - (((i+1)*segmentWidth)*((i+1)*segmentWidth)));
//            seg[1] = impact_y - y;
//
//
//
//        }


//        var ex = projectile.x;
//        var ey = projectile.y;
//
//
//        var segmentWidth = this.__worldDimensions.x/this.segments.length;
//        var segmentLeft = Math.floor((ex-60)/segmentWidth);
//        var segmentRight = Math.ceil((ex+60)/segmentWidth);
//        var segr = (segmentRight - segmentLeft)/2;
//        var r = segr*segmentWidth;
//
//
//        for (var i = segmentLeft; i < segmentRight; i++) {
//
//            var x = Math.abs(i-segr)*segmentWidth;
//            var y = r*Math.sin(Math.acos(x/r));
//
//            var s = this.segments[i];
//
//            s[0] -= y;
//            s[1] -= s[0];
//            this.segments[i] = s;
//        }
//
//
//         this.needsUpdate = true;
    }

});

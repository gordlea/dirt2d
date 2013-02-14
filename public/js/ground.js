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
    },

    divide: function() {
        var newSegments = [];

        for (var i = 0; i < this.segments.length; i++) {


            var offset = Dirt2d.getRandom(this._minOffset, this._maxOffset);


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

        for (var i = 0; i < number; i++) {
            var xCoord = Dirt2d.getRandom(this.__platformWidth, this.segments.length - this.__platformWidth);


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

    }
});

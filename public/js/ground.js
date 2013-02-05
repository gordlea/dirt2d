var Ground = dejavu.Class.declare({
    $name: "Ground",
    _maxOffset: null,
    _minOffset: null,
    segments: [],
    platforms: [],

    initialize: function(divCount, offset, platforms) {

        this._maxOffset = offset;
        this._minOffset = -1 * this._maxOffset;

        this.segments.push([
            offset, offset
        ]);

        for (var di = 0; di < divCount; di++) {
            this.divide();
        }
        this.createPlatforms(platforms);
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
        console.log("line now has %d segments", this.segments.length);
    },

    createPlatforms: function(number) {
        for (var i = 0; i < number; i++) {
            var xCoord = Dirt2d.getRandom(5, 250);
            this.platforms.push(xCoord);
            var height = this.segments[xCoord][0];
            this.segments[xCoord][1] = height

            this.segments[xCoord-4][1] = height;
            for (var j = -3; j <= 3; j++) {
                this.segments[xCoord+j][0] = height;
                this.segments[xCoord+j][1] = height;
            }
            this.segments[xCoord+4][0] = height;
        }
    }
});

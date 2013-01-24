var Ground = dejavu.Class.declare({
    $name: "Ground",
    _maxOffset: null,
    _minOffset: null,
    segments: [],

    initialize: function(divCount, offset) {

        this._maxOffset = offset;
        this._minOffset = -1 * this._maxOffset;

        this.segments.push([
            offset, offset
        ]);

        for (var di = 0; di < divCount; di++) {
            this.divide();
        }
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
    }
});

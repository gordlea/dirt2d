var Ground = klass(function(config) {
//    this.w = 2;
//    while (this.w < config.width) {
//        this.w *= 2;
//    }

    this.w = this.pixelWidth = config.width;

    // this.w = config.width;
    this.h = config.height;

    var mid = Math.round(this.h/2);
    this.segments = [[mid, mid]];

    this.maxOffset = mid;
    this.minOffset = -1*mid;
    this.array = [];

    this.divide();
    this.divide();
    this.divide();
    this.divide();
    this.divide();

}).methods({
        toArray: function() {
            var output = [];

            var segWidth = this.w / this.segments.length;
            console.log("segWidth: %d", segWidth);
            for (var segi = 0; segi < this.segments.length; segi++) {

                var seg = this.segments[segi];
                var pixAmount = (seg[1] - seg[0])/segWidth;

                for (var pixeli = 0; pixeli < segWidth; pixeli++) {
                    var pix = segi * segWidth + pixeli;
                    if (pix >= this.pixelWidth) {
                        break;
                    }
                    output.push(seg[0] + (pixAmount*pixeli+1));
                }


            }

            return output;
        },

        toSegmentArray: function() {
            var output = [];

            var segWidth = this.w / this.segments.length;
            for (var segi = 0; segi < this.segments.length; segi++) {
                var seg = this.segments[segi];
                var pixAmount = (seg[1] - seg[0])/segWidth;

                output.push([[segi*segWidth, seg[0]], [segi*segWidth + segWidth, seg[1]]]);
            }

            return output;
        },

        getVerts: function() {


//            var verts = [0,this.h/2, this.w, this.h/2, this.w, 0, 0, 0]
            var verts = [];

            var segWidth = this.w / this.segments.length;
            for (var segi = 0; segi < this.segments.length; segi++) {
                var seg = this.segments[segi];
                var pixAmount = (seg[1] - seg[0])/segWidth;

                verts.push([
                    segi*segWidth, seg[0],

                    (segi+1)*segWidth, seg[1],

                    (segi+1)*segWidth, 0,

                    segi*segWidth, 0
                ]);

            }
//            verts.push(this.w);
//            verts.push(0);
//            verts.push(0);
//            verts.push(0);

            return verts;

        },

        divide: function() {
            var newSegments = [];

            var segWidth = this.w / this.segments.length;
            if (segWidth < 1) {
                return;
            }


            for (var i = 0; i < this.segments.length; i++) {


                var offset = Ground.getRandom(this.minOffset, this.maxOffset);


                var seg = this.segments[i];

                var midY = (seg[0]+seg[1])/2;

                newSegments.push([seg[0], midY+offset]);
                newSegments.push([midY+offset, seg[1]]);

            }

            this.minOffset /= 2;
            this.maxOffset /= 2;

            this.segments = newSegments;
            console.log("line now has %d segments", this.segments.length);

            this.array = this.toArray();
            return this.array;
        },

        explosion: function(a, b, radius) {
            var line = this.array;


            for (var i = -1 * radius; i <= radius; i++) {
                var x = i;
                var y = Math.sqrt(-1 *(Math.pow(x,2) - Math.pow(radius,2)));// / (2*Math.PI);
//                y = b + radius * Math.sin()

                var old_y = line[a-x];

                if (old_y > b + y) {
                    line[a-x] -= 2*y;
                } else
                if (old_y > b - y) {
                    line[a-x] = b - y ;
                }
            }
            return line;
        }
    }).statics({
        getRandom: function(min, max) {
            return min + Math.floor(Math.random() * (max - min + 1));
        }
    });
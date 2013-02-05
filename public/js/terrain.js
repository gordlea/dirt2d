var Terrain= dejavu.Class.declare({
    $name: "Terrain",
    __blocks: [],
    __groundOffset: 100,
    __ground: null,

    initialize: function(width, height) {

        this.__ground = new Ground(8, this.__groundOffset);
        var pixelOffsetScaler = height/this.__groundOffset;


        for (var x = 0; x < width; x++) {
            for (var y = 0; y <  this.__ground.segments[x]; y++) {
                this._blocks.push(new TerrainBlock(x,y))
            }
        }

    }


});

var Unit = dejavu.Class.declare({
    $name: "Unit",

    __position: null,

    initialize: function(position) {
                this.__position = position;
    },

    getVerts: function(scale_x, scale_y) {
                 var verts = [(this.__position[0] - 2)*scale_x, (this.__position[1] + 2) * scale_y,
                              (this.__position[0] + 2)*scale_x, (this.__position[1] + 2) * scale_y,
                              (this.__position[0] + 3)*scale_x, (this.__position[1]) * scale_y,
                              (this.__position[0] - 3)*scale_x, (this.__position[1]) * scale_y]
        return verts;
    }


});

var Unit = dejavu.Class.declare({
    $name: "Unit",

    __position: null,
    __stage: null,
    __bodyShape: null,
    __gunShape: null,
    color: null,
    __worldDimensions: null,
    __gunAngle: null,
    scaleX: null,
    scaleY: null,
    drawn: null,

    initialize: function(position, stage, dimensions, color) {
        this.__position = position;
        this.__stage = stage;
        this.__worldDimensions = dimensions;
        this.color = color;
        this.setGunAngleDegrees(0);
        this.scaleX = 1;
        this.scaleY = 1;
        this.drawn = false;
    },

    updateScale: function (xs, ys) {
        this.scaleX = xs;
        this.scaleY = ys;
        if (this.drawn) {
            console.log("updating scale");
            this.__bodyShape.scaleX = xs;
            this.__bodyShape.scaleY = ys;
            this.__gunShape.scaleX = xs;
            this.__gunShape.scaleY = ys;
            this.__bodyShape.x = this.__position[0]*this.scaleX;
            this.__bodyShape.y = this.__worldDimensions.y*this.scaleY - this.__position[1]*this.scaleY;
            this.__gunShape.x = this.__position[0]*this.scaleX;
            this.__gunShape.y = this.__worldDimensions.y*this.scaleY - this.__position[1]*this.scaleY;
        }
        this.__stage.update();

    },

    draw: function() {
        this.__bodyShape = new Shape();
        this.__bodyShape.scaleX = this.scaleX;
        this.__bodyShape.scaleY = this.scaleY;
        this.__bodyShape.x = this.__position[0]*this.scaleX;
        this.__bodyShape.y = this.__worldDimensions.y*this.scaleY - this.__position[1]*this.scaleY;
//        this.__bodyShape.skewX = this.scaleX;
//        this.__bodyShape.skewY = this.scaleY;
//        this.__bodyShape.x = 100;
//        this.__bodyShape.y = 100;
//        console.dir(this.__bodyShape);

        this.__bodyShape.graphics.beginStroke(Graphics.getRGB(0,0,0)).setStrokeStyle(3*this.scaleX);
        this.__bodyShape.graphics.beginFill(this.color);
        this.__bodyShape.graphics.rect(20, 0, -20, -10);
        this.__bodyShape.graphics.endStroke();
        this.__stage.addChild(this.__bodyShape);

        this.__gunShape = new Shape();
        this.__gunShape.scaleX = this.scaleX;
        this.__gunShape.scaleY = this.scaleY;
        this.__gunShape.x = this.__position[0]*this.scaleX;
        this.__gunShape.y = this.__worldDimensions.y*this.scaleY - this.__position[1]*this.scaleY;
                var gg = this.__gunShape.graphics;
        gg.beginStroke(Graphics.getRGB(0,0,0)).setStrokeStyle(3*this.scaleX);
        gg.mt(20,0);

        var gend_x = 30 * Math.cos(this.__gunAngle);
        var gend_y = 30 * Math.sin(this.__gunAngle);

        gg.lt(gend_x, gend_y);
        gg.es();
        this.__stage.addChild(this.__gunShape);
//        console.dir(this.__gunShape);
        this.__stage.update();

                                     this.drawn = true;
//        if (this.__bodyShape !== null) {
//            this.__stage.removeChild(this.__bodyShape);
//        }
//
//        this.__bodyShape = new Shape();
//        this.__bodyShape.graphics.beginStroke(Graphics.getRGB(0,0,0)).setStrokeStyle(3*scale_x);
//        this.__bodyShape.graphics.beginFill(this.color);
//
//        this.__bodyShape.graphics.rect(this.__position[0]*scale_x, (this.__worldDimensions.y*scale_y - this.__position[1]*scale_y) - 12*scale_y, 20*scale_x, 12*scale_y);
////        this.__shape.graphics.closePath();
//
//        this.__bodyShape.graphics.endStroke();
//        this.__stage.addChild(this.__bodyShape);
//        if (this.__gunShape !== null) {
//            this.__stage.removeChild(this.__gunShape);
//        }
//        this.__gunShape = new Shape();
//        this.__gunShape.x = this.__position[0]*scale_x;
//        this.__gunShape.y = (this.__worldDimensions.y*scale_y - this.__position[1]*scale_y) - 12*scale_y;
//
//        var gg = this.__gunShape.graphics;
//        gg.beginStroke(Graphics.getRGB(0,0,0)).setStrokeStyle(3*scale_x);
//        gg.mt(0,0);
//
//        var gend_x = 3*scale_y * Math.cos(this.__gunAngle);
//        var gend_y = 3*scale_y * Math.sin(this.__gunAngle);
//
//        gg.lt(gend_x, gend_y);
//
//        this.__stage.addChild(this.__gunShape);
//
//        this.__stage.update();
    },

    setGunAngleDegrees: function(degrees) {

                if (this.__gunShape !== null) {
            this.__stage.removeChild(this.__gunShape);
        }
        this.__gunAngle = degrees*Math.PI/180;

        this.__gunShape = new Shape();
        this.__gunShape.scaleX = this.scaleX;
        this.__gunShape.scaleY = this.scaleY;
        this.__gunShape.x = this.__position[0]*this.scaleX;
        this.__gunShape.y = this.__worldDimensions.y*this.scaleY - this.__position[1]*this.scaleY;
        var gg = this.__gunShape.graphics;
        gg.beginStroke(Graphics.getRGB(0,0,0)).setStrokeStyle(3*this.scaleX);
        gg.mt(10,0);

        var gend_x = 10+ 30 * Math.cos(this.__gunAngle);
        var gend_y = -30 * Math.sin(this.__gunAngle);

        gg.lt(gend_x, gend_y);
        gg.es();
        this.__stage.addChild(this.__gunShape);
//        console.dir(this.__gunShape);
        this.__stage.update();
    },




});

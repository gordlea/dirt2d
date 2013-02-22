var Graphics = createjs.Graphics;

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
    gend_x: null,
    gend_y: null,

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
        this.__bodyShape = new createjs.Shape();
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

        this.gend_x = 10+30 * Math.cos(this.__gunAngle);
        this.gend_y = -30 * Math.sin(this.__gunAngle);

        gg.lt(this.gend_x, this.gend_y);
        gg.es();
        this.__stage.addChild(this.__gunShape);
        this.__stage.update();

        this.drawn = true;

    },

    setGunAngleDegrees: function(degrees) {

        if (this.__gunShape !== null) {
            this.__stage.removeChild(this.__gunShape);
        }
        this.__gunAngle = degrees*Math.PI/180;

        this.__gunShape = new createjs.Shape();
        this.__gunShape.scaleX = this.scaleX;
        this.__gunShape.scaleY = this.scaleY;
        this.__gunShape.x = this.__position[0]*this.scaleX;
        this.__gunShape.y = this.__worldDimensions.y*this.scaleY - this.__position[1]*this.scaleY;
        var gg = this.__gunShape.graphics;
        gg.beginStroke(Graphics.getRGB(0,0,0)).setStrokeStyle(3*this.scaleX);
        gg.mt(10,0);

        this.gend_x = 10+30 * Math.cos(this.__gunAngle);
        this.gend_y = -30 * Math.sin(this.__gunAngle);

        gg.lt(this.gend_x, this.gend_y);
        gg.es();
        this.__stage.addChild(this.__gunShape);
        this.__stage.update();
    },


    fire: function() {
//        var gend_x = this.__gunShape.x + 10 + 30 * Math.cos(this.__gunAngle);
//        var gend_y = this.__gunShape.y + -30 * Math.sin(this.__gunAngle);


        var p = new Projectile(this.__stage, this.__gunAngle, 0.5, this.__position[0] + this.gend_x-2, this.__position[1]-this.gend_y, this.__worldDimensions);
        return p;
    }


});

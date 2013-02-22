var Projectile = dejavu.Class.declare({
    $name: 'Projectile',

    __stage: null,
    _initialAngle: null,
    _initialForce: null,
    x: null,
    y: null,
    scaleX: null,
    scaleY: null,
    drawn: null,
    __body: null,
    __physicsShape: null,
    __bodyShape: null,
    __worldDimensions: null,
    dead: null,
    initialize: function(stage, angle, force, x, y, dimensions) {
        this.__worldDimensions = dimensions;

        this.__stage = stage;
        this._initialAngle = angle;
        this._initialForce = force;
        this.x = x;
        this.y = y;
        this.drawn = false;

        this.__body = physSpace.addBody(new cp.Body(1, cp.momentForCircle(1, 0, 5, cp.v(0,0))));
        this.__body.setPos(v(this.x, this.y));
        this.__body.setAngle(this._initialAngle);
        this.__physicsShape = physSpace.addShape(new cp.CircleShape(this.__body, 5, v(0,0)));

        var ix = force*Math.cos(this._initialAngle);
        var iy = force*Math.sin(this._initialAngle);

        this.__body.applyImpulse(v(ix, iy), this.__body.local2World(cp.v(0,0)));

        this.dead = false;
    },

    updateScale: function (xs, ys) {
        this.scaleX = xs;
        this.scaleY = ys;
        if (this.drawn) {
//            console.log("updating scale");
            this.__bodyShape.scaleX = xs;
            this.__bodyShape.scaleY = ys;

            this.__bodyShape.x = this.__body.p.x*this.scaleX;
            this.__bodyShape.y = this.__worldDimensions.y*this.scaleY - this.__body.p.y*this.scaleY;

        }
        this.__stage.update();

    },

    draw: function() {
        this.__bodyShape = new Shape();
        this.__bodyShape.scaleX = this.scaleX;
        this.__bodyShape.scaleY = this.scaleY;
        this.__bodyShape.x = this.x*this.scaleX;
        this.__bodyShape.y = this.__worldDimensions.y*this.scaleY - this.y*this.scaleY;
        this.__bodyShape.graphics.beginStroke(Graphics.getRGB(0,0,0)).setStrokeStyle(3*this.scaleX);
        this.__bodyShape.graphics.beginFill(this.color);
        this.__bodyShape.graphics.rect(5, 5, -5, -5);
        this.__bodyShape.graphics.endStroke();
        this.__stage.addChild(this.__bodyShape);
        this.__stage.update();

        this.drawn = true;
    },

    tick: function() {
//         console.log("tick");
        if (this.drawn) {

            this.__bodyShape.x = this.__body.p.x*this.scaleX;
        this.__bodyShape.y = this.__worldDimensions.y*this.scaleY - this.__body.p.y*this.scaleY;
//            console.log("this.__bodyShape(%d,%d)", this.__bodyShape.x, this.__bodyShape.y)
            this.__stage.update();
                if (this.__bodyShape.x < -1000 || this.__bodyShape.x > 2000 || this.__bodyShape.y > 1440) {
                    this.dead = true;
                }
        }

    }
});
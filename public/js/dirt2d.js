var ground = null;
var width = null;
var height = null;

var space = new cp.Space();
space.gravity = v(0, -500);

var requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(callback) {
    return window.setTimeout(callback, 1000 / 60);
};

function start() {



    element = document.getElementById("canvas1");
    c = element.getContext("2d");

// read the width and height of the canvas
    width = element.width;
    height = element.height;



// create a new pixel array
    imageData = c.createImageData(width, height);



//    console.dir(line.toArray());

    drawTerrain(imageData, ground.array, height);
    c.putImageData(imageData, 0, 0); // at coords 0,0

}



function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

function drawTerrain(imageData, lineoutput, height) {

    for (var x = 0; x < lineoutput.length; x++){
        for (var y = 0; y < height; y++) {
            if (y > lineoutput[x]) {
                setPixel(imageData, x, y, 0, 255, 0, 255);
            } else {
                setPixel(imageData, x, y, 0, 0, 255, 255);
            }
        }
    }
}

function mpd() {
    console.log("mpding!!");

//    ground.divide();
//    console.dir(line.toArray());
    drawTerrain(imageData, ground.divide(), height);
    c.putImageData(imageData, 0, 0); // at coords 0,0

}

function boom() {
    var boom_x = width / 2;
    var boom_y = height /2;

    drawTerrain(imageData, ground.explosion(boom_x, boom_y, 10), height);
    c.putImageData(imageData, 0, 0); // at coords 0,0
}

function fireProjectile() {
    var mass = 4 * 4 * 1/1000;

    var rock = space.addBody(new cp.Body(mass, cp.momentForBox(mass, 4, 4)));
    rock.setPos(v(width/2, height/2));
    rock.setAngle(1);
    shape = space.addShape(new cp.BoxShape(rock, 4, 4));

    var ctx = c;

    var self = this;

    // Draw shapes
    ctx.strokeStyle = 'black';
    ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.font = "16px sans-serif";
    this.ctx.lineCap = 'round';

    this.space.eachShape(function(shape) {
        ctx.fillStyle = shape.style();
        shape.draw(ctx, self.scale, self.point2canvas);
    });

}
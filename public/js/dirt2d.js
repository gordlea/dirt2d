var ground = null;
var width = null;
var height = null;
function start() {
    element = document.getElementById("canvas1");
    c = element.getContext("2d");

// read the width and height of the canvas
    width = element.width;
    height = element.height;



// create a new pixel array
    imageData = c.createImageData(width, height);

    ground = new Ground({
        width: width,
        height: height
    });

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
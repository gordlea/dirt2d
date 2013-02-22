var r = 50;
var cx = view.viewSize.width/2;
var cy = view.viewSize.height/2;

var ground = new Path();
ground.strokeColor = "brown";
ground.fillColor = "brown";

ground.add(new Point(0, cy));
ground.add(new Point(cx*2, cy));
ground.add(new Point(cx*2, cy*2));
ground.add(new Point(0, cy*2));
ground.closePath();


var x1 = cx - cx/2;
var y1 = cy +cy/2 + 25;

var x2 = cx + cx/2;
var y2 = cy -cy/2 + 25

var circle = new Path.Circle(new Point(cx, cy), r);
circle.fillColor = 'yellow';

var line = new Path();
line.strokeColor = "black";

line.add(new Point(x1, y1));
line.add(new Point(x2, y2));




var someting = Intersection.intersectCircleLine(new Point2D(cx,cy), r, new Point2D(x1,y1), new Point2D(x2,y2));



console.dir(someting);




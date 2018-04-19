var animate =   window.requestAnimationFrame || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame || 
                function (callback) { window.setTimeout(callback, 1000 / 60) };


//defining the canvas area:
var canvas = document.createElement("canvas");
var canvasPadding = 15;
var canvasWidth = window.innerWidth - canvasPadding * 2;
var canvasHeight = window.innerHeight - canvasPadding * 2;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var context = canvas.getContext('2d');

var render = function () {
    context.fillStyle = "#eeeeee";
    context.fillRect(canvasPadding, canvasPadding, canvasWidth, canvasHeight); //creating the canvas with 15px padding
    circle.render();
};

//Getting the inputs from the generator form:
var currentShape = "circle";
var currentShapeColor = "green";
var circRadius = 40;
var squareWidth = 80;
var triangleBase = 80;

var circle = new Circle(canvasWidth * Math.random(), canvasHeight * 0.85); //x,y position of object's center

var update = function () {
    circle.update();
};

var step = function () {
    update();
    render();
    animate(step);
};


function Circle(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;  //vertical fall --> x_speed = 0, but we need this if we later want to add horizontal movement
    this.y_speed = -3;
}

Circle.prototype.render = function () {
    context.beginPath();
    context.lineWidth="5";
    context.strokeStyle=currentShapeColor;
    context.arc(this.x, this.y, circRadius, 2 * Math.PI, false); //x,y = center of object; 
    context.stroke();
};

Circle.prototype.update = function () {
    this.x += this.x_speed;
    this.y += this.y_speed;
    //defining the top left corner of the object:
    var topLeftX = this.x - circRadius;
    var topLeftY = this.y - circRadius;
    //defining the bottom right corner of the object:
    var bottomRightX = this.x + circRadius;
    var bottomRightY = this.y + circRadius;

    if (topLeftY < canvasPadding) {
        this.y = circRadius + canvasPadding;
        this.y_speed = 0;
    }

    //Handle hitting the horizontal borders
    if (topLeftX < canvasPadding) {
        this.x = circRadius;
        this.x_speed = 0;
    } else if (bottomRightX > canvasWidth + canvasPadding) {  //only one "padding", b/c we don't need the right padding
        this.x = canvasWidth + canvasPadding - circRadius;
        this.x_speed = 0;
    }
};

document.body.appendChild(canvas);
animate(step);
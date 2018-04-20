//Defining animation frame rate:
var animate =   window.requestAnimationFrame || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame || 
                function (callback) { window.setTimeout(callback, 1000 / 60) }; 

//Defining the canvas area:
var canvas = document.createElement("canvas");
var canvasPadding = 15;
canvas.width = window.innerWidth - canvasPadding * 2;;
canvas.height = window.innerHeight - canvasPadding * 2;
var context = canvas.getContext('2d');

//creating an array of shapes that grows as the user generates new ones:
var shapes = [];

document.getElementById("generate-button").addEventListener("click", generateNewShape);

function generateNewShape() {
	event.preventDefault();
	//Get the user's input for generating the new shape:
    var currentShape = 'circle';  //default
    var currentShapeColor = 'green';  //default
    document.getElementById('orange-radio').checked ? currentShapeColor = 'orange' : currentShapeColor = currentShapeColor;
    document.getElementById('blue-radio').checked ? currentShapeColor = 'blue' : currentShapeColor = currentShapeColor;
    document.getElementById('green-radio').checked ? currentShapeColor = 'green' : currentShapeColor = currentShapeColor;
    document.getElementById('square-radio').checked ? currentShape = 'square' : currentShape = currentShape;
    document.getElementById('triangle-radio').checked ? currentShape = 'triangle' : currentShape = currentShape;
    document.getElementById('circle-radio').checked ? currentShape = 'circle' : currentShape = currentShape;
    //setting other shape parameters:
    var maxShapeWidth = 60;
    var lineWidth = 3;
    var circRadius = maxShapeWidth / 2;
	var squareWidth = maxShapeWidth;
	var triangleBase = maxShapeWidth;
	var shapeAppearsAt_X = (canvas.width - 2 * maxShapeWidth) * Math.random() + maxShapeWidth;
	var shapeAppearsAt_Y = canvas.height * 0.85;
	//Creating new shape objects, based on user's selection:
	(currentShape == 'circle') ? shapes.push(new Circle(shapeAppearsAt_X, shapeAppearsAt_Y, circRadius, lineWidth, currentShapeColor)) : shapes = shapes;
	(currentShape == 'square') ? shapes.push(new Square(shapeAppearsAt_X, shapeAppearsAt_Y, squareWidth, lineWidth, currentShapeColor)) : shapes = shapes;
	(currentShape == 'triangle') ? shapes.push(new Triangle(shapeAppearsAt_X, shapeAppearsAt_Y, triangleBase, lineWidth, currentShapeColor)) : shapes = shapes;
}

//Defining the render and update functions for the animation. 
//"render" and "update" create the newly genrated images in their initial location on the canvas and updates them for each new frame
//They each use the methods defined inside the shape objects below
var render = function () {
    context.fillStyle = "white";
    context.fillRect(canvasPadding, canvasPadding, canvas.width, canvas.height); //creating the canvas with 15px padding
    for (item of shapes) { item.render() };
};

var update = function () {
    for (item of shapes) { item.update() };
};

//"step" is a function that calls itslef for conintues rendering of the next frame of the animation. It is used by "animate" below
var step = function () {
    update();
    render();
    animate(step);
};

document.body.appendChild(canvas);
animate(step);



//DEFINING THE SHAPE OBJECTS AND THEIR BEHAVIOR:
//Defining the Circle Object:
function Circle(x, y, radius, borderWidth, color) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;  //vertical fall --> x_speed = 0, but we need this if we later want to add horizontal movement
    this.y_speed = -3;
	this.render = function () {
    	context.beginPath();
	    context.lineWidth = borderWidth; //string, example: "5"
	    context.strokeStyle = color;
	    context.arc(this.x, this.y, radius, 2 * Math.PI, false); //x,y = center of object; 
	    context.stroke();
	};
	this.update = function () {
	    this.x += this.x_speed;
	    this.y += this.y_speed;
	    //defining the top left corner of the object:
	    var topLeftX = this.x - radius;
	    var topLeftY = this.y - radius;
	    //defining the bottom right corner of the object:
	    var bottomRightX = this.x + radius;
	    var bottomRightY = this.y + radius;

	    if (topLeftY <= canvasPadding) {
	        this.y = radius + canvasPadding + borderWidth;
	        this.y_speed = 0;
	    }
	    //Handle hitting the vertical borders
	    if (topLeftX <= canvasPadding) {
	        this.x = radius * 2 + borderWidth * 2;
	        this.x_speed = 0;
	    } else if (bottomRightX >= canvas.width - borderWidth * 2 ) {  //only one "padding", b/c we don't need the right padding
	        this.x = canvas.width - radius * 2 - borderWidth * 2;
	        this.x_speed = 0;
	    }
	    for (pixel of context.getImageData(topLeftX, topLeftY - borderWidth, radius * 2, 1).data) {
	    	if (pixel != 255) {
	    		this.y_speed = 0;
	    	}
	    }
	};
}

//Defining the Square Object:
function Square(x, y, squareWidth, borderWidth, color) {
    this.x = x - squareWidth / 2; //for a square, x, y is the top left corner (unlike circle), so need to adjust
    this.y = y - squareWidth / 2;
    this.x_speed = 0;  //vertical fall --> x_speed = 0, but we need this if we later want to add horizontal movement
    this.y_speed = -3;

    this.render = function () {
	    context.beginPath();
	    context.lineWidth = borderWidth; //string, example: "5"
	    context.strokeStyle = color;
	    context.rect(this.x, this.y,squareWidth,squareWidth, false); //x,y = top left corner of object; 
	    context.stroke();
	};
	this.update = function () {
	    this.x += this.x_speed;
	    this.y += this.y_speed;
	    //defining the top left corner of the object (for a square this is straightforward, ulike circle)
	    var topLeftX = this.x;
	    var topLeftY = this.y;
	    //defining the bottom right corner of the object:
	    var bottomRightX = this.x + squareWidth;
	    var bottomRightY = this.y + squareWidth;

	    if (topLeftY <= canvasPadding) {
	        this.y = canvasPadding + borderWidth;
	        this.y_speed = 0;
	        console.log(this.x, this.y)
	    }
	    //Handle hitting the vertical borders
	    if (topLeftX <= canvasPadding) {
	        this.x = canvasPadding + borderWidth * 2;
	        this.x_speed = 0;
	    } else if (bottomRightX >= canvas.width - borderWidth * 2 ) {  //only one "padding", b/c we don't need the right padding
	        this.x = canvas.width - squareWidth - borderWidth * 2;
	        this.x_speed = 0;
	    }
	    //Check if there is anything in front of the moving object (look at 1-pixel line in front of the object):
	    for (pixel of context.getImageData(topLeftX, topLeftY - borderWidth, squareWidth, 1).data) {
	    	if (pixel != 255) {
	    		this.y_speed = 0;
	    	}
	    }
	};
}

//Defining the Triangle Object:
function Triangle(x, y, triangleBase, borderWidth, color) {
    this.x = x; //for a triangle, x, y is the top left corner (unlike circle), so need to adjust
    this.y = y;
    this.x_speed = 0;  //vertical fall --> x_speed = 0, but we need this if we later want to add horizontal movement
    this.y_speed = -3;
    this.render = function () {
    	context.beginPath();
    	context.lineWidth = borderWidth; //string, example: "5"
	    context.strokeStyle = color;
		context.moveTo(this.x, this.y);
		context.lineTo(this.x + triangleBase, this.y);
		context.lineTo(this.x + triangleBase / 2, this.y + (triangleBase / 2) * (3 ** (1/2)));
		context.closePath();
	    context.stroke();
	};
	this.update = function () {
	    this.x += this.x_speed;
	    this.y += this.y_speed;
	    //defining the top left corner of the object (for a square this is straightforward, unlike circle)
	    var topLeftX = this.x;
	    var topLeftY = this.y;
	    //defining the bottom right corner of the object:
	    var bottomRightX = this.x + triangleBase;
	    var bottomRightY = this.y + (triangleBase / 2) * (3 ** (1/2));
	    if (topLeftY <= canvasPadding) {
	        this.y = canvasPadding + borderWidth;
	        this.y_speed = 0;
	    }
	    //Handle hitting the vertical borders
	    if (topLeftX <= canvasPadding) {
	        this.x = canvasPadding + borderWidth * 2;
	        this.x_speed = 0;
	    } else if (bottomRightX >= canvas.width - borderWidth * 2 ) {  
	        this.x = canvas.width - triangleBase - borderWidth * 2;
	        this.x_speed = 0;
	    }
	   	//Check if there is anything in front of the moving object (look at 1-pixel line in front of the object):
	    for (pixel of context.getImageData(topLeftX, topLeftY - borderWidth, triangleBase, 1).data) {
	    	if (pixel != 255) {
	    		this.y_speed = 0;
	    	}
	    }
	};
}

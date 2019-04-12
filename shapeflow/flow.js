// Set global variables that are needed throughout the program.
// A list of balls on the screen.
let balls;
// variables needed for the physics engines.
let world, engine;
// A variable to start the simulation
let play;
// set the current sound variable to play only one sound at a time.
let collisionBall;
let maxBallR;

// Set up the general components for the simulation.
function setup(){
	// play is false. Simulation needs to be started by the player.
	play = false;
	// Start the physics engine.
	engine = Matter.Engine.create();
	// Create the world for the physics engine.
	world = engine.world;
	// Set the gravity level for the elements.
	engine.world.gravity.y = 0.004; 
	
	// Draw canvas for the screen. Set it to the a little smaller than the size of the window.
	cnv = createCanvas(windowWidth-25,windowHeight-25);
	
	// Set the frame rate of the simulation. 
	frameRate(30);
	
	// Maximum size of ball on the screen. 
	maxBallR = 20;
	
	// Create a list of balls to draw.
	balls = new Balls();

	// Create the boundaries of the canvas. Without this, the balls just fall off the screen.
	leftWall = new Border(-25,height/2,50,height);
	rightWall = new Border(width,height/2,50,height);
	ceiling = new Border(width/2,-25,width,50);
	floor = new Border(width/2, height+25, width, 50);
	
	
	// Get the mouse for interacting with the simulation.
	const mouse = Matter.Mouse.create(canvas.elt);
	const options = {
		mouse: mouse
	}
	
	// Have mouse clicks interact with the world.
	mConstraint = Matter.MouseConstraint.create(engine, options);
	Matter.World.add(world,mConstraint);
	
	
}
// Function that loops to create elements and interact with the world.
function draw() {
	
	// Set the background color of the canvas.
	background(0);
	// Call the update function of the Balls class to move the simulation forward.
	balls.update();
	// put the borders around the screen.
	leftWall.show();
	rightWall.show();
	ceiling.show();
	floor.show();
	// Step forward in the physics engine.
	Matter.Engine.update(engine);
	
}

// Function to build the list of balls with appropriate mass and physics.
function Balls(){
	// An empty array of balls.
	var list = new Array();
	
	// Get a random number of balls that's not too big to fill up the screen.
	tempH = windowHeight / (maxBallR*2);
	tempW = windowWidth / (maxBallR*2);
	minNum = Math.floor(tempH * tempW * 0.5);
	maxNum = Math.floor(tempH * tempW * 0.85);
	ranNum = Math.floor(random(minNum, maxNum));
	if (ranNum > 1000){
		ranNum = 1000;
	}
	var maxBall = 0;
	// create a ball up to the random number integer.
	for (var i = 0; i < ranNum; i++){
		
		// get another random number for size.
		r = random(Math.floor(maxBallR/6),maxBallR)+1;

		// Set positions of the ball on the screen starting from top left. Keep starting position out of the borders.
		xPos = random(r,width-(r*2));
		yPos = random(r,height/(random(1,200)/100)-(r*2));
		// Set the colors of the balls in Red Green Blue format. 
		red = random(50,255);
		green = random(25,255);
		blue = random(150,255);
		// Set the mass of the ball.
		mass = random(50,100)/100;
		tempBall = new Ball(xPos,yPos,r,red,green,blue,mass,i);
		// Add this ball to the Balls array.
		list.push(tempBall);
	}
	collisionBall = new Ball(windowWidth/2, windowHeight/2, maxBallR * 2, 255,255,255, .8);
	list.push(collisionBall);
	// Function to update the position of the balls.
	this.update = function(){
		// Go through each ball in the array and update it.
		for (var i = 0; i < list.length; i++){
			list[i].update();
			list[i].show();
			// Check to see if there is a collision.
			checkCollisions(list[i], list);
			list[i].hit = false;
		}
	}
}

// Create the borders of the screen.
function Border(x, y, w, h){
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.body = Matter.Bodies.rectangle(x, y,this.width,this.height);
	this.body.isStatic = true;
	// Add this element to the world for the physics engine to see.
	Matter.World.add(world, this.body);
	// Function to draw this in the world.
	this.show = function(){
		rectMode(CENTER);
		const pos = this.body.position;
		fill(0);
		rect(this.x, this.y, this.width, this.height);
	}
}

// Each ball object 
function Ball(x,y,r,red, green, blue, mass, listSpot){
	// The location of the ball in the balls list. Track for spontaneous moves.
	this.listSpot = listSpot;
	// Position on the screen.
	this.x = x;
	this.y = y;
	// Radius
	this.r = r;
	// Colors
	this.red = red;
	this.green = green;
	this.blue = blue;
	// Mass: set for physics engine. 
	this.mass = mass;
	// Create the object in the physics engine.
	this.body = Matter.Bodies.circle(x,y,r);
	// Restitution is the amount of "bounce" or reaction the object has.
	this.body.restitution = .7;
	// How dense the object is in the physics engine. 
	this.body.setDensity = this.r*1.25;
	// The friction this body has in the world. How fast it slows down.
	this.body.friction = .00005;
	// Have some of the bodies be moving when it starts. Set to 10%.
	if (random(0,100) > 90){
		// Add the velocity to the object in the physics engine.
		Matter.Body.setVelocity(this.body, {x: random(-10,10), y: random(-10,10)});
	}
	
	// Add this object to the world. 
	Matter.World.add(world, this.body);
	
	// Function to update the position of the ball on the canvas.
	this.update = function(){
		// Create odds for the ball to move based on location. Heavier for low visibility.

		var odds = 9998;
		var maxV = maxBallR;
		var minV = maxBallR * 0.2;


		// ON rare occasions, but not that rare considering each ball is looped through 30 times a second, give this body a random velocity.
		if (random(0,10000) > odds && this.body.angularSpeed < .0005){
			// Add the velocity to the body.
			Matter.Body.setVelocity(this.body, {x: random(maxV*.4*-1,maxV), y: random(maxV*.4*-1,maxV)});	
		}

	}
	// Function to show the updated objects in the world.
	this.show = function(){
		// Get the location from the physics engine.
		const pos = this.body.position;
		// Create the object on the canvas and give it a color.
		fill(this.red,this.green, this.blue);
		// Position the object.
		circle(pos.x, pos.y, this.r);
		// update ball position variables from the engine to have for collision check.
		this.x = pos.x;
		this.y = pos.y;
	}
}
// Check for collisions.
function checkCollisions(ball,list){
	// Variables needed for the check.
	var a;
	var x;
	var y;
	// Check this object against all the other balls.
	for (var i = 0; i < list.length; i++){
		// if this isn't the same ball.
		if (ball.x != list[i].x && ball.y != list[i].y && !list[i].hit){
			// add the radius of the two balls.
			a = ball.r + list[i].r;
			// find the relative x position.
			x = ball.x - list[i].x;
			// find the relative y position.
			y = ball.y - list[i].y;
			// set maximum radius and velocity to the larger and faster object.
			if (a > Math.sqrt((x*x)+(y*y))){
				var maxR = max(ball.r,list[i].r);
				var maxV = max(ball.angularVelocity, list[i].angularVelocity);
				list[i].hit = true;
				ball.hit = true;
			}
		}
	}

}
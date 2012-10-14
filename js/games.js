window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
} )();

var canvas;
var ctx;
var W;
var H;
var ball = {};
var paddles = [2];
var mouse = {};
var fps = 60;
var multipler = 1;
var startBtn = {};
var restartBtn = {};
var over = 0;
var init;
var paddleHit;
var p2s = 0;
var p1s = 0;
var left1 = false, left2 = false, right1 = false, right2 = false;


function varInit() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	W = window.innerWidth - 100;
	H = window.innerHeight - 100;

	canvas.width = W;
	canvas.height = H;

	canvas.addEventListener("mousemove", trackPosition, true);
	canvas.addEventListener("onkeydown", keystrokes, true);

	paddles.push(new Paddle("bottom"));
	paddles.push(new Paddle("top"));

	ball.x = W/2;
	ball.y = H/2;
	ball.vx = (Math.random() > .5) ? 4 : -4;
	ball.vy = (Math.random() > .5) ? 8 : -8;
		
}

function keystrokes(e) {
	switch(e.keyCode) {
		case 37: paddle[1].x += 20;
			break;
		case 39: right1 = true;
			break;
	}
}

function paintCanvas() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, W, H);
}

function Paddle(pos) {
	this.h = 10;
	this.w = W/8;
	
	this.x = W/2 - this.w/2;
	this.y = (pos == "top") ? 0 + 10: H - this.h - 10;
	
}

ball = {
	x: 50,
	y: 50, 
	r: 5,
	c: "white",
	vx: 4,
	vy: 8,
	
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
	},
	reset: function(p) {
		this.x = W/2;
		this.y = H/2;
		if (p) {
			ball.vy = (Math.random() > .5) ? 8 : -8;
		}
		ball.vx = (Math.random() > .5) ? 4 : -4;
	}
};
function draw() {
	paintCanvas();
	for(var i = 0; i < paddles.length; i++) {
		p = paddles[i];
		
		ctx.fillStyle = "white";
		ctx.fillRect(p.x, p.y, p.w, p.h);
	}
	
	ball.draw();
	update();
}

function increaseSpd() {
	if(p1s + p2s % 4 == 0) {
		if(Math.abs(ball.vx) < 15) {
			ball.vx += (ball.vx < 0) ? -1 : 1;
			ball.vy += (ball.vy < 0) ? -2 : 2;
		}
	}
}

function trackPosition(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}

function update() {
	
	// Update scores
	updateScore(); 
	
	// Move the paddles on mouse move
	if(left1 == true && paddle[1].x > W) {
		paddle[1].x -= W/100;
	}
	if (right1 == true && paddle[1].x < W) {
		paddle[1].x -= W/100
	}
	
	ball.x += ball.vx;
	ball.y += ball.vy;
	
	ballCollision()
	left1 = false;
	left2 = false;
	right1 = false;
	right2 = false;
}

function ballCollision() {
	p1 = paddles[1];
	p2 = paddles[2];
	if(collides(ball, p1)) {
		collideAction(ball, p1);
	}
	
	
	else if(collides(ball, p2)) {
		collideAction(ball, p2);
	} 
	
	else {
		if(ball.y + ball.r >= H) {
			p2s++;
			ball.reset(false);
		} 
		
		else if(ball.y <= 0) {
			p1s++;
			ball.reset(true);
		}

		if(ball.x + ball.r > W) {
			ball.vx = -ball.vx;
			ball.x = W - ball.r;
		}
		
		else if(ball.x -ball.r < 0) {
			ball.vx = -ball.vx;
			ball.x = ball.r;
		}
	}
}

function collides(b, p) {
	if(b.x + ball.r >= p.x && b.x - ball.r <=p.x + p.w) {
		if(b.y >= (p.y - p.h) && p.y > 0){
			paddleHit = 1;
			return true;
		}
		
		else if(b.y <= p.h && p.y == 0) {
			paddleHit = 2;
			return true;
		}
		
		else return false;
	}
}

function collideAction(ball, p) {
	ball.vy = -ball.vy;
	
	if(paddleHit == 1) {
		ball.y = p.y - p.h;
	}
	
	else if(paddleHit == 2) {
		ball.y = p.h + ball.r;
	}
	
	increaseSpd();
	
	
}
// Function for updating score
function updateScore() {
	ctx.fillStlye = "white";
	ctx.font = "16px Arial, sans-serif";
	ctx.fillText("Player 1 Score: " + p1s, 0, 0 );
	ctx.fillText("Player 2 Score: " + p2s, 20, 0 );
}

// Function to run when the game overs
function gameOver() {
	ctx.fillStlye = "white";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over - You scored "+points+" points!", W/2, H/2 + 25 );
	
	// Stop the Animation
	cancelRequestAnimFrame(init);
	
	// Set the over flag
	over = 1;
	
	// Show the restart button
	restartBtn.draw();
}

// Function for running the whole animation
function animloop() {
	init = requestAnimFrame(animloop);
	draw();
}

// Function to execute at startup
function startScreen() {
	varInit();
	animloop();
}


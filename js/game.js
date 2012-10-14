window.requestAnimFrame = (function(){ return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function( callback ){ return window.setTimeout(callback, 1000 / 60); }; })();
window.cancelRequestAnimFrame = ( function() { return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout })();

var canvas;
var ctx;
var W = window.innerWidth - 100;
var H = window.innerHeight - 100;
var v = W / 100;
var ball = {};
var paddles = [2];
var p1 = 0;
var p2 = 0;
var key = [0,0,0,0];
ball = {
	x: W/2, y: H/2, r: 5, c: "white", vx: -4, vy: 8,
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
	},
	reset: function(p) {
		this.x = W/2;
		this.y = H/2
		this.vx = (Math.random > .5) ? 4 : -4;
		if (p) {
			this.vy = 8;
		}
		else {
			this.vy = -8;
		}
	}
		
};

function Paddle(pos) {
	this.h = 10; this.w = W/9;
	this.x = W/2 - this.w/2;
	this.y = (pos == "top") ? 15 : H - this.h - 15;
}

function paintCanvas() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, W, H);
}

function draw(){ 
	paintCanvas();
	for (var i = 0; i < paddles.length; i++) {
		p = paddles[i];
		ctx.fillStyle = "white";
		ctx.fillRect(p.x, p.y, p.w, p.h);
	}
	ball.draw();
	drawText();
}

function drawText() {
	ctx.fillStyle = "white";
	ctx.font = "20px Arial,	sans-serif";
	ctx.fillText("Player 1: " + p1, 20, 30);
	ctx.fillText("Player 2: " + p2, 20, H - 20);
}

function loop() {
	requestAnimFrame(loop);
	draw();
	update();
}

function update() {
	paddleMode();
	ballCollision();
	paddleCollision();
}

function paddleMode() {
	if (key[2] == 1) {
		if (paddles[1].x + paddles[1].w < W) {
			paddles[1].x += v;
		}
	}
	if (key[1] == 1) {
		if (paddles[1].x > 3) { 
			paddles[1].x -= v;
		}
	}
	if (key[4] == 1) {
		if (paddles[2].x + paddles[2].w < W) {
			paddles[2].x += v;
		}
	}
	if (key[3] == 1) {
		if (paddles[2].x > 3) { 
			paddles[2].x -= v;
		}
	}
}

function paddleCollision() {
	if(collides(ball, paddles[1], 1)) {
 	   ball.vy = -ball.vy;
	}
	else if(collides(ball, paddles[2], 2)) {
 	   ball.vy = -ball.vy;
	} 
}

function ballCollision() {
	ball.x += ball.vx;
	ball.y += ball.vy;
	if(ball.y + ball.r > H) {
		ball.y = H - ball.r;
		p1++;
		ball.reset(true);
	}
	else if (ball.y < 0) { 
		ball.y = ball.r;
		p2++;
		ball.reset(false);
	}
	if (ball.x - ball.r < 0) {
		ball.vx *= -1;
		ball.x = ball.r;
	}
	else if (ball.x + ball.r > W) {
		ball.vx *= -1;
		ball.x = W - ball.r;
	}
}

function collides(b, p, pn) {
	if (b.x + ball.r >= p.x && b.x - ball.r <= p.x + p.w) {
		if (pn == 1 && b.y >= (p.y - p.h)) 
			return true;
		
		else if (pn == 2 && b.y <= (p.y + p.h))
			return true;
		
	}
	return false;
}

function keydown(evt) {
	switch (evt.keyCode) {
	case 37:key[1] = 1;
		break;
	case 39:key[2] = 1;
		break;
	case 65:key[3] = 1;
		break;
	case 68:key[4] = 1;
		break;
	}
}

function keyup(evt) {
	switch (evt.keyCode) {
	case 37:key[1] = 0;
		break;
	case 39:key[2] = 0;
		break;
	case 65:key[3] = 0;
		break;
	case 68:key[4] = 0;
		break;
	}
}

function startPong() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	ctx.fillRect(0, 0, W, H);

	canvas.width = W;
	canvas.height = H;

	paddles.push(new Paddle("bottom"));
	paddles.push(new Paddle("top"));
	window.addEventListener('keydown', keydown, true);
	window.addEventListener('keyup', keyup, true);
	loop();
}
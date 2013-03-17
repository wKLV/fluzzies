function Sprite(x, y){
	this.x = x || 50, this.y = y || 50;
}

Sprite.prototype = new Paintable();
Sprite.prototype.constructor = Sprite;

Sprite.prototype.size = function(x,y){
	this.x = x, this.y = y;
	return this;
}

Sprite.prototype.paintTo = function(context){
	context.scale(this.scale(), this.scale());
	context.translate(this.getPos().x, this.getPos().y);
	context.rotate(this.rotation());
	context.fillStyle = this.fill();
	context.fillRect(0, 0, this.x, this.y);
	context.strokeStyle = this.stroke();
	context.strokeRect(0, 0, this.x, this.y);
	context.rotate(-this.rotation());
	context.translate(-this.getPos().x, -this.getPos().y)
	context.scale(1/this.scale(), 1/this.scale());
}

function Circle(r, lineWidth){
 this.r = r || 50, this.width = lineWidth || 2;
}

Circle.prototype = new Paintable();
Circle.prototype.constructor = Circle;

Circle.prototype.paintTo = function(context){
	context.scale(this.scale(), this.scale());
	context.translate(this.getPos().x, this.getPos().y);
	context.rotate(this.rotation());
  context.beginPath()
  context.arc(0, 0, this.r, 0, 2 * Math.PI, false);
	context.fillStyle = this.fill();
	context.fill();
	context.lineWidth = this.width;
	context.strokeStyle = this.stroke();
	context.stroke();
	context.rotate(-this.rotation());
	context.translate(-this.getPos().x, -this.getPos().y)
	context.scale(1/this.scale(), 1/this.scale());
}

function Polygon(shape, lineWidth){
 this.shape = shape || [new v2(-1,0), new v2(1,0), new v2(0,1)], this.width = lineWidth || 2;
}

Polygon.prototype = new Paintable();
Polygon.prototype.constructor = Polygon;

Polygon.prototype.paintTo = function(context){
	context.scale(this.scale(), this.scale());
	context.translate(this.getPos().x, this.getPos().y);
	context.rotate(this.rotation());
  context.beginPath()
  for (var i in this.shape){
		context.lineTo(this.shape[i].x, this.shape[i].y);
	}
	context.closePath();
	context.fillStyle = this.fill();
	context.fill();
	context.lineWidth = this.width;
	context.strokeStyle = this.stroke();
	context.stroke();
	context.rotate(-this.rotation());
	context.translate(-this.getPos().x, -this.getPos().y)
	context.scale(1/this.scale(), 1/this.scale());
}


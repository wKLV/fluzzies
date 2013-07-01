// Basic simple shapes. All fillable

function Rect(x, y){
	this._size = new v2(x ||50,y || 50);
}

Rect.prototype = new Paintable();
Rect.prototype.constructor = Rect;

Rect.prototype.size = function(x,y){
	if(typeof x === "undefined") return this._size;
	this._size = new v2(x, y);
	return this;
}

Rect.prototype.region = function(){
	if (arguments.length) console.log("you can't overwrite the region of a rectangle");
	var t = this;
	return new rRect(function(){return v2.scalar(-0.5,  t._size).add(t.getAbsPos())}, function(){return t._size});
}

Rect.prototype.paintTo = function(context){
	context.scale(this.scale(), this.scale());
	context.translate(this.getPos().x, this.getPos().y);
	context.rotate(this.rotation());
	context.fillStyle = this.fill();
	context.fillRect(-this.size().x/2, -this.size().y/2, this.size().x, this.size().y);
	context.strokeStyle = this.stroke();
	context.strokeRect(-this.size().x/2, -this.size().y/2, this.size().x, this.size().y);
	context.rotate(-this.rotation());
	context.translate(-this.getPos().x, -this.getPos().y)
	context.scale(1/this.scale(), 1/this.scale());
}

function Circle(r, lineWidth){
 this.r = r || 50, this.width = lineWidth || 2;
}

Circle.prototype = new Paintable();
Circle.prototype.constructor = Circle;

Circle.prototype.radius = function(r){
    if(typeof r === "undefined") return this.r;
    else this.r = r;
    return this;
}

Circle.prototype.region = function(){
	if (arguments.length) console.log("you can't overwrite the region of a circle");
	var t = this;
	return new rCirc(function(){return t.getAbsPos()}, t.r);
}

Circle.prototype.paintTo = function(context){
	context.translate(this.getPos().x, this.getPos().y);
	context.rotate(this.rotation());
	context.scale(this.scale(), this.scale());
    context.beginPath()
    context.arc(0, 0, this.r, 0, 1/0.5*Math.PI, false);
	context.fillStyle = this.fill();
	context.fill();
	context.lineWidth = this.width;
	context.strokeStyle = this.stroke();
	context.stroke();
	context.scale(1/this.scale(), 1/this.scale());
	context.rotate(-this.rotation());
	context.translate(-this.getPos().x, -this.getPos().y)
}

function Polygon(shape, lineWidth){
 this.shape = shape || [new v2(-1,0), new v2(1,0), new v2(0,1)], this.width = lineWidth || 2;
}

Polygon.prototype = new Paintable();
Polygon.prototype.constructor = Polygon;

Polygon.prototype.paintTo = function(context){
	context.translate(this.getPos().x, this.getPos().y);
	context.rotate(this.rotation());
	context.scale(this.scale(), this.scale());
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
	context.scale(1/this.scale(), 1/this.scale());
	context.rotate(-this.rotation());
	context.translate(-this.getPos().x, -this.getPos().y)
}

function Label(text){
 this._text = text || "Hello world";
}

Label.prototype = new Paintable();
Label.prototype.constructor = Label;

Label.prototype.text = function(t){
    if(typeof t === "undefined")
        return this._text
    else this._text = t;
    return this;
}

Label.prototype.paintTo = function(context){
	context.translate(this.getPos().x, this.getPos().y);
	context.rotate(this.rotation());
	context.scale(this.scale(), this.scale());
	context.fillStyle = this.fill();
	context.fillText(this._text,0,0)
	context.strokeStyle = this.stroke();
	context.strokeText(this._text,0,0);
	context.scale(1/this.scale(), 1/this.scale());
	context.rotate(-this.rotation());
	context.translate(-this.getPos().x, -this.getPos().y)
}



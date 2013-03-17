var IDS = 0;

function muu2d(){
	var ids = 0;

	var callback = function(){};

	var canvas = [];
	this.addCanvas = function(canv, dinamic){
			var canv;
			if(typeof canv === "string")
				canv = document.getElementById(canv);
			else { console.log("not a canvas id"); return false;} ;
			var root = new Layer;
			canvas.push({root: root, canvas:canv, dinamic:dinamic});
			return root;
	};
	this.render = function(){
		for(var i in canvas) if(canvas[i].dinamic){
			var root = canvas[i].root;
			root.paintTo(canvas[i].canvas.getContext("2d"));
		}
	};
	this.renderAll = function(){
		for(var i in canvas){
			var root = canvas[i].root;
			root.paintTo(canvas[i].canvas.getContext("2d"));
		}
	};
}


function v2 (x,y){
	this.x = x || 0, this.y = y || 0;
}

v2.add = function(x,y){
		var tx = this.x || 0, ty = this.y || 0;
		if(x instanceof v2){
			if(typeof this.x === "undefined" && y instanceof v2)
				tx = x.x +y.x, ty = x.y+ y.y;
			else tx += x.x,	ty += x.y;
		}
		else {
			tx += x;
			ty  += y;
		}
	if(typeof this.x === "undefined")
		return new v2(tx, ty);
	return this;
}
v2.prototype.add =  v2.add

v2.minus = function(v){
	if(this.x === "undefined")
		return new v2(-v.x, -v.y)
	else
		this.x = - this.x, this.y = -this.y
	return this;
}

v2.prototype.minus = v2.minus

v2.prototype.dot = function(x,y){
		if(x instanceof v2)
			return this.x *x.x + this.y+ x.y;	
		else return this.x*x+this.y*y
	}
	this.lenSquared = function(){
		return this.dot(this);
	}
v2.prototype.len = function (){
		return Math.sqrt(this.lenSquared);
	}
v2.prototype.norm = function(){
		var l = this.len();
		return new v2(this.x/l, this.y/l);
	}



function muuNode (){
	this.id = IDS;
	IDS ++;
	this.parent = false;
	this.position = new v2();
	this._rotation = 0;
	this._scale = 1;
	this.events; // TODO
}

muuNode.prototype.moveTo = function(pos, y){
	if(pos instanceof v2) this.position = pos;
	else this.position = new v2(pos, y);
	return this;
}

muuNode.prototype.getPos = function(){
	return this.position;
}

muuNode.prototype.getAbsPos = function(){
	if(this.parent) return new v2.add(this.getPos(), this.parent.getAbsPos());
	else return this.getPos();
}

muuNode.prototype.rotation = function(angle){
	if(typeof angle === "undefined") return this._rotation 
	else this._rotation = angle
	return this;
}

muuNode.prototype.scale = function(scale){
	if(typeof scale === "undefined") return this._scale 
	else this._scale = scale
	return this;
}

function Layer (){
	this.objects = [];
}

Layer.prototype = new muuNode();
Layer.prototype.constructor = Layer;

Layer.prototype.add = function(nod){
	nod.parent = this;
	this.objects.push(nod);
	return this;
}

Layer.prototype.rem =function(nod){
	nod.parent = false;
	this.objects.splice(objects.indexOf(nod),1);
	return this;
}

Layer.prototype.paintTo = function(context){ 
	context.scale(this.scale(), this.scale());
	context.translate(this.getPos().x, this.getPos().y);
	context.rotate(this.rotation());
	for(var i in this.objects){
		var obj = this.objects[i];
		if(obj instanceof Layer)
			obj.paintTo(context);
		else
			obj.paintTo(context);
	}
  context.rotate(-this.rotation());
	context.translate(v2.minus(this.getPos()))
	context.scale(1/this.scale(), 1/this.scale());
}

function Paintable(){
	this._fill = "rgb(0,0,0)";
	this._stroke = "rgb(0,0,0)";
	this.paintTo = function(canvas){}; // it needs to be overwriten by parent
}

Paintable.prototype = new muuNode();
Paintable.constructor = Paintable;

Paintable.prototype.fill = function(fill){
	if(typeof fill === "undefined") return this._fill;
	else this._fill = fill;
	return this;
}

Paintable.prototype.stroke= function(stro){
	if(typeof stro === "undefined") return this._stroke;
	else this._stroke = stro;
	return this;
}

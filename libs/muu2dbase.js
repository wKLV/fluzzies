// List of callbacks when event happen
var muuEVENTS = {
	"mousemove":[],
	"mousedown":[],
	"mouseup":[]
};

// This is the function that will be called when
function _muucheckEvent(type){ return function(ev){
	for(var i in muuEVENTS[type]){
		var e = muuEVENTS[type][i]
		if(e.region.checkIn((ev.clientX ? ev.clientX : ev.layerX)*resize, (ev.clientY ? ev.clientY : ev.layerY)*resize)){
		    ev.preventDefault();
            e.callback(ev, e.object);
        }
	}
}}
// The main object that handles the canvas on screen and resources
var muu = new function (){
	var atlass = {}; // The atlas loades
	var sprites = {}; // The sprites processed
	var ready = 0; // How many files to load to begin
	var readycallbacks = []; // When ready hits 0 what to call

	var canvas = []; // The list of canvas to draw on
	var mouse = new muuNode; // The mouse as a node to track its position
    // canv: the id of the canvas. dinamic: wheter it should be called each time we say render or renderAll
	this.addCanvas = function(canv, dinamic){
			var canv;
			if(typeof canv === "string")
				canv = document.getElementById(canv);
			else { throw "not a canvas id"; return false;} ;
			// add listeners to each canvas
            canv.onmousemove = function(ev){
                // Move the mouse to its position every time we get it
                mouse.moveTo((ev.clientX ? ev.clientX : ev.layerX)*resize, (ev.clientY ? ev.clientY : ev.layerY)*resize);
				 _muucheckEvent("mousemove")(ev)
			};
			canv.onmousedown = _muucheckEvent("mousedown");
			canv.onmouseup = _muucheckEvent("mouseup");

			var root = new Layer; //The root layer of all the canvas
			root.render = function(){ //render this canvas
				canv.getContext("2d").clearRect(0,0,canv.width, canv.height); //First we clean the previous state
				root.paintTo(canv.getContext("2d")) //Now we paint using layer function
			};
            root.context = canv.getContext("2d");
            root.dinamic = dinamic;
			canvas.push({root: root, canvas:canv, dinamic:dinamic});
			return root;
	};
    // A normal render that will only render dynamic canvas
	this.render = function(){
		for(var i in canvas) if(canvas[i].dinamic){
			var root = canvas[i].root;
			root.render();
		}
	};
    // A render for all the canvas
	this.renderAll = function(){
		for(var i in canvas){
			var root = canvas[i].root;
			root.render();
		}
	};
	this.getMouse = function(){ return mouse};
	// An atlas in muu2d consists of two files, a image and a json to process it
    this.addAtlas = function(graphics, data){
		ready ++;
		var request = new XMLHttpRequest();
		request.open("GET", data, true);
		request.onload = function(){
			ready++;
			var img = new Image();
			img.onload = function(){
				atlass[data].image = img;
				ready--; if(ready === 0) for(var i in readycallbacks) readycallbacks[i]();
			}
			img.src = graphics;
			dat = JSON.parse(this.responseText);
			atlass[data] = {image:null, sprites:{}}
			function createSprite(name){
				var sprite = {origin:data, position:dat[name].position, size:dat[name].size, name:name}; // A simple sprite object
                sprite.paintTo = function(context, size){
					context.drawImage(atlass[data].image, sprite.position.x, sprite.position.y, sprite.size.x, sprite.size.y, 0, 0, size.x, size.y);
				}
				sprites[i] = sprite;
			}
			for(var i in dat) createSprite(i);
			ready --; if(ready === 0) for(var i in readycallbacks) readycallbacks[i]();
		}
		request.send();
	}
	this.getSprite = function(name){
		return sprites[name];
	}
	this.whenReady = function(callback){
		readycallbacks.push(callback);
	}
}()

// Basic vector library
function v2 (x,y){
	this.x = x || 0, this.y = y || 0;
}

v2.add = function(x,y){
		var tx = this.x || 0, ty = this.y || 0;
		if(x instanceof v2){
			if(y instanceof v2)
				tx = x.x +y.x, ty = x.y+ y.y;
			else tx += x.x, ty += x.y;
		}
		else {
			tx += x;
			ty  += y;
		}
	if(typeof this.x === "undefined" ||  isNaN(this.x))
		return new v2(tx, ty);
	else this.x = tx, this.y = ty;
	return this;
}
v2.prototype.add =  v2.add

v2.minus = function(v){
	if(typeof this.x !== "undefined" || isNaN(this.x))
		return new v2(-v.x, -v.y)
	else
		this.x = - this.x, this.y = -this.y
	return this;
}

v2.prototype.minus = v2.minus

v2.scalar = function(s, v){
	if(v instanceof v2)
		return new v2(v.x*s, v.y*s)
	else
		this.x *= s, this.y *=s;
	return this;
}

v2.prototype.scalar = v2.scalar

v2.dot = function(x,y){
		if(x instanceof v2)
			if(typeof this.x === "undefined" && y instanceof v2)
				return x.x*y.x +x.y*y.y;
			else return this.x *x.x + this.y+ x.y;
		else return this.x*x+this.y*y
	}

v2.prototype.dot = v2.dot

v2.prototype.lenSquared = function(){
		return this.dot(this);
	}
v2.prototype.len = function (){
		return Math.sqrt(this.lenSquared);
	}
v2.prototype.norm = function(){
		var l = this.len();
		return new v2(this.x/l, this.y/l);
}

// Regions
rRect = function(pos, size){
	this.pos = pos, this.size = size;
}

rRect.prototype.checkIn = function(v, y){
	if(v instanceof v2)
		return (v.x>=pos().x && v.x <= this.pos().x+this.size().x && v.y >= this.pos().y && v.y <= this.pos().y + this.size().y)
	else return (v>=this.pos().x && v <= this.pos().x+this.size().x && y >= this.pos().y && y <= this.pos().y + this.size().y)
}

rCirc = function(pos,r){
	this.pos = pos, this.r=r;
}

rCirc.prototype.checkIn = function(v,y){
	if(v instanceof v2)
		return ((v.x-this.pos().x)^2+(v.y-this.pos().y)^2)<= (this.r^2)
	else return ((v-this.pos().x)*(v-this.pos().x) + (y-this.pos().y)*(y-this.pos().y)) <= (this.r*this.r)
}


function muuNode (){
	this.parent = false;
	this.position = new v2;
	this._rotation = 0;
	this._scale = 1;
	this._follow;
	this._followv2;
}

muuNode.prototype.moveTo = function(pos, y){
	if(pos instanceof v2) this.position = pos;
	else this.position = new v2(pos, y);
	return this;
}

muuNode.prototype.getPos = function(){
	if(!this._follow) return this.position;
	else return v2.add(this._follow.getPos(), this._followv2);
}

muuNode.prototype.getAbsPos = function(){
	if(this._follow) return v2.add(this._follow.getAbsPos(), this._followv2);
	if(this.parent) return new v2.add(this.getPos(), this.parent.getAbsPos());
	else return this.getPos();
}

muuNode.prototype.getRoot = function(){
    if(this.render) return this;
    else if(this.parent) return this.parent.getRoot();
    else return false;
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

muuNode.prototype.event = function(events, callback, region){
    if(typeof region === "undefined") region = this.region();
	for(var i in events)
		muuEVENTS[events[i]].push({object:this, region:region, callback:callback});
}

muuNode.prototype.clearEvent = function(events){
    if(typeof events === "undefined") events = ["mousedown", "mouseup", "mousemove"];
    else if(typeof events === "string") events = [events];
    for (var e in events)
        for(var i=0; i< muuEVENTS[events[e]].length; i++)
            if(muuEVENTS[events[e]][i].object === this){
                 muuEVENTS[events[e]].splice(i,1);
                 i--;
            }
}

muuNode.prototype.follow = function(node, v){
	this._follow = node;
	this._followv2 = v || new v2;
}

muuNode.prototype.unfollow = function(){
    //Get this position to be what it looks like
    this.position.add(v2.add(this.getAbsPos(), v2.minus(this.position))).add(this._followv2)
	this._follow = false;
}

function Layer (){
    muuNode.call(this)
	this.objects = [];
}

Layer.prototype = new muuNode();
Layer.prototype.constructor = Layer;

Layer.prototype.add = function(nod){
    muuNode()
	nod.parent = this;
	this.objects.push(nod);
	return this;
}

Layer.prototype.rem =function(nod){
	nod.parent = false;
    var index = this.objects.indexOf(nod);
    if(index === -1) return
	this.objects.splice(index,1);
	return this;
}

Layer.prototype.paintTo = function(context){
	context.translate(this.getPos().x, this.getPos().y);
	context.rotate(this.rotation());
	context.scale(this.scale(), this.scale());
    var l = this.objects.length;
	for(var i =0; i< l; i++)
		var obj = this.objects[i].paintTo(context);
	context.scale(1/this.scale(), 1/this.scale());
    context.rotate(-this.rotation());
	context.translate(-this.getPos().x, -this.getPos().y)
}

function Sprite(img){
	this.img = muu.getSprite(img);
    this._size = new v2(this.img.size.x, this.img.size.y)
}

Sprite.prototype = new muuNode();
Sprite.constructor = Sprite;

Sprite.prototype.size = function(s, y){
	if(typeof s === "undefined")
		return this._size;
	else if(s instanceof v2) this._size = s;
	else this._size = new v2(s,y);
    return this;
}

Sprite.prototype.change = function(img){
    var s = this.size();
	this.img = muu.getSprite(img);
    this.size(s);
    var root = this.getRoot();
    if(root) if(!root.dinamic) root.render();
    return this;
}

Sprite.prototype.sprite = function(){
    return this.img.name;
}

// Default region
Sprite.prototype.region = function(){
    if (arguments.length) console.log("you can't overwrite the region of a sprite");
    var t = this;
    return new rRect(function(){return v2.add(t.getAbsPos(), v2.scalar(-0.5,t.size()))}, function(){return t.size()});
}

Sprite.prototype.paintTo = function(context){
	context.translate(this.getPos().x, this.getPos().y);
	context.rotate(this.rotation());
    context.translate(-this.size().x/2, -this.size().y/2)
	context.scale(this.scale(), this.scale());
	this.img.paintTo(context, this.size());
	context.scale(1/this.scale(), 1/this.scale());
    context.translate(this.size().x/2, this.size().y/2)
    context.rotate(-this.rotation());
	context.translate(-this.getPos().x, -this.getPos().y)
}

// Should be renamed to fillstrokable or something
function Paintable(){
	this._fill = "rgb(0,0,0)";
	this._stroke = "rgb(0,0,0)";
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

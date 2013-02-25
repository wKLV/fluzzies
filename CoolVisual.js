//set main namespace
goog.provide('CoolGame');

goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');


goog.require('box2d.World');
//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.Polygon');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.fill.LinearGradient');

var Node = function(){
    this.element = new lime.Layer;
}

Node.prototype.add = function(element){
    this.element.appendChild(element.element);
    return this;
}

Node.prototype.rem = function(element){
    this.element.removeChild(element.element);
    return this;
}

Node.prototype.moveTo = function(posx, posy){
    this.element.setPosition(posx, posy);
    return this;
}

Node.prototype.getPos = function(){
    return this.element.getPosition();
}

Node.prototype.rotation = function(angle){
    if(typeof angle === "undefined") return this.element.getRotation();
    this.element.setRotation(angle);
    return this;
}

Node.prototype.scale = function(x,y){
    if(typeof(x) === "undefined")
        return this.element.getScale();
    this.element.setScale(x,y);
    return this;
}

Node.prototype.event = function(){
    arguments = Array.prototype.slice.call(arguments, 0);
    arguments.splice(0,0, this.element);
    goog.events.listen.apply(goog.events, arguments);
    return this;
}

var Scene = function(parent,x,y){
    $.extend(this, Node);
    this.director = new lime.Director(parent,x,y);
    this.scene = this.element = new lime.Scene();
    return this;
}

Scene.prototype = $.extend(Scene.prototpe, Node.prototype);

Scene.prototype.substitute = function(scene){
    this.scene = this.element = scene;
    this.director.replaceScene(this.scene)
    this.director.makeMobileWebAppCapable()
    return this;
}

var Sprite = function(size, fill){
//    $.extend(this, Node);
    this.element = new lime.Sprite();
 //   this.element.setSize(size);
 //   this.element.setFill(fill);
    return this;
}

Sprite.prototype = $.extend(Sprite.prototype, Node.prototype);

Sprite.prototype.size = function(size){
    this.element.setSize.apply(this.element, arguments)
    return this;
}

Sprite.prototype.fill = function(fill){
    if(typeof fill === "undefined") {
        return this.element.getFill().url_;
    }
    this.element.setFill.apply(this.element, arguments);
    return this;
}

var Circle = function(size, fill){
    $.extend(this, Sprite);
    this.element = new lime.Circle();
 //   this.element.setSize(size);
 //   this.element.setFill(fill);
    return this;
}

Circle.prototype = $.extend(Circle.prototype, Sprite.prototype);

var Polygon = function(shape){
    $.extend(this, Sprite);
    this.element = new lime.Polygon(shape);
    return this;
}

Polygon.prototype = $.extend(Polygon.prototype, Sprite.prototype);

Polygon.prototype.setShape = function(shape){
    this.element.setPoints(shape);
    return this;
}

Polygon.prototype.stroke = function(stroke){
    this.element.setStroke(stroke);
    return this;
}

Label = function(text){
    this.element = new lime.Label().setText(text);
}
Label.prototype = $.extend(Label.prototype, Node.prototype);

Label.prototype.text = function(text){
    if(text) this.element.setText(text);
    else return text
    return this;
}
